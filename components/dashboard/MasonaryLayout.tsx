"use client";
import React from "react";
import Masonry from "react-masonry-css";
import { NoteData } from "@/utils/types";
import NoteCard from "./NoteCard";

export const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

const MasonaryLayout = ({
  data,
  onRemove,
}: {
  data: NoteData[];
  onRemove: (id: string) => void;
}) => {
  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="flex w-auto gap-4"
      columnClassName="min-w-0"
    >
      {data.map((note, index) => (
        <NoteCard key={note.id} note={note} index={index} onRemove={onRemove} />
      ))}
    </Masonry>
  );
};

export default MasonaryLayout;
