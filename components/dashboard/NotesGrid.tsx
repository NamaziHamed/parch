"use client";
import React from "react";
import Masonry from "./Masonry";
import NoteCard from "./NoteCard";
import { DashboardNote } from "@/utils/types";

const getKey = (note: DashboardNote) => note.id;

const NotesGrid = ({
  data,
  onRemove,
}: {
  data: DashboardNote[];
  onRemove: (id: string) => void;
}) => (
  <Masonry
    items={data}
    getKey={getKey}
    renderItem={(note) => <NoteCard note={note} onRemove={onRemove} />}
  />
);

export default NotesGrid;
