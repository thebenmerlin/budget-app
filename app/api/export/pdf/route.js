// app/api/export/pdf/route.js
import { NextResponse } from 'next/server';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { query } from '@/lib/db';
import fs from 'fs';
import path from 'path';

// fontkit is required by pdf-lib when embedding custom TTF fonts
import * as fontkit from 'fontkit';

function safeFormatINR(value) {
  const n = Number(value || 0);
  if (!Number.isFinite(n)) return 'INR 0.00';
  // Return symbol form; caller will convert to "INR" if font doesn't support ₹
  return '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fallbackFormatINRForWinAnsi(value) {
  // When using StandardFonts (WinAnsi), return "INR 1,234.00" instead of ₹
  const n = Number(value || 0);
  if (!Number.isFinite(n)) return 'INR 0.00';
  return 'INR ' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Helper: find first existing path in list
function findExisting(paths) {
  for (const p of paths) {
    try {
      if (fs.existsSync(p)) return p;
    } catch (e) {
      // ignore
    }
  }
  return null;
}

// Small helper to avoid very long strings drawing overflow
function ellipsize(s, max = 30) {
  if (!s) return '-';
  const str = String(s);
  return str.length > max ? str.slice(0, max - 1) + '…' : str;
}

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    const category = searchParams.get('category') || '';
    const vendor = searchParams.get('vendor') || '';
    const activity = searchParams.get('activity') || '';
    const from = searchParams.get('from') || '';
    const to = searchParams.get('to') || '';

    // Fetch expenses (with safe date casts)
    const expensesRes = await query(
      `
      SELECT id, category, amount, date, vendor, activity, receipt_url
      FROM expenses
      WHERE ($1 = '' OR category = $1)
        AND ($2 = '' OR vendor ILIKE '%' || $2 || '%')
        AND ($3 = '' OR activity ILIKE '%' || $3 || '%')
        AND ($4 = '' OR date >= CAST($4 AS DATE))
        AND ($5 = '' OR date <= CAST($5 AS DATE))
      ORDER BY date ASC
      `,
      [category, vendor, activity, from, to]
    );

    const expenses = expensesRes.rows || [];

    // Try to embed a Unicode TTF font (NotoSans recommended)
    // candidate font locations (project root public folder)
    const fontCandidates = [
      path.join(process.cwd(), 'public', 'fonts', 'NotoSans-Regular.ttf'),
      path.join(process.cwd(), 'public', 'fonts', 'NotoSans.ttf'),
      path.join(process.cwd(), 'public', 'NotoSans-Regular.ttf'),
      path.join(process.cwd(), 'public', 'NotoSans.ttf')
    ];

    const foundFontPath = findExisting(fontCandidates);

    // Also try to find a logo
    const logoCandidates = [
      path.join(process.cwd(), 'public', 'logo.jpeg'),
      path.join(process.cwd(), 'public', 'logo.jpg'),
      path.join(process.cwd(), 'public', 'logo.png')
    ];
    const foundLogoPath = findExisting(logoCandidates);

    // Create PDF
    const pdfDoc = await PDFDocument.create();

    let font; // will be pdf-lib font object
    let useUnicodeFont = false;

    if (foundFontPath) {
      // register fontkit and embed custom font
      try {
        pdfDoc.registerFontkit(fontkit);
        const fontBytes = fs.readFileSync(foundFontPath);
        font = await pdfDoc.embedFont(fontBytes);
        useUnicodeFont = true;
      } catch (e) {
        console.warn('PDF export: failed embedding custom font, falling back to standard fonts.', e);
        font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        useUnicodeFont = false;
      }
    } else {
      // fallback to standard font (WinAnsi) — cannot render ₹
      font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      useUnicodeFont = false;
    }

    // Logo embedding (optional)
    let logoImage;
    if (foundLogoPath) {
      try {
        const logoBytes = fs.readFileSync(foundLogoPath);
        const ext = path.extname(foundLogoPath).toLowerCase();
        if (ext === '.png') {
          logoImage = await pdfDoc.embedPng(logoBytes);
        } else {
          // treat jpg/jpeg as jpg
          logoImage = await pdfDoc.embedJpg(logoBytes);
        }
      } catch (e) {
        console.warn('PDF export: failed to embed logo (continuing without logo)', e);
        logoImage = null;
      }
    }

    // Layout settings
    const pageWidth = 595; // A4 ~ 595 x 842 pts
    const pageHeight = 842;
    const margin = 48;
    const usableWidth = pageWidth - margin * 2;

    // Pagination helpers
    let page = pdfDoc.addPage([pageWidth, pageHeight]);
    let y = pageHeight - margin;

    const lineHeight = 14;
    const rowHeight = 18;

    // draw header: logo + institute name + department + period
    const institute = "JSPM's Rajarshi Shahu College of Engineering";
    const department = 'Department of Computer Science and Business Systems';
    const periodText = `Report Period: ${from || 'Start'} to ${to || 'End'}`;

    // logo
    if (logoImage) {
      const logoWidth = 90;
      const logoHeight = (logoImage.height / logoImage.width) * logoWidth;
      const logoX = margin + (usableWidth - logoWidth) / 2;
      page.drawImage(logoImage, { x: logoX, y: y - logoHeight, width: logoWidth, height: logoHeight });
      y -= logoHeight + 8;
    }

    // institute name (centered)
    const instituteSize = 16;
    const instituteWidth = font.widthOfTextAtSize(institute, instituteSize);
    page.drawText(institute, { x: margin + (usableWidth - instituteWidth) / 2, y: y - instituteSize, size: instituteSize, font });
    y -= instituteSize + 6;

    // department
    const deptSize = 12;
    const deptWidth = font.widthOfTextAtSize(department, deptSize);
    page.drawText(department, { x: margin + (usableWidth - deptWidth) / 2, y: y - deptSize, size: deptSize, font });
    y -= deptSize + 6;

    // period
    const periodSize = 9;
    const periodWidth = font.widthOfTextAtSize(periodText, periodSize);
    page.drawText(periodText, { x: margin + (usableWidth - periodWidth) / 2, y: y - periodSize, size: periodSize, font });
    y -= periodSize + 12;

    // Summary: totals and category totals (compute)
    const totalSpent = expenses.reduce((s, e) => s + Number(e.amount || 0), 0);

    const catTotals = {};
    for (const e of expenses) {
      const k = e.category || 'Uncategorized';
      catTotals[k] = (catTotals[k] || 0) + Number(e.amount || 0);
    }

    // Summary box
    const summaryText = `Total Spent (filtered): ${useUnicodeFont ? safeFormatINR(totalSpent) : fallbackFormatINRForWinAnsi(totalSpent)}`;
    page.drawText(summaryText, { x: margin, y: y - 10, size: 10, font });
    y -= 22;

    // Table header — draw column titles with borders
    const cols = [
      { key: 'date', title: 'Date', width: 80 },
      { key: 'vendor', title: 'Vendor', width: 140 },
      { key: 'activity', title: 'Activity', width: 140 },
      { key: 'category', title: 'Category', width: 100 },
      { key: 'amount', title: 'Amount', width: 70 }
    ];

    function addNewPageIfNeeded(extra = 0) {
      if (y < margin + 120 + extra) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        y = pageHeight - margin;
        return true;
      }
      return false;
    }

    // Draw table header background
    addNewPageIfNeeded();
    const headerY = y;
    page.drawRectangle({ x: margin, y: headerY - rowHeight, width: usableWidth, height: rowHeight, color: rgb(0.95, 0.95, 0.95) });

    // draw header texts and vertical separators
    let cx = margin;
    for (const c of cols) {
      page.drawText(c.title, { x: cx + 4, y: headerY - rowHeight + 4, size: 10, font });
      // vertical line
      page.drawLine({ start: { x: cx, y: headerY - rowHeight }, end: { x: cx, y: headerY }, thickness: 0.6 });
      cx += c.width;
    }
    // right border
    page.drawLine({ start: { x: margin + usableWidth, y: headerY - rowHeight }, end: { x: margin + usableWidth, y: headerY }, thickness: 0.6 });
    // bottom border
    page.drawLine({ start: { x: margin, y: headerY - rowHeight }, end: { x: margin + usableWidth, y: headerY - rowHeight }, thickness: 0.6 });

    y = headerY - rowHeight - 6;

    // draw rows
    for (const e of expenses) {
      addNewPageIfNeeded();

      // format values
      const dateStr = e.date ? new Date(e.date).toISOString().slice(0, 10) : '-';
      const vendorStr = ellipsize(e.vendor || '-', 28);
      const activityStr = ellipsize(e.activity || '-', 28);
      const categoryStr = ellipsize(e.category || '-', 18);
      const amountStr = useUnicodeFont ? safeFormatINR(e.amount) : fallbackFormatINRForWinAnsi(e.amount);

      // cell draws
      let x = margin;
      const cellY = y - 2;
      page.drawText(dateStr, { x: x + 4, y: cellY, size: 9, font });
      x += cols[0].width;
      page.drawText(vendorStr, { x: x + 4, y: cellY, size: 9, font });
      x += cols[1].width;
      page.drawText(activityStr, { x: x + 4, y: cellY, size: 9, font });
      x += cols[2].width;
      page.drawText(categoryStr, { x: x + 4, y: cellY, size: 9, font });
      x += cols[3].width;
      // amount right-aligned inside last column
      const amtWidth = font.widthOfTextAtSize(amountStr, 9);
      page.drawText(amountStr, { x: margin + usableWidth - amtWidth - 6, y: cellY, size: 9, font });

      // draw row bottom border
      page.drawLine({ start: { x: margin, y: y - rowHeight }, end: { x: margin + usableWidth, y: y - rowHeight }, thickness: 0.5 });

      y -= rowHeight;
    }

    // after rows, category summary section
    addNewPageIfNeeded();
    y -= 8;
    page.drawText('Category-wise Summary', { x: margin, y: y, size: 11, font });
    y -= 16;

    for (const [cat, tot] of Object.entries(catTotals)) {
      addNewPageIfNeeded();
      const text = `${cat}: ${useUnicodeFont ? safeFormatINR(tot) : fallbackFormatINRForWinAnsi(tot)}`;
      page.drawText(text, { x: margin + 6, y: y, size: 10, font });
      y -= 14;
    }

    // finalize
    const pdfBytes = await pdfDoc.save();

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="department_budget_report.pdf"',
      },
    });
  } catch (err) {
    console.error('PDF Export Error:', err);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
