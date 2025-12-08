'use client';

import { useMemo } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Charts({ expenses = [] }) {
  const safeExpenses = Array.isArray(expenses) ? expenses : [];

  const { categoryLabels, categoryData, monthLabels, monthData } = useMemo(() => {
    const catMap = {};
    const monthMap = {};

    safeExpenses.forEach((e) => {
      const amount = Number(e.amount) || 0;
      const category = e.category || 'Uncategorized';
      const dateStr = e.date || '';
      const monthKey = dateStr.length >= 7 ? dateStr.slice(0, 7) : 'Unknown';

      catMap[category] = (catMap[category] || 0) + amount;
      monthMap[monthKey] = (monthMap[monthKey] || 0) + amount;
    });

    const categoryLabels = Object.keys(catMap);
    const categoryData = categoryLabels.map((k) => Math.round(catMap[k] * 100) / 100);

    // sort months ascending
    const monthLabels = Object.keys(monthMap).sort();
    const monthData = monthLabels.map((k) => Math.round(monthMap[k] * 100) / 100);

    return { categoryLabels, categoryData, monthLabels, monthData };
  }, [safeExpenses]);

  const pieData = {
    labels: categoryLabels,
    datasets: [
      {
        data: categoryData,
        backgroundColor: categoryLabels.map((_, i) =>
          // simple color cycling using the two brand colors + greys
          i % 3 === 0 ? 'var(--crimson)' : i % 3 === 1 ? 'var(--yale)' : '#6c757d'
        ),
        borderWidth: 0,
      },
    ],
  };

  const barData = {
    labels: monthLabels,
    datasets: [
      {
        label: 'Monthly Spend (₹)',
        data: monthData,
        backgroundColor: 'var(--yale)',
      },
    ],
  };

  return (
    <div style={{ display: 'grid', gap: '28px' }}>
      <div>
        <h3 style={{ color: 'var(--yale)' }}>Category-wise Spend</h3>
        {categoryLabels.length === 0 ? (
          <p>No expense data to show.</p>
        ) : (
          <div style={{ maxWidth: 600 }}>
            <Pie data={pieData} />
          </div>
        )}
      </div>

      <div>
        <h3 style={{ color: 'var(--yale)' }}>Monthly Spend</h3>
        {monthLabels.length === 0 ? (
          <p>No expense data to show.</p>
        ) : (
          <div style={{ maxWidth: 900 }}>
            <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        )}
      </div>
    </div>
  );
}