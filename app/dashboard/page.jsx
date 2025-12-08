// app/dashboard/page.jsx
import React from 'react';
import { query } from '@/lib/db';
import DashboardKPIs from '@/components/DashboardKPIs';
import CategoryBarChart from '@/components/CategoryBarChart';

// server component
export default async function DashboardPage() {
  // academic year default (same format you chose)
  const defaultYear = '2024-25';

  // convert academic year to start/end dates for expenses aggregation
  // format: "2024-25" -> start 2024-06-01 to end 2025-05-31 (same logic used before)
  const [startYear] = defaultYear.split('-');
  const startDate = `${startYear}-06-01`;
  const endDate = `${Number(startYear) + 1}-05-31`;

  // --- fetch latest budget for the academic year if exists ---
  let budget = {
    proposed_total: 0,
    allotted_total: 0,
    // per-category fallback zeros are not strictly required here
  };

  try {
    const bRes = await query(
      `SELECT * FROM budgets WHERE academic_year = $1 LIMIT 1`,
      [defaultYear]
    );
    if (bRes.rows && bRes.rows.length > 0) {
      budget = bRes.rows[0];
    }
  } catch (err) {
    // defensive: log on server, but continue with zeros
    console.error('Dashboard: failed to fetch budget', err);
  }

  // --- fetch expenses for the academic year (date range) ---
  let expenses = [];
  try {
    const eRes = await query(
      `
      SELECT id, category, amount, date
      FROM expenses
      WHERE date >= CAST($1 AS DATE) AND date <= CAST($2 AS DATE)
      ORDER BY date ASC
      `,
      [startDate, endDate]
    );
    expenses = eRes.rows || [];
  } catch (err) {
    console.error('Dashboard: failed to fetch expenses', err);
    expenses = [];
  }

  // compute totals
  const totalSpent = expenses.reduce((sum, r) => sum + Number(r.amount || 0), 0);
  const proposedTotal = Number(budget.proposed_total || 0);
  const allottedTotal = Number(budget.allotted_total || 0);
  const overallRemaining = allottedTotal - totalSpent;
  const variance = allottedTotal - proposedTotal; // allotted - proposed (can be negative)

  // category-wise totals
  const categoryTotals = {};
  for (const e of expenses) {
    const cat = e.category || 'Uncategorized';
    categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(e.amount || 0);
  }

  const categories = Object.keys(categoryTotals).sort((a, b) => categoryTotals[b] - categoryTotals[a]);
  const categoryData = categories.map((k) => ({ category: k, total: categoryTotals[k] }));

  // monthly totals (month labels for the academic year)
  // Build months from startDate to endDate inclusive
  const monthTotals = {}; // key: "YYYY-MM" => sum
  const start = new Date(startDate);
  const end = new Date(endDate);
  // normalize to first of month
  let cur = new Date(start.getFullYear(), start.getMonth(), 1);
  while (cur <= end) {
    const key = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, '0')}`;
    monthTotals[key] = 0;
    cur.setMonth(cur.getMonth() + 1);
  }
  for (const e of expenses) {
    const d = new Date(e.date);
    if (!isNaN(d)) {
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (monthTotals[key] === undefined) monthTotals[key] = 0;
      monthTotals[key] += Number(e.amount || 0);
    }
  }
  const monthlyLabels = Object.keys(monthTotals);
  const monthlyValues = monthlyLabels.map((k) => monthTotals[k]);

  // send data to client components
  const payload = {
    academicYear: defaultYear,
    budget: {
      proposedTotal,
      allottedTotal,
      variance
    },
    totals: {
      totalSpent,
      overallRemaining
    },
    categories: categoryData,
    monthly: {
      labels: monthlyLabels,
      values: monthlyValues
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">
          Overview for academic year <strong>{defaultYear}</strong>
        </p>
      </div>

      {/* KPI + Chart area */}
      <DashboardKPIs data={payload} />

      {/* Category bar chart */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Category Spend Breakdown</h3>
          <p className="text-sm text-gray-500">Sorted highest to lowest</p>
        </div>

        <CategoryBarChart data={payload.categories} />
      </div>

      {/* Monthly trend */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Monthly Spend Trend</h3>
          <p className="text-sm text-gray-500">Academic year timeline</p>
        </div>

        {/* lightweight monthly sparkline using CSS bars */}
        <div className="bg-white border rounded-md p-4">
          <div className="flex gap-2 items-end h-40">
            {payload.monthly.labels.map((label, idx) => {
              const v = payload.monthly.values[idx] || 0;
              // scale to max
              const max = Math.max(...payload.monthly.values, 1);
              const pct = Math.round((v / max) * 100);
              return (
                <div key={label} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full rounded-t-md"
                    style={{ height: `${Math.max(6, pct)}%`, backgroundColor: '#821910' }}
                    title={`${label}: ₹ ${v.toLocaleString('en-IN')}`}
                  />
                  <div className="text-xs text-gray-500 mt-2">{label.slice(5)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
