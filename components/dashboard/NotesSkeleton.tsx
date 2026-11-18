import { Skeleton } from "../ui/skeleton";

const heights = [
  ["w-3/4", 5],
  ["w-1/2", 3],
  ["w-2/3", 7],
  ["w-4/5", 4],
  ["w-1/2", 6],
  ["w-3/5", 2],
  ["w-2/3", 5],
  ["w-3/4", 3],
] as const;

/** Placeholder cards shown while notes are being fetched. */
const NotesSkeleton = () => {
  return (
    <div
      role="status"
      aria-label="Loading notes"
      className="columns-1 gap-4 min-[500px]:columns-2 min-[700px]:columns-3 min-[1100px]:columns-4"
    >
      {heights.map(([titleWidth, lines], i) => (
        <div
          key={i}
          className="mb-4 break-inside-avoid rounded-xl border bg-card p-5 shadow-paper"
        >
          <Skeleton className={`h-5 ${titleWidth}`} />
          <div className="mt-4 space-y-2">
            {Array.from({ length: lines }).map((_, j) => (
              <Skeleton
                key={j}
                className={`h-3 ${j === lines - 1 ? "w-2/3" : "w-full"}`}
              />
            ))}
          </div>
          <Skeleton className="mt-5 h-3 w-24" />
        </div>
      ))}
      <span className="sr-only">Loading notes…</span>
    </div>
  );
};

export default NotesSkeleton;
