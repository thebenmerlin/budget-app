import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query(`
      SELECT proposed, allotted
      FROM budgets
      ORDER BY id DESC
      LIMIT 1
    `);

    if (result.rows.length === 0) {
      return NextResponse.json(null, { status: 200 });
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to fetch budget' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { proposed, allotted } = await request.json();

    if (!proposed || !allotted) {
      return NextResponse.json(
        { error: 'Missing proposed or allotted budget.' },
        { status: 400 }
      );
    }

    await query(
      `INSERT INTO budgets (proposed, allotted) VALUES ($1, $2)`,
      [proposed, allotted]
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to save budget' },
      { status: 500 }
    );
  }
}