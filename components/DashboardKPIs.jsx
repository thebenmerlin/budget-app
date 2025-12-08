'use client';

import React from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  DollarSign,
  FileDown,
  Plus,
  ArrowRight,
} from 'lucide-react';

export default function DashboardKPIs({ data }) {
  // Extract data - EXACT same structure as original
  const { budget, totals } = data;
  const { proposedTotal, allottedTotal } = budget;
  const { totalSpent, overallRemaining } = totals;

  // Format currency - EXACT same function as original
  const formatted = (n) =>
    `₹ ${Number(n || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  // Determine remaining color
  const remainingColor = overallRemaining < 0 ? 'text-red-600' : 'text-green-700';
  const remainingBgColor =
    overallRemaining < 0 ? 'bg-red-50' : 'bg-green-50';

  // Calculate budget utilization percentage
  const utilizationPercent =
    allottedTotal > 0 ? Math.round((totalSpent / allottedTotal) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* KPI Grid - 2x2 on desktop, 1 column on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1: Proposed Budget */}
        <div className="card card-lg bg-gradient-to-br from-white to-neutral-50 border-l-4 border-l-[#821910] hover:shadow-lg transition-all duration-300">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-neutral-600 font-medium uppercase tracking-wider">
                Proposed Budget
              </p>
              <p className="text-3xl font-bold text-neutral-900 mt-2">
                {formatted(proposedTotal)}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <TrendingUp size={24} className="text-[#821910]" />
            </div>
          </div>

          <p className="text-xs text-neutral-500 mb-4">
            Planned for the academic year
          </p>

          <div className="flex gap-2 pt-4 border-t border-neutral-200">
            <Link
              href="/budget"
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-[#821910] text-white rounded-md text-xs font-semibold hover:bg-[#5a110b] transition-all duration-200"
            >
              <span>View</span>
              <ArrowRight size={14} />
            </Link>
            <a
              href="/api/export/excel?from=&to=&category=&vendor=&activity="
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 border border-neutral-300 text-neutral-700 rounded-md text-xs font-semibold hover:bg-neutral-50 transition-all duration-200"
              title="Export to Excel"
            >
              <FileDown size={14} />
              <span>Excel</span>
            </a>
          </div>
        </div>

        {/* KPI 2: Allotted Budget */}
        <div className="card card-lg bg-gradient-to-br from-white to-neutral-50 border-l-4 border-l-[#243169] hover:shadow-lg transition-all duration-300">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-neutral-600 font-medium uppercase tracking-wider">
                Allotted Budget
              </p>
              <p className="text-3xl font-bold text-neutral-900 mt-2">
                {formatted(allottedTotal)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign size={24} className="text-[#243169]" />
            </div>
          </div>

          <p className="text-xs text-neutral-500 mb-4">
            Funds officially allotted
          </p>

          <div className="flex gap-2 pt-4 border-t border-neutral-200">
            <Link
              href="/budget"
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 border border-[#243169] text-[#243169] rounded-md text-xs font-semibold hover:bg-blue-50 transition-all duration-200"
            >
              <span>Manage</span>
              <ArrowRight size={14} />
            </Link>
            <a
              href="/api/export/pdf?from=&to=&category=&vendor=&activity="
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-[#243169] text-white rounded-md text-xs font-semibold hover:bg-[#1a1f45] transition-all duration-200"
              title="Export to PDF"
            >
              <FileDown size={14} />
              <span>PDF</span>
            </a>
          </div>
        </div>

        {/* KPI 3: Total Spent */}
        <div className="card card-lg bg-gradient-to-br from-white to-neutral-50 border-l-4 border-l-orange-500 hover:shadow-lg transition-all duration-300">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-neutral-600 font-medium uppercase tracking-wider">
                Total Spent
              </p>
              <p className="text-3xl font-bold text-neutral-900 mt-2">
                {formatted(totalSpent)}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <DollarSign size={24} className="text-orange-600" />
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs text-neutral-500">Budget utilization</p>
              <span className="text-xs font-semibold text-neutral-700">
                {utilizationPercent}%
              </span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-orange-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(utilizationPercent, 100)}%` }}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t border-neutral-200">
            <Link
              href="/expenses"
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 border border-neutral-300 text-neutral-700 rounded-md text-xs font-semibold hover:bg-neutral-50 transition-all duration-200"
            >
              <span>View</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/expenses/add"
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-orange-600 text-white rounded-md text-xs font-semibold hover:bg-orange-700 transition-all duration-200"
            >
              <Plus size={14} />
              <span>Add</span>
            </Link>
          </div>
        </div>

        {/* KPI 4: Remaining Budget */}
        <div
          className={`card card-lg bg-gradient-to-br border-l-4 ${
            overallRemaining < 0
              ? 'from-white to-red-50 border-l-red-600'
              : 'from-white to-green-50 border-l-green-600'
          } hover:shadow-lg transition-all duration-300`}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-neutral-600 font-medium uppercase tracking-wider">
                Remaining
              </p>
              <p className={`text-3xl font-bold mt-2 ${remainingColor}`}>
                {formatted(overallRemaining)}
              </p>
            </div>
            <div
              className={`p-3 rounded-lg ${remainingBgColor}`}
            >
              <TrendingUp
                size={24}
                className={overallRemaining < 0 ? 'text-red-600' : 'text-green-600'}
              />
            </div>
          </div>

          <div className="mb-4">
            <p className="text-xs text-neutral-500">
              {overallRemaining < 0
                ? 'Budget exceeded'
                : 'Budget available'}
            </p>
            <div className="mt-2">
              <span
                className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                  overallRemaining < 0
                    ? 'bg-red-100 text-red-700'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {overallRemaining < 0 ? 'Over Budget' : 'On Track'}
              </span>
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t border-neutral-200">
            <Link
              href="/expenses"
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 border border-neutral-300 text-neutral-700 rounded-md text-xs font-semibold hover:bg-neutral-50 transition-all duration-200"
            >
              <span>Expenses</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/expenses/add"
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-[#821910] text-white rounded-md text-xs font-semibold hover:bg-[#5a110b] transition-all duration-200"
            >
              <Plus size={14} />
              <span>Add</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats Footer */}
      <div className="bg-white rounded-lg border border-neutral-200 p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-neutral-500 uppercase tracking-wider">
              Total Budget
            </p>
            <p className="text-lg font-bold text-neutral-900 mt-1">
              {formatted(proposedTotal)}
            </p>
          </div>
          <div>
            <p className="text-xs text-neutral-500 uppercase tracking-wider">
              Allocated
            </p>
            <p className="text-lg font-bold text-neutral-900 mt-1">
              {formatted(allottedTotal)}
            </p>
          </div>
          <div>
            <p className="text-xs text-neutral-500 uppercase tracking-wider">
              Spent
            </p>
            <p className="text-lg font-bold text-neutral-900 mt-1">
              {formatted(totalSpent)}
            </p>
          </div>
          <div>
            <p className="text-xs text-neutral-500 uppercase tracking-wider">
              Utilization
            </p>
            <p className={`text-lg font-bold mt-1 ${remainingColor}`}>
              {utilizationPercent}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
