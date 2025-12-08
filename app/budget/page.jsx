'use client';

import React, { useEffect, useState } from 'react';

const CATEGORIES = [
  { key: 'infrastructure', label: 'Infrastructure' },
  { key: 'hardware', label: 'Hardware' },
  { key: 'software', label: 'Software' },
  { key: 'workshops', label: 'Workshops / FDP / Seminars' },
  { key: 'expert_talks', label: 'Expert Talks' },
  { key: 'events', label: 'Events / Fests' },
  { key: 'stationary', label: 'Stationary / Printing' },
  { key: 'student_activities', label: 'Student Activities' },
  { key: 'misc', label: 'Miscellaneous' }
];

function numberOrZero(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export default function BudgetPage() {
  const [year, setYear] = useState("2024-25");
  const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState(null);

  // PROPOSED
  const [proposedTotal, setProposedTotal] = useState('');
  const [proposedByCat, setProposedByCat] = useState({});

  // ALLOTTED
  const [allottedTotal, setAllottedTotal] = useState('');
  const [allottedByCat, setAllottedByCat] = useState({});

  // SPENT (NEW)
  const [spentByCat, setSpentByCat] = useState({});
  const [totalSpent, setTotalSpent] = useState(0);

  // --- LOAD BUDGET RECORD ---
  async function loadBudget(year) {
    const res = await fetch(`/api/budget/${encodeURIComponent(year)}`);
    if (res.ok) {
      const data = await res.json();
      setRecord(data);

      // Proposed
      setProposedTotal(data.proposed_total ?? '');
      const pb = {};
      CATEGORIES.forEach((c) => {
        pb[c.key] = data[`proposed_${c.key}`] ?? 0;
      });
      setProposedByCat(pb);

      // Allotted
      setAllottedTotal(data.allotted_total ?? '');
      const ab = {};
      CATEGORIES.forEach((c) => {
        ab[c.key] = data[`allotted_${c.key}`] ?? 0;
      });
      setAllottedByCat(ab);
    } else {
      setRecord(null);
      setProposedTotal('');
      setAllottedTotal('');
      setProposedByCat({});
      setAllottedByCat({});
    }
  }

  // --- LOAD SPENT FROM EXPENSES TABLE ---
  async function loadSpent(year) {
    // Convert academic year "2024-25" → year range (optional later)
    const start = `${year.split('-')[0]}-06-01`; // beginning of AY
    const end = `${parseInt(year.split('-')[0]) + 1}-05-31`; // end of AY

    const res = await fetch(`/api/expenses?from=${start}&to=${end}`);
    if (!res.ok) return;

    const data = await res.json();
    const expenses = Array.isArray(data) ? data : data.expenses || [];

    // Group by category
    const spent = {};
    let total = 0;

    expenses.forEach((e) => {
      const cat = e.category;
      const amt = Number(e.amount || 0);
      if (!spent[cat]) spent[cat] = 0;
      spent[cat] += amt;
      total += amt;
    });

    setSpentByCat(spent);
    setTotalSpent(total);
  }

  // --- LOAD ALL DATA ---
  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadBudget(year);
      await loadSpent(year);
      setLoading(false);
    })();
  }, [year]);

  // --- SAVE PROPOSED ---
  async function saveProposed(e) {
    e.preventDefault();
    const payload = {
      academic_year: year,
      proposed_total: numberOrZero(proposedTotal),
    };
    CATEGORIES.forEach((c) => {
      payload[`proposed_${c.key}`] = numberOrZero(proposedByCat[c.key]);
    });

    const res = await fetch('/api/budget/proposed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (!res.ok) {
      alert(json.error || "Failed to save proposed budget");
      return;
    }
    alert("Proposed Budget Saved");
    loadBudget(year);
  }

  // --- SAVE ALLOTTED ---
  async function saveAllotted(e) {
    e.preventDefault();

    if (!record) {
      alert("Create proposed budget first.");
      return;
    }

    const payload = {
      academic_year: year,
      allotted_total: numberOrZero(allottedTotal),
    };
    CATEGORIES.forEach((c) => {
      payload[`allotted_${c.key}`] = numberOrZero(allottedByCat[c.key]);
    });

    const res = await fetch('/api/budget/allotted', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (!res.ok) {
      alert(json.error || "Failed to save allotted budget");
      return;
    }

    alert("Allotted Budget Saved");
    loadBudget(year);
  }

  // --- UI ---
  return (
    <div style={{ padding: 24 }}>
      <h1>Budget Overview</h1>

      {/* YEAR SELECTION */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ marginRight: 8 }}>Academic Year:</label>
        <input
          value={year}
          onChange={(e) => setYear(e.target.value)}
          style={{ width: 120 }}
        />
        <span style={{ marginLeft: 12 }}>
          {loading ? "Loading..." : record ? "Record Loaded" : "No Record Yet"}
        </span>
      </div>

      {/* GRID LAYOUT */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>

        {/* PROPOSED BUDGET */}
        <section style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16 }}>
          <h2>Proposed Budget</h2>

          <form onSubmit={saveProposed}>
            <div style={{ marginBottom: 12 }}>
              <label>Total Proposed</label>
              <input
                type="number"
                value={proposedTotal}
                onChange={(e) => setProposedTotal(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>

            <hr style={{ margin: "12px 0" }} />

            {CATEGORIES.map((c) => (
              <div key={c.key} style={{ marginBottom: 10 }}>
                <b>{c.label}</b>
                <input
                  type="number"
                  value={proposedByCat[c.key] ?? ""}
                  onChange={(e) =>
                    setProposedByCat({ ...proposedByCat, [c.key]: e.target.value })
                  }
                  style={{ width: "100%", marginTop: 4 }}
                />
              </div>
            ))}

            <button type="submit" style={{ marginTop: 12 }}>
              Save Proposed
            </button>
          </form>
        </section>

        {/* ALLOTTED BUDGET */}
        <section style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16 }}>
          <h2>Allotted Budget</h2>

          <form onSubmit={saveAllotted}>
            <div style={{ marginBottom: 12 }}>
              <label>Total Allotted</label>
              <input
                type="number"
                value={allottedTotal}
                onChange={(e) => setAllottedTotal(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>

            <hr style={{ margin: "12px 0" }} />

            {CATEGORIES.map((c) => (
              <div key={c.key} style={{ marginBottom: 10 }}>
                <b>{c.label}</b>
                <input
                  type="number"
                  value={allottedByCat[c.key] ?? ""}
                  onChange={(e) =>
                    setAllottedByCat({ ...allottedByCat, [c.key]: e.target.value })
                  }
                  style={{ width: "100%", marginTop: 4 }}
                />
              </div>
            ))}

            <button type="submit" style={{ marginTop: 12 }}>
              Save Allotted
            </button>
          </form>
        </section>

        {/* SPENT & REMAINING SECTION — NEW */}
        <section style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16 }}>
          <h2>Spent & Remaining</h2>

          <div style={{ marginBottom: 20 }}>
            <h3>Total Spent: ₹ {totalSpent.toLocaleString("en-IN")}</h3>
          </div>

          <hr style={{ margin: "12px 0" }} />

          {CATEGORIES.map((c) => {
            const spent = spentByCat[c.key] || 0;
            const allotted = numberOrZero(allottedByCat[c.key]);
            const remaining = allotted - spent;

            return (
              <div key={c.key} style={{ marginBottom: 14 }}>
                <b>{c.label}</b>
                <div style={{ marginTop: 4 }}>
                  <div>Spent: ₹ {spent.toLocaleString("en-IN")}</div>
                  <div style={{ color: remaining < 0 ? "red" : "green" }}>
                    Remaining: ₹ {remaining.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
}
