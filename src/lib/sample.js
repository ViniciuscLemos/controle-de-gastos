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

// In the current month the days are squeezed up to today, otherwise there'd be expenses dated in the future
export function sample(month, today) {
  const currentDay = Number(today.slice(8, 10));
  const adjust = (day) =>
    month === today.slice(0, 7) && currentDay < 22 ? Math.max(1, Math.round((day * currentDay) / 22)) : day;

  return DATA.map(([day, type, description, category, amount], i) => ({
    id: `sample-${i}`,
    type,
    description,
    category,
    amount,
    date: `${month}-${String(adjust(day)).padStart(2, '0')}`,
    createdAt: i,
  }));
}
