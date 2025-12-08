// app/api/budget/proposed/route.js
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

    // Parse totals and category proposed values
    const proposed_total = Number(body.proposed_total || 0);

    const proposed_values = CATEGORIES.map((c) => {
      const key = `proposed_${c}`;
      return Number(body[key] ?? 0);
    });

    // If row exists -> update proposed fields only; else insert new row with allotted defaults
    const existsRes = await query(
      `SELECT id FROM budgets WHERE academic_year = $1 LIMIT 1`,
      [academic_year]
    );

    if (existsRes.rows.length === 0) {
      // insert new
      const insertSql = `
        INSERT INTO budgets (
          academic_year, proposed_total,
          proposed_infrastructure, proposed_hardware, proposed_software,
          proposed_workshops, proposed_expert_talks, proposed_events,
          proposed_stationary, proposed_student_activities, proposed_misc,
          allotted_total
        ) VALUES (
          $1, $2,
          $3, $4, $5,
          $6, $7, $8,
          $9, $10, $11,
          0
        ) RETURNING *
      `;
      const params = [academic_year, proposed_total, ...proposed_values];
      const res = await query(insertSql, params);
      return NextResponse.json({ success: true, data: res.rows[0] }, { status: 201 });
    } else {
      // update only proposed fields
      const updateSql = `
        UPDATE budgets SET
          proposed_total = $1,
          proposed_infrastructure = $2,
          proposed_hardware = $3,
          proposed_software = $4,
          proposed_workshops = $5,
          proposed_expert_talks = $6,
          proposed_events = $7,
          proposed_stationary = $8,
          proposed_student_activities = $9,
          proposed_misc = $10,
          updated_at = now()
        WHERE academic_year = $11
        RETURNING *
      `;
      const params = [
        proposed_total,
        ...proposed_values,
        academic_year
      ];
      const res = await query(updateSql, params);
      return NextResponse.json({ success: true, data: res.rows[0] }, { status: 200 });
    }

  } catch (err) {
    console.error('POST /api/budget/proposed error:', err);
    return NextResponse.json({ error: 'Failed to save proposed budget' }, { status: 500 });
  }
}
