export default function ExpenseTable({ expenses = [] }) {
  const safeExpenses = Array.isArray(expenses) ? expenses : [];

  if (safeExpenses.length === 0) {
    return <p>No expenses recorded yet.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Category</th>
          <th>Amount</th>
          <th>Date</th>
          <th>Vendor</th>
          <th>Activity</th>
          <th>Receipt</th>
        </tr>
      </thead>

      <tbody>
        {safeExpenses.map((e) => (
          <tr key={e.id}>
            <td>{e.category || '—'}</td>
            <td>₹{Number(e.amount) || 0}</td>
            <td>{e.date || '—'}</td>
            <td>{e.vendor || '—'}</td>
            <td>{e.activity || '—'}</td>
            <td>
              {e.receipt_url ? (
                <a href={e.receipt_url} target="_blank">View</a>
              ) : (
                '—'
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}