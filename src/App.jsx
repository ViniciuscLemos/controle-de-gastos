import { useEffect, useState } from 'react';
import { inMonth, monthName, monthOf, shiftMonth, summary, toCsv, today } from './lib/finance';
import { sample } from './lib/sample';
import EntryForm from './components/EntryForm';
import Summary from './components/Summary';
import Chart from './components/Chart';
import EntryList from './components/EntryList';

function load() {
  try {
    return JSON.parse(localStorage.getItem('entries')) || [];
  } catch {
    return [];
  }
}

export default function App() {
  const [entries, setEntries] = useState(load);
  const [month, setMonth] = useState(monthOf(today()));
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('entries', JSON.stringify(entries));
    } catch {
      // no localStorage (private tab), it just doesn't save
    }
  }, [entries]);

  const currentMonth = inMonth(entries, month);

  function save(entry) {
    if (editing) {
      setEntries((list) => list.map((e) => (e.id === editing.id ? { ...e, ...entry } : e)));
      setEditing(null);
    } else {
      setEntries((list) => [...list, { ...entry, id: crypto.randomUUID(), createdAt: Date.now() }]);
    }
    // if it went into another month, jump there so the person sees it was added
    setMonth(monthOf(entry.date));
  }

  function edit(entry) {
    setEditing(entry);
    // on the phone the form sits at the top, far from the list
    document.querySelector('.entry-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function remove(entry) {
    if (!confirm(`Delete "${entry.description}"?`)) return;
    setEntries((list) => list.filter((e) => e.id !== entry.id));
    if (editing?.id === entry.id) setEditing(null);
  }

  function exportCsv() {
    // the BOM at the start makes Excel read accents right
    const blob = new Blob(['﻿' + toCsv(currentMonth)], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `expenses-${month}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  return (
    <div className="app">
      <header>
        <h1>Expense Tracker</h1>
        <div className="month-nav">
          <button onClick={() => setMonth(shiftMonth(month, -1))} aria-label="Previous month">‹</button>
          <strong>{monthName(month)}</strong>
          <button onClick={() => setMonth(shiftMonth(month, 1))} aria-label="Next month">›</button>
        </div>
      </header>

      <Summary {...summary(currentMonth)} />

      <div className="columns">
        <div>
          <EntryForm
            key={editing?.id || 'new'}
            editing={editing}
            onSave={save}
            onCancel={() => setEditing(null)}
          />
          <Chart entries={currentMonth} />
        </div>

        <section className="card">
          <div className="list-header">
            <h2>Entries</h2>
            {currentMonth.length > 0 && <button className="secondary" onClick={exportCsv}>Export CSV</button>}
          </div>

          {currentMonth.length > 0 ? (
            <EntryList entries={currentMonth} onEdit={edit} onDelete={remove} />
          ) : (
            <div className="empty">
              <p>Nothing added in {monthName(month)}.</p>
              {entries.length === 0 && (
                <button className="secondary" onClick={() => setEntries(sample(month, today()))}>
                  Load sample data
                </button>
              )}
            </div>
          )}
        </section>
      </div>

      <footer>
        Your data is only saved in your browser · made by{' '}
        <a href="https://github.com/ViniciuscLemos" target="_blank" rel="noreferrer">Vinicius Lemos</a>
      </footer>
    </div>
  );
}
