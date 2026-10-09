import { shiftMonth } from './finance';

// fake entries so whoever opens the app can see it working
const DATA = [
  [1, 'income', 'Salary', 'Salary', 320000],
  [2, 'expense', 'Rent', 'Housing', 110000],
  [3, 'expense', 'Groceries', 'Food', 38740],
  [5, 'expense', 'Electricity bill', 'Housing', 14320],
  [6, 'expense', 'Bus pass', 'Transport', 8800],
  [8, 'expense', 'Movies', 'Fun', 6400],
  [10, 'income', 'Website for a client', 'Freelance', 80000],
  [11, 'expense', 'Pharmacy', 'Health', 5290],
  [12, 'expense', 'Food delivery', 'Food', 6150],
  [14, 'expense', 'React course', 'Education', 2790],
  [15, 'expense', 'Uber', 'Transport', 2340],
  [18, 'expense', 'Sneakers', 'Shopping', 29990],
  [20, 'expense', 'Groceries', 'Food', 21460],
  [22, 'expense', 'Concert', 'Fun', 15000],
];

// the two months before get the same entries with other amounts, and a few of them missing,
// so the "last months" chart has something to compare
const PAST_MONTHS = [
  { factor: 0.9, skip: [5, 9, 13] },
  { factor: 1.15, skip: [7, 11] },
];

function build(month, data, factor, idPrefix, adjust = (day) => day) {
  return data.map(([day, type, description, category, amount], i) => ({
    id: `${idPrefix}-${i}`,
    type,
    description,
    category,
    // income stays the same, only the expenses change from one month to the other
    amount: type === 'income' ? amount : Math.round((amount * factor) / 10) * 10,
    date: `${month}-${String(adjust(day)).padStart(2, '0')}`,
    createdAt: i,
  }));
}

// In the current month the days are squeezed up to today, otherwise there'd be expenses dated in the future
export function sample(month, today) {
  const currentDay = Number(today.slice(8, 10));
  const adjust = (day) =>
    month === today.slice(0, 7) && currentDay < 22 ? Math.max(1, Math.round((day * currentDay) / 22)) : day;

  const past = PAST_MONTHS.flatMap(({ factor, skip }, i) => {
    const pastMonth = shiftMonth(month, i - PAST_MONTHS.length);
    const data = DATA.filter((_, index) => !skip.includes(index));
    return build(pastMonth, data, factor, `sample-${pastMonth}`);
  });

  return [...past, ...build(month, DATA, 1, 'sample', adjust)];
}
