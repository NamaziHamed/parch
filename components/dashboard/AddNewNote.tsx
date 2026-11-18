import React from "react";
import Link from "next/link";
import { PlusIcon } from "lucide-react";

/** Floating "new note" action, shown on small screens only. */
const AddNewNote = () => {
  return (
    <Link
      href={"/note/new"}
      aria-label="New note"
      className="fixed right-5 bottom-5 z-40 grid size-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-lifted transition-transform duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:hidden animate-in zoom-in-75 fade-in-0 duration-300"
    >
      <PlusIcon className="size-6" />
    </Link>
  );
};

export default AddNewNote;
