export const SECTION_SIZE = 20;
export const PARTS = [
  { name: "Chapter 1", title: "A little curiosity", start: 0, count: 100 },
  { name: "Chapter 2", title: "Behind the page", start: 100, count: 100 },
];
export const ENTRY_COUNT = PARTS.reduce((total, part) => total + part.count, 0);
