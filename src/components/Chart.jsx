import { categoryColor, expensesByCategory, formatMoney } from '../lib/finance';

const RADIUS = 52;
const CIRCLE = 2 * Math.PI * RADIUS;

// donut drawn with one circle per category: each one is a dash of the stroke,
// moved forward by the sum of the ones before it
function Donut({ categories, total }) {
  let before = 0;
  return (
    <svg className="donut" viewBox="0 0 140 140" role="img" aria-label="Expenses by category">
      <circle cx="70" cy="70" r={RADIUS} fill="none" stroke="var(--soft)" strokeWidth="18" />
      {categories.map((c) => {
        const size = (c.amount / total) * CIRCLE;
        const dash = (
          <circle
            key={c.category}
            cx="70"
            cy="70"
            r={RADIUS}
            fill="none"
            stroke={categoryColor(c.category)}
            strokeWidth="18"
            strokeDasharray={`${Math.max(size - 1.5, 0.5)} ${CIRCLE}`}
            strokeDashoffset={-before}
            transform="rotate(-90 70 70)"
          >
            <title>{`${c.category}: ${formatMoney(c.amount)}`}</title>
          </circle>
        );
        before += size;
        return dash;
      })}
      <text x="70" y="66" textAnchor="middle" className="donut-label">Spent</text>
      <text x="70" y="84" textAnchor="middle" className="donut-total">{formatMoney(total)}</text>
    </svg>
  );
}

export default function Chart({ entries }) {
  const categories = expensesByCategory(entries);
  if (categories.length === 0) return null;

  const total = categories.reduce((sum, c) => sum + c.amount, 0);
  const biggest = categories[0].amount;

  return (
    <section className="card">
      <h2>Where the money went</h2>
      <Donut categories={categories} total={total} />
      <ul className="chart">
        {categories.map((c) => (
          <li key={c.category}>
            <div className="chart-text">
              <span>
                <i className="dot" style={{ background: categoryColor(c.category) }} />
                {c.category}
              </span>
              <span className="muted">
                {formatMoney(c.amount)} · {Math.round((c.amount / total) * 100)}%
              </span>
            </div>
            {/* the bar is relative to the biggest category, not the total, so it's easier to compare */}
            <div className="bar">
              <div style={{ width: `${(c.amount / biggest) * 100}%`, background: categoryColor(c.category) }} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
