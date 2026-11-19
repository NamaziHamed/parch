"use client";
import React from "react";
import { SearchIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";

const SearchBox = ({
  text,
  search,
}: {
  text: string;
  search: (value: string) => void;
}) => {
  return (
    <div className="relative w-full sm:max-w-sm">
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        value={text}
        onChange={(e) => search(e.target.value)}
        placeholder="Search by title or text"
        aria-label="Search notes"
        className="h-10 ps-9 pe-9 [&::-webkit-search-cancel-button]:hidden"
      />
      {text && (
        <button
          type="button"
          onClick={() => search("")}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-1 text-muted-foreground hover:text-foreground"
        >
          <XIcon className="size-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBox;
