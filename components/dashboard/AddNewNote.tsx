import React from "react";
import Link from "next/link";
import { PlusIcon } from "lucide-react";

/** Desktop floating "new note" button; on mobile it lives in the bottom bar. */
const AddNewNote = () => {
  return (
    <Link
      href={"/note/new"}
      aria-label="New note"
      className="fixed right-6 bottom-6 z-30 hidden size-14 items-center justify-center rounded-full
        bg-primary text-primary-foreground shadow-lg shadow-primary/30
        transition-transform hover:scale-105 active:scale-95 md:flex"
    >
      <PlusIcon className="size-7" />
    </Link>
  );
};

export default AddNewNote;
