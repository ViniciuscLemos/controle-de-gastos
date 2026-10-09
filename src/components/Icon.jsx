// small line icons, drawn on a 24x24 grid. One per category, plus edit and delete
const PATHS = {
  Food: 'M6 3v6a2 2 0 0 0 4 0V3M8 3v18M17 3c-2 1-3 3-3 6v4h3m0-10v18',
  Housing: 'M3 11l9-7 9 7M5 9.5V20h14V9.5M10 20v-6h4v6',
  Transport: 'M6 4h12a2 2 0 0 1 2 2v11H4V6a2 2 0 0 1 2-2zM4 11h16M7 17v3M17 17v3M8 14h.01M16 14h.01',
  Fun: 'M12 3l2.6 5.5 6 .8-4.4 4.1 1.1 6L12 16.5l-5.3 2.9 1.1-6L3.4 9.3l6-.8z',
  Health: 'M12 20s-7-4.3-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.7-7 10-7 10z',
  Education: 'M3 8l9-4 9 4-9 4zM7 10v5c0 1.5 2.2 3 5 3s5-1.5 5-3v-5M21 8v6',
  Shopping: 'M6 8h12l-1 13H7zM9 8V6a3 3 0 0 1 6 0v2',
  Salary: 'M4 7h15a1 1 0 0 1 1 1v11H5a1 1 0 0 1-1-1zM4 7l11-3v3M16 13h1',
  Freelance: 'M5 5h14v10H5zM3 19h18',
  Allowance: 'M4 10h16v4H4zM6 14v7h12v-7M12 10v11M12 10c-1.5-4-6-4.5-6-1.5S12 10 12 10s6 1 6-1.5-4.5-2.5-6 1.5',
  Other: 'M6 12h.01M12 12h.01M18 12h.01',
  edit: 'M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4',
  delete: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
};

export default function Icon({ name, size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={name === 'Other' ? 3.5 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={PATHS[name] || PATHS.Other} />
    </svg>
  );
}
