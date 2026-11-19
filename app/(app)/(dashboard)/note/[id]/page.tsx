"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import type { Editor, JSONContent } from "@tiptap/react";
import { ArrowLeftIcon, CheckIcon, CloudAlertIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { NoteData } from "@/utils/types";
import { formatUpdatedAt } from "@/lib/formatDate";
import { cn } from "@/lib/utils";

// The editor (Tiptap + ProseMirror) is the heaviest code in the app, so it's
// loaded in its own chunk after the page shell and title have rendered.
const Tiptap = dynamic(() => import("@/components/textEditor/Tiptap"), {
  ssr: false,
  loading: () => (
    <div className="space-y-3 pt-2" aria-hidden>
      <div className="h-4 w-2/3 rounded bg-muted animate-pulse" />
      <div className="h-4 w-1/2 rounded bg-muted animate-pulse" />
      <div className="h-4 w-3/5 rounded bg-muted animate-pulse" />
    </div>
  ),
});

type SaveStatus = "saved" | "unsaved" | "saving" | "error";

const AUTOSAVE_DELAY = 1200;
const hasText = (json: JSONContent) => JSON.stringify(json).includes('"text"');

const NoteEditor = ({ noteId }: { noteId: string }) => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [initialContent, setInitialContent] = useState<JSONContent>({});
  const [isLoading, setIsLoading] = useState(noteId !== "new");
  const [status, setStatus] = useState<SaveStatus>("saved");
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [words, setWords] = useState(0);
  const [leaving, setLeaving] = useState(false);

  // Server id; becomes the real id once a "new" note has been created.
  const idRef = useRef(noteId);
  // Latest content for saves triggered from timers / unload handlers.
  const latest = useRef({ title: "", json: {} as JSONContent, dirty: false });
  // Saves run one after another so a new note is never created twice.
  const queue = useRef<Promise<boolean>>(Promise.resolve(true));
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const editorRef = useRef<Editor | null>(null);

  useEffect(() => {
    if (noteId === "new") return;
    let cancelled = false;

    fetch(`/api/note/${noteId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`Failed to load note (${res.status})`);
        const note: NoteData = await res.json();
        if (cancelled) return;
        const json = JSON.parse(note.jsonText || "{}");
        latest.current = { title: note.title || "", json, dirty: false };
        setTitle(note.title || "");
        setInitialContent(json);
        setUpdatedAt(new Date(note.updatedAt));
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

  /** Queues a save of the latest content. Resolves to false if it failed. */
  const persist = useCallback((opts: { keepalive?: boolean } = {}) => {
    clearTimeout(timer.current);
    queue.current = queue.current.then(async () => {
      const state = latest.current;
      if (!state.dirty) return true;

      const isNew = idRef.current === "new";
      // Don't create empty notes when the user opens "new" and leaves.
      if (isNew && !state.title.trim() && !hasText(state.json)) {
        latest.current = { ...state, dirty: false };
        setStatus("saved");
        return true;
      }

      latest.current = { ...state, dirty: false };
      setStatus("saving");
      const body = JSON.stringify({ title: state.title, jsonText: state.json });
      try {
        const res = await fetch(isNew ? "/api/note" : `/api/note/${idRef.current}`, {
          method: isNew ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body,
          // keepalive lets the request outlive the page, but caps the body at 64KB.
          keepalive: opts.keepalive && body.length < 60_000,
        });
        if (!res.ok) throw new Error(`Save failed (${res.status})`);
        if (isNew) idRef.current = ((await res.json()) as NoteData).id;
        setUpdatedAt(new Date());
        // More edits may have arrived while this request was in flight.
        setStatus(latest.current.dirty ? "unsaved" : "saved");
        return true;
      } catch (error) {
        console.error(error);
        latest.current = { ...latest.current, dirty: true };
        setStatus("error");
        return false;
      }
    });
    return queue.current;
  }, []);

  const markDirty = (patch: Partial<{ title: string; json: JSONContent }>) => {
    latest.current = { ...latest.current, ...patch, dirty: true };
    setStatus("unsaved");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => persist(), AUTOSAVE_DELAY);
  };

  // Flush unsaved changes when the tab closes or the page unmounts.
  useEffect(() => {
    const flush = () => {
      if (latest.current.dirty) persist({ keepalive: true });
    };
    window.addEventListener("beforeunload", flush);
    return () => {
      window.removeEventListener("beforeunload", flush);
      flush();
    };
  }, [persist]);

  const goToDashboard = async () => {
    setLeaving(true);
    // Wait for the save so the dashboard shows the up-to-date note.
    const ok = await persist();
    if (!ok) {
      toast.error("Couldn't save your note, please try again.");
      setLeaving(false);
      return;
    }
    router.push("/dashboard");
  };

  return (
    <div className="min-h-svh">
      <header className="sticky top-0 z-30 h-14 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-3xl items-center justify-between gap-3 px-3 sm:px-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={goToDashboard}
            disabled={leaving}
            className="-ms-1 gap-1.5 text-muted-foreground hover:text-foreground"
          >
            {leaving ? <Loader2Icon className="animate-spin" /> : <ArrowLeftIcon />}
            Notes
          </Button>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {!isLoading && (
              <span className="hidden tabular-nums sm:inline">
                {words} {words === 1 ? "word" : "words"}
              </span>
            )}
            <SaveIndicator status={status} />
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-3xl px-5 pt-8 sm:px-8 sm:pt-14">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-14 -z-10 h-72
            bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,color-mix(in_oklch,var(--primary)_10%,transparent),transparent)]"
        />
        {isLoading ? (
          <div className="space-y-4" aria-label="Loading note">
            <div className="h-10 w-1/2 rounded-md bg-muted animate-pulse" />
            <div className="h-3 w-40 rounded bg-muted animate-pulse" />
            <div className="h-4 w-2/3 rounded bg-muted animate-pulse" />
            <div className="h-4 w-1/2 rounded bg-muted animate-pulse" />
          </div>
        ) : (
          <>
            <textarea
              value={title}
              rows={1}
              placeholder="Untitled"
              aria-label="Note title"
              autoFocus={noteId === "new"}
              onChange={(e) => {
                const value = e.target.value.replace(/\n/g, " ");
                setTitle(value);
                markDirty({ title: value });
              }}
              onKeyDown={(e) => {
                // Enter jumps from the title into the body, like a doc editor.
                if (e.key === "Enter" || (e.key === "ArrowDown" && !e.shiftKey)) {
                  e.preventDefault();
                  const editor = editorRef.current;
                  if (!editor) return;
                  // Move DOM focus synchronously (Tiptap's focus() waits a
                  // frame, so the next keystroke would still hit the title).
                  editor.view.dom.focus();
                  editor.commands.setTextSelection(1);
                }
              }}
              className="w-full resize-none overflow-hidden bg-transparent font-(family-name:--font-note)
                text-3xl font-bold leading-tight tracking-tight text-foreground outline-none
                placeholder:text-muted-foreground/50 field-sizing-content sm:text-4xl"
            />
            <p className="mt-2 mb-6 text-xs text-muted-foreground sm:mb-8" suppressHydrationWarning>
              {updatedAt ? `Edited ${formatUpdatedAt(updatedAt)}` : "New note"}
              <span className="sm:hidden"> · {words} {words === 1 ? "word" : "words"}</span>
            </p>

            <Tiptap
              initialValue={initialContent}
              onChange={(json) => markDirty({ json })}
              onWordCount={setWords}
              onReady={(editor) => (editorRef.current = editor)}
            />
          </>
        )}
      </main>
    </div>
  );
};

function SaveIndicator({ status }: { status: SaveStatus }) {
  const map = {
    saved: { label: "Saved", Icon: CheckIcon, className: "text-muted-foreground" },
    unsaved: { label: "Editing", Icon: null, className: "text-muted-foreground" },
    saving: { label: "Saving…", Icon: Loader2Icon, className: "text-muted-foreground" },
    error: { label: "Not saved", Icon: CloudAlertIcon, className: "text-destructive" },
  }[status];

  return (
    <span className={cn("flex items-center gap-1.5", map.className)} aria-live="polite">
      {map.Icon ? (
        <map.Icon className={cn("size-3.5", status === "saving" && "animate-spin")} />
      ) : (
        <span className="size-1.5 rounded-full bg-amber-400" />
      )}
      {map.label}
    </span>
  );
}

const NotePage = () => {
  const params = useParams<{ id: string }>();
  return <NoteEditor key={params.id} noteId={params.id} />;
};

export default NotePage;
