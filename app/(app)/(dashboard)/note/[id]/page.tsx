"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowBigLeft, Loader2Icon } from "lucide-react";
import type { JSONContent } from "@tiptap/react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { NoteData } from "@/utils/types";

// The editor (Tiptap + ProseMirror) is the heaviest code in the app, so it's
// loaded in its own chunk after the page shell and title have rendered.
const Tiptap = dynamic(() => import("@/components/textEditor/Tiptap"), {
  ssr: false,
  loading: () => (
    <div className="bg-card rounded-b-xl min-h-[83vh] p-4 space-y-3" aria-hidden>
      <div className="h-4 w-2/3 rounded bg-muted animate-pulse" />
      <div className="h-4 w-1/2 rounded bg-muted animate-pulse" />
      <div className="h-4 w-3/5 rounded bg-muted animate-pulse" />
    </div>
  ),
});

type NoteState = {
  title: string;
  jsonText: JSONContent;
  hasChanged: boolean;
};

const hasText = (json: JSONContent) => JSON.stringify(json).includes('"text"');

const NoteEditor = ({ noteId }: { noteId: string }) => {
  const router = useRouter();
  const [noteData, setNoteData] = useState<NoteState>({
    title: "",
    jsonText: {},
    hasChanged: false,
  });
  const [isLoading, setIsLoading] = useState(noteId !== "new");
  const [isSaving, setIsSaving] = useState(false);

  // Latest state for the unmount / unload handlers, which are registered once.
  const noteStateRef = useRef(noteData);
  // Server id; becomes the real id once a "new" note has been created.
  const idRef = useRef(noteId);
  useEffect(() => {
    noteStateRef.current = noteData;
  }, [noteData]);

  useEffect(() => {
    if (noteId === "new") return;
    let cancelled = false;

    fetch(`/api/note/${noteId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`Failed to load note (${res.status})`);
        const note: NoteData = await res.json();
        if (cancelled) return;
        setNoteData({
          title: note.title || "",
          jsonText: JSON.parse(note.jsonText || "{}"),
          hasChanged: false,
        });
      })
      .catch((error) => {
        console.error(error);
        if (!cancelled) toast.error("Failed to load note.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [noteId]);

  /**
   * Persists unsaved changes. `keepalive` lets the request outlive the page,
   * so the same function works for unmount and tab close.
   */
  const save = useCallback(async () => {
    const state = noteStateRef.current;
    if (!state.hasChanged) return;

    const isNew = idRef.current === "new";
    // Don't create empty notes when the user opens "new" and leaves.
    if (isNew && !state.title.trim() && !hasText(state.jsonText)) return;

    // Mark as saved up front so a second trigger (unmount after the
    // dashboard button) doesn't send a duplicate request.
    noteStateRef.current = { ...state, hasChanged: false };

    const res = await fetch(isNew ? "/api/note" : `/api/note/${idRef.current}`, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: state.title, jsonText: state.jsonText }),
      keepalive: true,
    });
    if (!res.ok) {
      noteStateRef.current = { ...noteStateRef.current, hasChanged: true };
      throw new Error(`Save failed (${res.status})`);
    }
    if (isNew) {
      const created: NoteData = await res.json();
      idRef.current = created.id;
    }
  }, []);

  useEffect(() => {
    const saveOnExit = () => {
      save().catch(console.error);
    };
    window.addEventListener("beforeunload", saveOnExit);
    return () => {
      window.removeEventListener("beforeunload", saveOnExit);
      saveOnExit();
    };
  }, [save]);

  const goToDashboard = async () => {
    setIsSaving(true);
    try {
      // Wait for the save so the dashboard fetches the up-to-date note.
      await save();
    } catch (error) {
      console.error(error);
      toast.error("Couldn't save your note, please try again.");
      setIsSaving(false);
      return;
    }
    router.push("/dashboard");
  };

  if (isLoading) {
    return (
      <div className="flex gap-2 items-center min-w-screen min-h-screen justify-center">
        <Loader2Icon className="text-primary w-8 h-8 animate-spin" />
        <span className="animate-pulse">Loading...</span>
      </div>
    );
  }

  return (
    <div className="pt-24 relative">
      <div
        className="h-24 w-full fixed top-0 left-0 py-6 px-3 bg-zinc-950 z-10
      border-b border-white"
      >
        <Button
          variant={"outline"}
          onClick={goToDashboard}
          disabled={isSaving}
          className="flex gap-2 items-center"
        >
          {isSaving ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <ArrowBigLeft />
          )}
          <span>Dashboard</span>
        </Button>
      </div>
      <Input
        className="py-9 text-2xl md:text-3xl lg:text-4xl font-bold border-b"
        placeholder="Untitled"
        value={noteData.title}
        onChange={(e) => {
          const title = e.target.value;
          setNoteData((prev) => ({ ...prev, title, hasChanged: true }));
        }}
      />

      <Tiptap
        initialValue={noteData.jsonText}
        onChange={(jsonText: JSONContent) => {
          setNoteData((prev) => ({ ...prev, jsonText, hasChanged: true }));
        }}
      />
    </div>
  );
};

const NotePage = () => {
  const params = useParams<{ id: string }>();
  return <NoteEditor key={params.id} noteId={params.id} />;
};

export default NotePage;
