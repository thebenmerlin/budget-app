// app/api/budget/[year]/route.js
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const year = params.year;
    if (!year) {
      return NextResponse.json({ error: 'Missing year' }, { status: 400 });
    }

    const res = await query(
      `SELECT * FROM budgets WHERE academic_year = $1 LIMIT 1`,
      [year]
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(res.rows[0], { status: 200 });
  } catch (err) {
    console.error('GET /api/budget/[year] error:', err);
    return NextResponse.json({ error: 'Failed to fetch budget' }, { status: 500 });
  }
}
