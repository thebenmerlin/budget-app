'use client';

import React from 'react';

/**
 * Lightweight bar chart built with divs.
 * Expects data: [{ category, total }, ...] sorted desc.
 */
export default function CategoryBarChart({ data = [] }) {
  // defensive
  const max = Math.max(...data.map((d) => d.total), 1);

  return (
    <div className="bg-white border rounded-md p-4">
      <div className="space-y-3">
        {data.length === 0 && (
          <div className="text-gray-500 text-sm">No category spend yet.</div>
        )}

        {data.map((d) => {
          const pct = Math.round((d.total / max) * 100);
          return (
            <div key={d.category} className="flex items-center gap-4">
              <div className="w-48 text-sm text-gray-700">{d.category}</div>
              <div className="flex-1 bg-gray-100 rounded overflow-hidden h-6">
                <div
                  className="h-6 rounded-l"
                  style={{
                    width: `${Math.max(6, pct)}%`,
                    backgroundColor: '#821910'
                  }}
                  title={`${d.category}: ₹ ${Number(d.total).toLocaleString('en-IN')}`}
                />
              </div>
              <div className="w-32 text-right text-sm font-medium">₹ {Number(d.total).toLocaleString('en-IN')}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
