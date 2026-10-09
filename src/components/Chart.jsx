import { expensesByCategory, formatMoney } from '../lib/finance';

export default function Chart({ entries }) {
  const categories = expensesByCategory(entries);
  if (categories.length === 0) return null;

  const total = categories.reduce((sum, c) => sum + c.amount, 0);
  const biggest = categories[0].amount;

  return (
    <section className="card">
      <h2>Where the money went</h2>
      <ul className="chart">
        {categories.map((c) => (
          <li key={c.category}>
            <div className="chart-text">
              <span>{c.category}</span>
              <span className="muted">
                {formatMoney(c.amount)} · {Math.round((c.amount / total) * 100)}%
              </span>
            </div>
            {/* the bar is relative to the biggest category, not the total, so it's easier to compare */}
            <div className="bar">
              <div style={{ width: `${(c.amount / biggest) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
