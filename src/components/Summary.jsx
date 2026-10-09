import { formatMoney } from '../lib/finance';

export default function Summary({ income, expenses, balance }) {
  return (
    <div className="summary">
      <div className="card">
        <span>Income</span>
        <strong className="green">{formatMoney(income)}</strong>
      </div>
      <div className="card">
        <span>Expenses</span>
        <strong className="red">{formatMoney(expenses)}</strong>
      </div>
      <div className="card">
        <span>Month balance</span>
        <strong className={balance < 0 ? 'red' : ''}>{formatMoney(balance)}</strong>
      </div>
    </div>
  );
}
