"use client";
import React, { useEffect, useRef } from "react";
import { SearchIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";

const SearchBox = ({
  text,
  search,
}: {
  text: string;
  search: (value: string) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Press "/" anywhere on the page to jump to search.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTyping =
        target?.isContentEditable ||
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA";
      if (e.key === "/" && !isTyping) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div role="search" className="relative w-full sm:max-w-sm">
      <SearchIcon
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        ref={inputRef}
        type="search"
        value={text}
        onChange={(e) => search(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            search("");
            e.currentTarget.blur();
          }
        }}
        placeholder="Search notes"
        aria-label="Search notes by title or text"
        className="h-10 bg-card ps-9 pe-10 [&::-webkit-search-cancel-button]:hidden"
      />
      {text ? (
        <button
          type="button"
          onClick={() => {
            search("");
            inputRef.current?.focus();
          }}
          aria-label="Clear search"
          className="absolute top-1/2 right-2 grid size-6 -translate-y-1/2 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <XIcon className="size-3.5" />
        </button>
      ) : (
        <kbd
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-2.5 hidden -translate-y-1/2 rounded border bg-muted px-1.5 font-mono text-[0.7rem] text-muted-foreground sm:block"
        >
          /
        </kbd>
      )}
    </div>
  );
};

export default SearchBox;
