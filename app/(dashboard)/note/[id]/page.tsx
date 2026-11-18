"use client";
import React, { useEffect, useRef, useState } from "react";
import Tiptap from "@/components/textEditor/Tiptap";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/brand/ThemeToggle";
import SaveStatus from "@/components/textEditor/SaveStatus";
import { ChevronLeftIcon } from "lucide-react";
import { JSONContent } from "@tiptap/react";
import axios from "axios";
import Link from "next/link";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { NoteData } from "@/utils/types";

const NotePage = () => {
  const initialData = {
    id: "new",
    title: "",
    jsonText: {},
    hasChanged: false,
  };
  const [noteData, setNoteData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();

  const noteStateRef = useRef(noteData);

  useEffect(() => {
    noteStateRef.current = noteData;
  }, [noteData]);

  useEffect(() => {
    const noteId = params.id as string;
    setIsLoading(true);

    const loadNote = async () => {
      if (noteId !== "new") {
        try {
          const res = await axios.get<NoteData>(`/api/note/${noteId}`);
          if (res.status === 200) {
            const note = res.data;
            setNoteData({
              id: noteId,
              title: note.title || "",
              jsonText: JSON.parse(note.jsonText || "{}"),
              hasChanged: false,
            });
          }
        } catch (error) {
          toast.error("Failed to load note.");
          console.error(error);
        }
      }
      setIsLoading(false);
    };

    loadNote();
  }, [params.id]);

  useEffect(() => {
    const saveOnExit = () => {
      const lastState = noteStateRef.current;

      if (lastState.hasChanged) {
        const data = { title: lastState.title, jsonText: lastState.jsonText };
        const blob = new Blob([JSON.stringify(data)], {
          type: "application/json",
        });

        if (lastState.id === "new") {
          navigator.sendBeacon("/api/note/", blob);
        } else {
          navigator.sendBeacon(`/api/note/${lastState.id}`, blob);
        }
      }
    };

    window.addEventListener("beforeunload", saveOnExit);

    return () => {
      window.removeEventListener("beforeunload", saveOnExit);
      saveOnExit();
    };
  }, []);

  const header = (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/65">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-3 px-4 sm:px-6">
        <Button asChild variant="ghost" size="sm" className="-ms-2 text-muted-foreground hover:text-foreground">
          <Link href={"/dashboard"}>
            <ChevronLeftIcon />
            <span>All notes</span>
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          {!isLoading && (
            <SaveStatus isNew={noteData.id === "new"} hasChanged={noteData.hasChanged} />
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );

  if (isLoading) {
    return (
      <div className="min-h-dvh">
        {header}
        <div role="status" aria-label="Loading note" className="mx-auto max-w-3xl px-4 pt-10 sm:px-6">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="mt-8 h-10 w-full rounded-xl" />
          <div className="mt-10 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <span className="sr-only">Loading note…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh">
      {header}
      <main className="mx-auto max-w-3xl px-4 pt-8 sm:px-6 sm:pt-12 animate-in fade-in-0 duration-300">
        <input
          className="w-full bg-transparent font-serif text-3xl leading-tight font-semibold tracking-tight text-foreground outline-none placeholder:text-muted-foreground/50 sm:text-[2.6rem]"
          placeholder="Untitled"
          aria-label="Note title"
          value={noteData.title}
          onChange={(e) => {
            setNoteData({ ...noteData, title: e.target.value, hasChanged: true });
          }}
        />

        <Tiptap
          key={noteData.id}
          initialValue={noteData.jsonText}
          onChange={(newContent: JSONContent) => {
            setNoteData({ ...noteData, jsonText: newContent, hasChanged: true });
          }}
        />
      </main>
    </div>
  );
};

export default NotePage;
