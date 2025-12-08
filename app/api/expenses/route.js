import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

//
// =========================
// GET (Fetch + Filters)
// =========================
// Supports filters:
// - category
// - vendor
// - activity
// - from (start date)
// - to (end date)
//
export async function GET(request) {
  try {
    const params = request.nextUrl.searchParams;

    const category = params.get('category') || "";
    const vendor = params.get('vendor') || "";
    const activity = params.get('activity') || "";
    const from = params.get('from') || "";
    const to = params.get('to') || "";

    // Base query
    let sql = `
      SELECT id, category, amount, date, vendor, activity, receipt_url
      FROM expenses
      WHERE 1=1
    `;

    let sqlParams = [];

    // Apply filters dynamically
    if (category) {
      sql += ` AND category = $${sqlParams.length + 1}`;
      sqlParams.push(category);
    }

    if (vendor) {
      sql += ` AND LOWER(vendor) LIKE LOWER($${sqlParams.length + 1})`;
      sqlParams.push(`%${vendor}%`);
    }

    if (activity) {
      sql += ` AND LOWER(activity) LIKE LOWER($${sqlParams.length + 1})`;
      sqlParams.push(`%${activity}%`);
    }

    if (from) {
      sql += ` AND date >= $${sqlParams.length + 1}`;
      sqlParams.push(from);
    }

    if (to) {
      sql += ` AND date <= $${sqlParams.length + 1}`;
      sqlParams.push(to);
    }

    sql += ` ORDER BY date DESC`;

    const result = await query(sql, sqlParams);

    return NextResponse.json(result.rows || [], { status: 200 });

  } catch (err) {
    console.error('GET /api/expenses error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch expenses' },
      { status: 500 }
    );
  }
}

//
// =========================
// POST (Create Expense)
// =========================
//
export async function POST(request) {
  try {
    const { category, amount, date, vendor, activity, receipt_url } =
      await request.json();

    if (!category || !amount || !date || !vendor || !activity) {
      return NextResponse.json(
        { error: 'Missing required fields.' },
        { status: 400 }
      );
    }

    await query(
      `INSERT INTO expenses (category, amount, date, vendor, activity, receipt_url)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [category, amount, date, vendor, activity, receipt_url || null]
    );

    return NextResponse.json({ success: true }, { status: 201 });

  } catch (err) {
    console.error('POST /api/expenses error:', err);
    return NextResponse.json(
      { error: 'Failed to save expense' },
      { status: 500 }
    );
  }
}

//
// =========================
// PUT (Update Expense)
// =========================
//
export async function PUT(request) {
  try {
    const { id, category, amount, date, vendor, activity, receipt_url } =
      await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Missing ID.' },
        { status: 400 }
      );
    }

    await query(
      `UPDATE expenses
       SET category=$1, amount=$2, date=$3, vendor=$4, activity=$5, receipt_url=$6
       WHERE id=$7`,
      [category, amount, date, vendor, activity, receipt_url || null, id]
    );

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (err) {
    console.error('PUT /api/expenses error:', err);
    return NextResponse.json(
      { error: 'Failed to update expense' },
      { status: 500 }
    );
  }
}

//
// =========================
// DELETE (Delete Expense)
// =========================
//
export async function DELETE(request) {
  try {
    const id = request.nextUrl.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Missing ID.' },
        { status: 400 }
      );
    }

    await query(`DELETE FROM expenses WHERE id=$1`, [id]);

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (err) {
    console.error('DELETE /api/expenses error:', err);
    return NextResponse.json(
      { error: 'Failed to delete expense' },
      { status: 500 }
    );
  }
}
