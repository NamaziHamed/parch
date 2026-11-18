import Link from "next/link";
import { PlusIcon, SearchXIcon } from "lucide-react";
import { Button } from "../ui/button";

export const EmptyNotebook = () => (
  <div className="mx-auto flex max-w-md flex-col items-center py-20 text-center animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
    <div aria-hidden="true" className="relative mb-8 h-28 w-24">
      <div className="absolute inset-0 rotate-6 rounded-lg border bg-card shadow-paper" />
      <div className="paper-lines absolute inset-0 -rotate-3 rounded-lg border bg-card shadow-lifted">
        <div className="absolute inset-y-0 left-4 w-px bg-primary/30" />
      </div>
    </div>
    <h2 className="font-serif text-2xl font-semibold tracking-tight">
      A fresh notebook
    </h2>
    <p className="mt-2 text-muted-foreground">
      Nothing here yet. Your first note is one click away, and it saves itself.
    </p>
    <Button asChild className="mt-6">
      <Link href="/note/new">
        <PlusIcon />
        Write your first note
      </Link>
    </Button>
  </div>
);

export const NoResults = ({
  query,
  onClear,
}: {
  query: string;
  onClear: () => void;
}) => (
  <div className="mx-auto flex max-w-md flex-col items-center py-20 text-center animate-in fade-in-0 duration-300">
    <span className="grid size-12 place-items-center rounded-full bg-accent text-primary">
      <SearchXIcon className="size-5" />
    </span>
    <h2 className="mt-5 font-serif text-xl font-semibold tracking-tight">
      No notes match &ldquo;{query}&rdquo;
    </h2>
    <p className="mt-2 text-sm text-muted-foreground">
      Try a different word, or search by part of a title.
    </p>
    <Button variant="outline" className="mt-5" onClick={onClear}>
      Clear search
    </Button>
  </div>
);
