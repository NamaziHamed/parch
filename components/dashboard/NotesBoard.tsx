"use client";
import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import SearchBox from "./SearchBox";
import NotesSkeleton from "./NotesSkeleton";
import { DashboardNote } from "@/utils/types";

// The grid (masonry layout, cards, menus, dialog) is split into its own chunk
// and loaded on demand, keeping it out of every other route's bundle.
const NotesGrid = dynamic(() => import("./NotesGrid"), {
  loading: () => <NotesSkeleton />,
});

const NotesBoard = ({ initialNotes }: { initialNotes: DashboardNote[] }) => {
  const [notes, setNotes] = useState(initialNotes);
  const [searchText, setSearchText] = useState("");

  const query = searchText.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!query) return notes;
    return notes.filter(
      (note) =>
        note.plainText?.toLowerCase().includes(query) ||
        note.title?.toLowerCase().includes(query)
    );
  }, [notes, query]);

  const handleRemove = async (id: string) => {
    const previous = notes;
    // Optimistic: the card leaves immediately and the grid reflows.
    setNotes((prev) => prev.filter((note) => note.id !== id));
    try {
      const res = await fetch(`/api/note/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Delete failed (${res.status})`);
      toast.success("Note deleted");
    } catch (error) {
      console.error(error);
      setNotes(previous);
      toast.error("Failed to delete note, please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="flex items-baseline gap-2 text-2xl font-semibold text-primary">
          All notes
          <span className="text-sm font-normal text-muted-foreground">
            {notes.length}
          </span>
        </h1>
        <SearchBox text={searchText} search={setSearchText} />
      </div>

      {notes.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
          No notes yet. Tap <span className="text-primary font-medium">+</span>{" "}
          to write your first one.
        </div>
      ) : filtered.length === 0 ? (
        <p className="py-10 text-center text-muted-foreground">
          No notes match &ldquo;{searchText.trim()}&rdquo;.
        </p>
      ) : (
        <NotesGrid data={filtered} onRemove={handleRemove} />
      )}
    </div>
  );
};

export default NotesBoard;
