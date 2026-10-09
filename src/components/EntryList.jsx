import { categoryColor, dayLabel, formatMoney, groupByDate } from '../lib/finance';
import Icon from './Icon';

export default function EntryList({ entries, onEdit, onDelete }) {
  return (
    <div className="entry-list">
      {groupByDate(entries).map((group) => (
        <section key={group.date} className="day-group">
          <h3>
            <span>{dayLabel(group.date)}</span>
            <span className={group.net < 0 ? 'red' : 'green'}>
              {group.net < 0 ? '-' : '+'} {formatMoney(Math.abs(group.net))}
            </span>
          </h3>
          <ul>
            {group.entries.map((e) => (
              <li key={e.id}>
                <span className="avatar" style={{ background: categoryColor(e.category) }} aria-hidden="true">
                  <Icon name={e.category} />
                </span>
                <div className="info">
                  <strong>{e.description}</strong>
                  <span className="muted">{e.category}</span>
                </div>
                <span className={`amount ${e.type === 'income' ? 'green' : 'red'}`}>
                  {e.type === 'income' ? '+' : '-'} {formatMoney(e.amount)}
                </span>
                <div className="buttons">
                  <button className="icon-button" onClick={() => onEdit(e)} aria-label={`Edit ${e.description}`} title="Edit">
                    <Icon name="edit" size={16} />
                  </button>
                  <button
                    className="icon-button danger"
                    onClick={() => onDelete(e)}
                    aria-label={`Delete ${e.description}`}
                    title="Delete"
                  >
                    <Icon name="delete" size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
