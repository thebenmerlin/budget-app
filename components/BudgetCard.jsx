export default function BudgetCard({ proposed = 0, allotted = 0, spent = 0 }) {
  const remaining = allotted - spent;
  const variance = allotted - proposed;

  return (
    <div style={{
      border: '1px solid #ddd',
      padding: '20px',
      borderRadius: '6px',
      background: '#ffffff'
    }}>
      <h2 style={{ marginBottom: '15px', color: 'var(--yale)' }}>Budget Summary</h2>

      <p><strong>Proposed:</strong> ₹{proposed}</p>
      <p><strong>Allotted:</strong> ₹{allotted}</p>
      <p><strong>Spent:</strong> ₹{spent}</p>

      <hr style={{ margin: '14px 0', borderColor: '#ddd' }} />

      <p><strong>Remaining:</strong> ₹{remaining}</p>
      <p><strong>Variance (Allotted - Proposed):</strong> ₹{variance}</p>
    </div>
  );
}