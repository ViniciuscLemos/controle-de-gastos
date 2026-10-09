import { useState } from 'react';
import { CATEGORIES, parseAmount, today } from '../lib/finance';

export default function EntryForm({ editing, onSave, onCancel }) {
  const [type, setType] = useState(editing?.type || 'expense');
  const [description, setDescription] = useState(editing?.description || '');
  const [amount, setAmount] = useState(editing ? (editing.amount / 100).toFixed(2) : '');
  const [category, setCategory] = useState(editing?.category || CATEGORIES.expense[0]);
  const [date, setDate] = useState(editing?.date || today());
  const [error, setError] = useState('');

  function changeType(next) {
    setType(next);
    setCategory(CATEGORIES[next][0]);
  }

  function submit(e) {
    e.preventDefault();
    const cents = parseAmount(amount);
    if (!description.trim()) return setError('Add a description.');
    if (!cents) return setError('Invalid amount. Example: 25.90');
    if (!date) return setError('Pick the date.');

    onSave({ type, description: description.trim(), amount: cents, category, date });
    setError('');
    if (!editing) {
      setDescription('');
      setAmount('');
    }
  }

  return (
    <form className="card entry-form" onSubmit={submit}>
      <h2>{editing ? 'Edit entry' : 'New entry'}</h2>

      <div className="types">
        <button type="button" className={type === 'expense' ? 'active expense' : ''} onClick={() => changeType('expense')}>
          Expense
        </button>
        <button type="button" className={type === 'income' ? 'active income' : ''} onClick={() => changeType('income')}>
          Income
        </button>
      </div>

      <label>
        Description
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. groceries" maxLength={60} />
      </label>

      <div className="row">
        <label>
          Amount ($)
          <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" inputMode="decimal" />
        </label>
        <label>
          Date
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
      </div>

      <label>
        Category
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES[type].map((c) => <option key={c}>{c}</option>)}
        </select>
      </label>

      {error && <p className="error">{error}</p>}

      <div className="actions">
        <button type="submit">{editing ? 'Save' : 'Add'}</button>
        {editing && <button type="button" className="secondary" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
