const heights = ["h-40", "h-28", "h-52", "h-32", "h-24", "h-44", "h-36", "h-28"];

/** Placeholder grid shown while notes or the grid code are loading. */
const NotesSkeleton = () => (
  <div
    aria-hidden
    className="ps-20 pt-10 pe-3 grid gap-4 grid-cols-1 min-[500px]:grid-cols-2 min-[700px]:grid-cols-3 min-[1100px]:grid-cols-4"
  >
    {heights.map((h, i) => (
      <div key={i} className={`${h} animate-pulse rounded-xl border bg-card`} />
    ))}
  </div>
);

export default NotesSkeleton;
