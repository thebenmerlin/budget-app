async function addExpense(formData) {
  'use server';

  const category = formData.get('category');
  const amount = formData.get('amount');
  const date = formData.get('date');
  const vendor = formData.get('vendor');
  const activity = formData.get('activity');
  const receipt = formData.get('receipt');

  let receiptUrl = "";

  if (receipt && receipt.size > 0) {
    const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/upload`, {
      method: 'POST',
      body: receipt
    });
    const uploaded = await uploadRes.json();
    receiptUrl = uploaded.url || "";
  }

  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/expenses`, {
    method: 'POST',
    body: JSON.stringify({
      category,
      amount,
      date,
      vendor,
      activity,
      receipt_url: receiptUrl
    }),
    headers: { 'Content-Type': 'application/json' }
  });
}

export default function AddExpensePage() {
  return (
    <div>
      <h1>Add Expense</h1>

      <form action={addExpense}>
        <select name="category" required>
          <option value="">Select Category</option>
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

        <input type="number" name="amount" placeholder="Amount (₹)" required />

        <input type="date" name="date" required />

        <input type="text" name="vendor" placeholder="Vendor Name" required />

        <input type="text" name="activity" placeholder="Activity / Event" required />

        <input type="file" name="receipt" accept=".pdf,.jpg,.jpeg,.png" />

        <button type="submit">Save Expense</button>
      </form>
    </div>
  );
}
