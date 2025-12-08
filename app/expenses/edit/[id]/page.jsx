async function getExpense(id) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/expenses`, {
      cache: "no-store"
    });
    const items = await res.json();
    return items.find((e) => String(e.id) === String(id)) || null;
  } catch {
    return null;
  }
}

export default async function EditExpensePage(props) {
  // FIX: unwrap params Promise
  const params = await props.params;
  const id = params.id;

  const expense = await getExpense(id);

  async function updateExpense(formData) {
    "use server";

    const payload = {
      id,
      category: formData.get("category"),
      amount: formData.get("amount"),
      date: formData.get("date"),
      vendor: formData.get("vendor"),
      activity: formData.get("activity"),
      receipt_url: formData.get("existing_receipt"),
    };

    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/expenses`, {
      method: "PUT",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!expense) return <p>Expense not found.</p>;

  return (
    <div>
      <h1>Edit Expense</h1>

      <form action={updateExpense}>
        <select name="category" defaultValue={expense.category} required>
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

        <input type="number" name="amount" defaultValue={expense.amount} required />
        <input type="date" name="date" defaultValue={expense.date} required />
        <input type="text" name="vendor" defaultValue={expense.vendor} required />
        <input type="text" name="activity" defaultValue={expense.activity} required />

        <input type="hidden" name="existing_receipt" value={expense.receipt_url || ""} />

        <button type="submit">Update Expense</button>
      </form>
    </div>
  );
}
