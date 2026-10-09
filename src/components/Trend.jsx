import { formatMoney, monthlyTotals } from '../lib/finance';

const SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// income and expenses side by side for the last 6 months. Clicking a month opens it
export default function Trend({ entries, month, onPick }) {
  const months = monthlyTotals(entries, month, 6);
  const highest = Math.max(...months.flatMap((m) => [m.income, m.expenses]));
  if (highest === 0) return null;

  const height = (cents) => `${Math.max((cents / highest) * 100, cents ? 2 : 0)}%`;

  return (
    <section className="card">
      <div className="trend-header">
        <h2>Last 6 months</h2>
        <span className="legend">
          <i className="dot income" /> Income <i className="dot expense" /> Expenses
        </span>
      </div>
      <div className="trend">
        {months.map((m) => {
          const label = SHORT[Number(m.month.slice(5, 7)) - 1];
          return (
            <button
              key={m.month}
              className={`trend-month ${m.month === month ? 'current' : ''}`}
              onClick={() => onPick(m.month)}
              title={`${label}: income ${formatMoney(m.income)}, expenses ${formatMoney(m.expenses)}`}
              aria-label={`${label}: income ${formatMoney(m.income)}, expenses ${formatMoney(m.expenses)}`}
            >
              <span className="trend-bars">
                <span className="trend-bar income" style={{ height: height(m.income) }} />
                <span className="trend-bar expense" style={{ height: height(m.expenses) }} />
              </span>
              <span className="trend-label">{label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
