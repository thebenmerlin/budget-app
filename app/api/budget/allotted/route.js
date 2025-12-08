// app/api/budget/allotted/route.js
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

const CATEGORIES = [
  'infrastructure',
  'hardware',
  'software',
  'workshops',
  'expert_talks',
  'events',
  'stationary',
  'student_activities',
  'misc'
];

export async function POST(request) {
  try {
    const body = await request.json();

    const academic_year = (body.academic_year || '').trim();
    if (!academic_year) {
      return NextResponse.json({ error: 'Missing academic_year' }, { status: 400 });
    }

    const allotted_total = Number(body.allotted_total || 0);
    const allotted_values = CATEGORIES.map((c) => {
      const key = `allotted_${c}`;
      return Number(body[key] ?? 0);
    });

    // Ensure record exists
    const existsRes = await query(
      `SELECT id FROM budgets WHERE academic_year = $1 LIMIT 1`,
      [academic_year]
    );

    if (existsRes.rows.length === 0) {
      return NextResponse.json({ error: 'Proposed budget not found. Create proposed first.' }, { status: 404 });
    }

    // Update only allotted fields
    const updateSql = `
      UPDATE budgets SET
        allotted_total = $1,
        allotted_infrastructure = $2,
        allotted_hardware = $3,
        allotted_software = $4,
        allotted_workshops = $5,
        allotted_expert_talks = $6,
        allotted_events = $7,
        allotted_stationary = $8,
        allotted_student_activities = $9,
        allotted_misc = $10,
        updated_at = now()
      WHERE academic_year = $11
      RETURNING *
    `;
    const params = [
      allotted_total,
      ...allotted_values,
      academic_year
    ];

    const res = await query(updateSql, params);
    return NextResponse.json({ success: true, data: res.rows[0] }, { status: 200 });

  } catch (err) {
    console.error('POST /api/budget/allotted error:', err);
    return NextResponse.json({ error: 'Failed to save allotted budget' }, { status: 500 });
  }
}
