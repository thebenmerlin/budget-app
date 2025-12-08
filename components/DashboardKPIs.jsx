'use client';

import React from 'react';
import Link from 'next/link';

export default function DashboardKPIs({ data }) {
  const { budget, totals } = data;
  const { proposedTotal, allottedTotal } = budget;
  const { totalSpent, overallRemaining } = totals;

  const formatted = (n) =>
    `₹ ${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* KPI 1: Proposed */}
      <div className="bg-white border rounded-lg p-5 shadow-sm">
        <div className="text-sm text-gray-500">Proposed Budget</div>
        <div className="mt-2 text-2xl font-semibold text-primary">{formatted(proposedTotal)}</div>
        <div className="mt-3 text-xs text-gray-600">Planned for the academic year</div>
        <div className="mt-4 flex gap-2">
          <Link href="/budget" className="px-3 py-1 bg-primary text-white rounded-md text-sm">View Budget</Link>
          <a
            href={`/api/export/excel?from=&to=&category=&vendor=&activity=`}
            className="px-3 py-1 border rounded-md text-sm"
            style={{ borderColor: '#243169', color: '#243169' }}
          >
            Export Excel
          </a>
        </div>
      </div>

      {/* KPI 2: Allotted */}
      <div className="bg-white border rounded-lg p-5 shadow-sm">
        <div className="text-sm text-gray-500">Allotted Budget</div>
        <div className="mt-2 text-2xl font-semibold">{formatted(allottedTotal)}</div>
        <div className="mt-3 text-xs text-gray-600">Funds officially allotted</div>
        <div className="mt-4 flex gap-2">
          <Link href="/budget" className="px-3 py-1 border rounded-md text-sm" style={{ borderColor: '#821910', color: '#821910' }}>
            Manage Allotment
          </Link>
          <a
            href={`/api/export/pdf?from=&to=&category=&vendor=&activity=`}
            target="_blank"
            className="px-3 py-1 bg-primary text-white rounded-md text-sm"
          >
            Export PDF
          </a>
        </div>
      </div>

      {/* KPI 3: Spent / Remaining */}
      <div className="bg-white border rounded-lg p-5 shadow-sm">
        <div className="text-sm text-gray-500">Spent / Remaining</div>
        <div className="mt-2 flex items-baseline gap-4">
          <div>
            <div className="text-2xl font-semibold">{formatted(totalSpent)}</div>
            <div className="text-xs text-gray-600 mt-1">Total spent</div>
          </div>

          <div className="pl-4 border-l">
            <div className={`text-2xl font-semibold ${overallRemaining < 0 ? 'text-red-600' : 'text-green-700'}`}>
              {formatted(overallRemaining)}
            </div>
            <div className="text-xs text-gray-600 mt-1">Remaining</div>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-500">Quick actions</div>
        <div className="mt-2 flex gap-2">
          <Link href="/expenses" className="px-3 py-1 border rounded-md text-sm">View Expenses</Link>
          <Link href="/expenses/add" className="px-3 py-1 bg-primary text-white rounded-md text-sm">Add Expense</Link>
        </div>
      </div>
    </div>
  );
}
