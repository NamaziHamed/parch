import {
  AlignLeftIcon,
  BoldIcon,
  CheckIcon,
  HeadingIcon,
  HighlighterIcon,
  ItalicIcon,
  ListIcon,
} from "lucide-react";

/**
 * A static, decorative mock of the Parch editor used on the landing page.
 * Pure markup: no editor instance is mounted here.
 */
export function EditorPreview() {
  const tools = [BoldIcon, ItalicIcon, HeadingIcon, ListIcon, AlignLeftIcon, HighlighterIcon];

  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-3xl select-none">
      {/* stacked paper behind */}
      <div className="absolute inset-x-6 -bottom-3 h-full rotate-[1.2deg] rounded-xl border bg-card/70 shadow-paper" />
      <div className="absolute inset-x-3 -bottom-1.5 h-full -rotate-[0.8deg] rounded-xl border bg-card/80 shadow-paper" />

      <div className="relative overflow-hidden rounded-xl border bg-card text-left shadow-lifted">
        <div className="flex items-center justify-between border-b px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-border" />
            <span className="size-2.5 rounded-full bg-border" />
            <span className="size-2.5 rounded-full bg-border" />
          </div>
          <div className="hidden items-center gap-0.5 rounded-lg border bg-background/60 p-0.5 sm:flex">
            {tools.map((Icon, i) => (
              <span
                key={i}
                className={`grid size-7 place-items-center rounded-md text-muted-foreground ${
                  i === 0 ? "bg-accent text-primary" : ""
                }`}
              >
                <Icon className="size-3.5" />
              </span>
            ))}
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <CheckIcon className="size-3.5 text-primary" />
            Saved
          </span>
        </div>

        <div className="px-6 py-7 font-serif sm:px-10 sm:py-9">
          <p className="text-xs font-sans uppercase tracking-[0.18em] text-muted-foreground">
            Morning pages
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Ideas for the weekend workshop
          </h3>
          <p className="mt-4 text-[1.05rem] leading-relaxed text-foreground/85">
            Start with a <strong>ten-minute free-write</strong>, then trade
            pages. The goal isn&apos;t polish, it&apos;s{" "}
            <span className="rounded-[3px] bg-highlight px-1">momentum</span>.
          </p>
          <ul className="mt-4 space-y-2 text-[1.05rem] text-foreground/85">
            {[
              ["Print prompt cards", true],
              ["Book the reading room", true],
              ["Bring the good coffee", false],
            ].map(([label, done]) => (
              <li key={label as string} className="flex items-center gap-3">
                <span
                  className={`grid size-4 place-items-center rounded-[4px] border ${
                    done ? "border-primary bg-primary text-primary-foreground" : "border-input"
                  }`}
                >
                  {done && <CheckIcon className="size-3" strokeWidth={3} />}
                </span>
                <span className={done ? "text-muted-foreground line-through" : ""}>
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
