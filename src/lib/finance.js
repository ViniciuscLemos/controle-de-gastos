// Amounts are kept in cents (integers) so there are no rounding problems:
// in JS 0.1 + 0.2 is 0.30000000000000004.

export const CATEGORIES = {
  expense: ['Food', 'Housing', 'Transport', 'Fun', 'Health', 'Education', 'Shopping', 'Other'],
  income: ['Salary', 'Freelance', 'Allowance', 'Other'],
};

// "12.50" / "12,50" / "1,234.56" / "1,500" -> 1250 / 1250 / 123456 / 150000 (or null if it can't)
export function parseAmount(text) {
  let clean = String(text).trim().replace(/[$\s]/g, '');
  if (clean.includes('.')) clean = clean.replace(/,/g, '');
  // a comma followed by 3 digits and no dot is a thousands separator: "1,500" is one thousand five hundred
  else if (/^\d{1,3}(,\d{3})+$/.test(clean)) clean = clean.replace(/,/g, '');
  // otherwise the comma is a decimal one ("12,50"), for people used to that
  else clean = clean.replace(',', '.');
  if (!/^\d+(\.\d{1,2})?$/.test(clean)) return null;
  const cents = Math.round(Number(clean) * 100);
  return cents > 0 ? cents : null;
}

export function formatMoney(cents) {
  return (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

// "2026-10" from "2026-10-06"
export const monthOf = (date) => date.slice(0, 7);

export function inMonth(entries, month) {
  return entries
    .filter((e) => monthOf(e.date) === month)
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);
}

export function summary(entries) {
  let income = 0;
  let expenses = 0;
  for (const e of entries) {
    if (e.type === 'income') income += e.amount;
    else expenses += e.amount;
  }
  return { income, expenses, balance: income - expenses };
}

// expenses added up by category, biggest first
export function expensesByCategory(entries) {
  const total = {};
  for (const e of entries) {
    if (e.type !== 'expense') continue;
    total[e.category] = (total[e.category] || 0) + e.amount;
  }
  return Object.entries(total)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}

export function shiftMonth(month, by) {
  const [year, m] = month.split('-').map(Number);
  const d = new Date(year, m - 1 + by, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function monthName(month) {
  const [year, m] = month.split('-').map(Number);
  return new Date(year, m - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function toCsv(entries) {
  const quote = (s) => `"${String(s).replace(/"/g, '""')}"`;
  const rows = entries.map((e) => [
    e.date,
    quote(e.description),
    e.category,
    e.type === 'income' ? 'Income' : 'Expense',
    ((e.type === 'income' ? 1 : -1) * e.amount / 100).toFixed(2),
  ].join(','));
  return ['Date,Description,Category,Type,Amount', ...rows].join('\n');
}
