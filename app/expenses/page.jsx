async function getFilteredExpenses(filters) {
  const params = new URLSearchParams(filters);

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/expenses?${params.toString()}`,
      { cache: "no-store" }
    );
    return await res.json();
  } catch {
    return [];
  }
}

export default async function ExpensesPage(props) {
  const searchParams = await props.searchParams;

  const filters = {
    category: searchParams?.category || "",
    vendor: searchParams?.vendor || "",
    activity: searchParams?.activity || "",
    from: searchParams?.from || "",
    to: searchParams?.to || "",
  };


  const expenses = await getFilteredExpenses(filters);

  async function deleteExpense(formData) {
    "use server";
    const id = formData.get("id");

    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/expenses?id=${id}`, {
      method: "DELETE",
    });
  }

  return (
    <div>
      <h1>Expenses</h1>

      {/* FILTER FORM */}
      <form method="GET" style={{ marginBottom: "20px" }}>
        <select name="category" defaultValue={filters.category}>
          <option value="">All Categories</option>
          <option value="Infrastructure">Infrastructure</option>
          <option value="Hardware">Hardware</option>
          <option value="Software">Software</option>
          <option value="Workshops">Workshops/FDP/Seminars</option>
          <option value="Expert Talk">Expert Talk</option>
          <option value="Events">Events/Fests</option>
          <option value="Stationary">Stationary/Printing</option>
          <option value="Student Activities">Student Activities</option>
          <option value="Misc">Miscellaneous</option>
        </select>

        <input type="text" name="vendor" placeholder="Vendor" defaultValue={filters.vendor} />
        <input type="text" name="activity" placeholder="Activity" defaultValue={filters.activity} />

        <input type="date" name="from" defaultValue={filters.from} />
        <input type="date" name="to" defaultValue={filters.to} />

        <button type="submit">Apply Filters</button>
        <a href="/expenses" style={{ marginLeft: "10px", color: "var(--crimson)" }}>
          Reset
        </a>
      </form>
      
      {/* --- Export Buttons --- */}
<div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
  <a
    href={`/api/export/pdf?category=${filters.category}&vendor=${filters.vendor}&activity=${filters.activity}&from=${filters.from}&to=${filters.to}`}
    target="_blank"
    style={{
      padding: '8px 14px',
      backgroundColor: '#8C1515',   // Harvard Crimson
      color: 'white',
      borderRadius: '6px',
      textDecoration: 'none',
      fontWeight: '600'
    }}
  >
    Export PDF
  </a>

  <a
    href={`/api/export/excel?category=${filters.category}&vendor=${filters.vendor}&activity=${filters.activity}&from=${filters.from}&to=${filters.to}`}
    target="_blank"
    style={{
      padding: '8px 14px',
      backgroundColor: '#00356B',  // Yale Blue
      color: 'white',
      borderRadius: '6px',
      textDecoration: 'none',
      fontWeight: '600'
    }}
  >
    Export Excel
  </a>
</div>


      {/* TABLE */}
      {expenses.length === 0 && <p>No expenses found.</p>}

      {expenses.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Vendor</th>
              <th>Activity</th>
              <th>Receipt</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {expenses.map((e) => (
              <tr key={e.id}>
                <td>{e.category}</td>
                <td>₹{e.amount}</td>
                <td>{e.date}</td>
                <td>{e.vendor}</td>
                <td>{e.activity}</td>
                <td>
                  {e.receipt_url ? <a href={e.receipt_url} target="_blank">View</a> : "—"}
                </td>
                <td>
                  <a href={`/expenses/edit/${e.id}`}>Edit</a>

                  <form action={deleteExpense} style={{ display: "inline-block", marginLeft: "10px" }}>
                    <input type="hidden" name="id" value={e.id} />
                    <button type="submit" style={{ background: "var(--crimson)", padding: "4px 8px", borderRadius: "4px" }}>
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
