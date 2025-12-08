import ExcelJS from "exceljs";
import { query } from "@/lib/db";

const INSTITUTE_NAME = "JSPM's Rajarshi Shahu College of Engineering";
const DEPARTMENT_NAME = "Department of Computer Science and Business Systems";

function formatINR(value) {
  if (!value) return "₹0.00";
  return "₹" + Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export async function GET(req) {
  try {
    const params = req.nextUrl.searchParams;

    const sqlParams = [];
    let where = " WHERE 1=1";

    const category = params.get("category") || "";
    const vendor = params.get("vendor") || "";
    const activity = params.get("activity") || "";
    const from = params.get("from") || "";
    const to = params.get("to") || "";

    if (category) { where += ` AND category=$${sqlParams.length + 1}`; sqlParams.push(category); }
    if (vendor) { where += ` AND LOWER(vendor) LIKE LOWER($${sqlParams.length + 1})`; sqlParams.push(`%${vendor}%`); }
    if (activity) { where += ` AND LOWER(activity) LIKE LOWER($${sqlParams.length + 1})`; sqlParams.push(`%${activity}%`); }
    if (from) { where += ` AND date >= $${sqlParams.length + 1}`; sqlParams.push(from); }
    if (to) { where += ` AND date <= $${sqlParams.length + 1}`; sqlParams.push(to); }

    const expRes = await query(
      `SELECT category, amount, date, vendor, activity, receipt_url 
       FROM expenses 
       ${where}
       ORDER BY date ASC`,
      sqlParams
    );

    const expenses = expRes.rows || [];

    // Build Excel
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Budget Report");

    // Institute header (merged)
    sheet.mergeCells("A1:F1");
    sheet.getCell("A1").value = INSTITUTE_NAME;
    sheet.getCell("A1").font = { size: 16, bold: true };
    sheet.getCell("A1").alignment = { horizontal: "center" };

    // Department header
    sheet.mergeCells("A2:F2");
    sheet.getCell("A2").value = DEPARTMENT_NAME;
    sheet.getCell("A2").font = { size: 13, bold: true };
    sheet.getCell("A2").alignment = { horizontal: "center" };

    sheet.addRow([]);

    // Table header
    sheet.addRow(["Date", "Category", "Vendor", "Activity", "Amount", "Receipt URL"]);

    const headerRow = sheet.getRow(sheet.rowCount);
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: "center" };

    expenses.forEach((e) => {
      sheet.addRow([
        e.date instanceof Date ? e.date.toISOString().slice(0, 10) : String(e.date).slice(0, 10),
        e.category,
        e.vendor,
        e.activity,
        formatINR(e.amount),
        e.receipt_url || "-"
      ]);
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="budget_report.xlsx"',
      },
    });

  } catch (err) {
    console.error("Excel Export Error:", err);
    return new Response(JSON.stringify({ error: "Failed to generate Excel" }), { status: 500 });
  }
}
