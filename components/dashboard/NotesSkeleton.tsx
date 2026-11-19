const columns = [
  ["h-40", "h-28", "h-36"],
  ["h-28", "h-48"],
  ["h-52", "h-24"],
  ["h-32", "h-36", "h-24"],
];

/** Placeholder masonry shown while notes or the grid code are loading. */
const NotesSkeleton = () => (
  <div aria-hidden className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
    {columns.map((col, c) => (
      <div
        key={c}
        className={`flex flex-col gap-3 sm:gap-4 ${c === 2 ? "hidden lg:flex" : ""} ${c === 3 ? "hidden xl:flex" : ""}`}
      >
        {col.map((h, i) => (
          <div key={i} className={`${h} animate-pulse rounded-xl border bg-card`} />
        ))}
      </div>
    ))}
  </div>
);

export default NotesSkeleton;
