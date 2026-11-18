"use client";
import Link from "next/link";
import { DateTime } from "luxon";
import { Trash2Icon } from "lucide-react";
import { NoteData } from "@/utils/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const formatedDate = (date: string) => {
  const dt = DateTime.utc();
  const ISODate = DateTime.fromISO(date);
  const difference = dt.diff(ISODate, "day").as("day");

  if (difference < 7) return ISODate.toRelative();

  return ISODate.toFormat("dd LLL yyyy");
};

const NoteCard = ({
  note,
  index,
  onRemove,
}: {
  note: NoteData;
  index: number;
  onRemove: (id: string) => void;
}) => {
  const title = note.title?.trim();
  const preview = note.plainText?.trim();
  const updated = note.updatedAt.toLocaleString();

  return (
    <article
      className="group relative mb-4 rounded-xl border bg-card shadow-paper transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lifted focus-within:border-primary/40 animate-in fade-in-0 slide-in-from-bottom-2 duration-500 fill-mode-backwards"
      style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
    >
      <Link
        href={"/note/" + note.id}
        className="block rounded-xl p-5 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <h3
          className={`pe-7 font-serif text-lg leading-snug font-semibold tracking-tight text-pretty break-words ${
            title ? "" : "text-muted-foreground italic"
          }`}
        >
          {title || "Untitled"}
        </h3>

        {preview ? (
          <p className="mt-2 line-clamp-8 text-sm leading-relaxed whitespace-pre-line break-words text-muted-foreground">
            {preview}
          </p>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground/70 italic">
            Nothing written yet
          </p>
        )}

        <footer className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="size-1 rounded-full bg-primary/60" aria-hidden="true" />
          <time dateTime={updated}>Edited {formatedDate(updated)}</time>
        </footer>
      </Link>

      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(note.id);
            }}
            aria-label={`Delete note ${title ? `"${title}"` : "Untitled"}`}
            className="absolute top-3 right-3 grid size-8 place-items-center rounded-md text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
          >
            <Trash2Icon className="size-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent>Delete note</TooltipContent>
      </Tooltip>
    </article>
  );
};

export default NoteCard;
