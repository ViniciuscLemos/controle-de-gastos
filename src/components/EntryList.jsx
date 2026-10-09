import { formatMoney } from '../lib/finance';

export default function EntryList({ entries, onEdit, onDelete }) {
  return (
    <ul className="entry-list">
      {entries.map((e) => (
        <li key={e.id}>
          <span className="date">{e.date.slice(5, 7)}/{e.date.slice(8, 10)}</span>
          <div className="info">
            <strong>{e.description}</strong>
            <span className="muted">{e.category}</span>
          </div>
          <span className={e.type === 'income' ? 'green' : 'red'}>
            {e.type === 'income' ? '+' : '-'} {formatMoney(e.amount)}
          </span>
          <div className="buttons">
            <button className="link" onClick={() => onEdit(e)}>edit</button>
            <button className="link danger" onClick={() => onDelete(e)}>delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
}
