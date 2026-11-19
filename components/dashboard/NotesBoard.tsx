"use client";
import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import SearchBox from "./SearchBox";
import NotesSkeleton from "./NotesSkeleton";
import { IPlainNotedata } from "@/utils/types";

// The grid (and its masonry dependency) is split into its own chunk and
// loaded on demand, keeping it out of every other route's bundle.
const MasonaryLayout = dynamic(() => import("./MasonaryLayout"), {
  loading: () => <NotesSkeleton />,
});

const NotesBoard = ({ initialNotes }: { initialNotes: IPlainNotedata[] }) => {
  const [notes, setNotes] = useState(initialNotes);
  const [searchText, setSearchText] = useState("");

  const filtered = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return notes;
    return notes.filter(
      (note) =>
        note.plainText?.toLowerCase().includes(query) ||
        note.title?.toLowerCase().includes(query)
    );
  }, [notes, searchText]);

  const handleRemove = async (id: string) => {
    try {
      const res = await fetch(`/api/note/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Delete failed (${res.status})`);
      setNotes((prev) => prev.filter((note) => note.id !== id));
      toast.success("Note deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete note! please try again!");
    }
  };

  return (
    <div>
      <div className="ps-24 pt-10 pe-3 w-full gap-4">
        <h2 className="font-semibold text-2xl text-primary mb-4">All notes</h2>
        <SearchBox text={searchText} search={setSearchText} />
      </div>
      {notes.length === 0 ? (
        <p className="ps-24 pt-10 pe-3 text-muted-foreground">
          No notes yet. Hit the + button to write your first one.
        </p>
      ) : (
        <MasonaryLayout data={filtered} onRemove={handleRemove} />
      )}
    </div>
  );
};

export default NotesBoard;
