"use client";
import React, { useState } from "react";
import Link from "next/link";
import { EllipsisVerticalIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { DashboardNote } from "@/utils/types";
import { PreviewBlock } from "@/lib/notePreview";
import { formatUpdatedAt } from "@/lib/formatDate";
import { cn } from "@/lib/utils";

const headingClass = {
  1: "text-sm font-bold text-foreground",
  2: "text-[0.8rem] font-semibold text-foreground",
  3: "text-xs font-semibold text-foreground",
} as const;

// Long previews are capped and faded out so one note can't take over a column.
const isLong = (blocks: PreviewBlock[]) =>
  blocks.length > 7 || blocks.reduce((n, b) => n + b.text.length, 0) > 320;

const NoteCard = ({
  note,
  onRemove,
}: {
  note: DashboardNote;
  onRemove: (id: string) => void;
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const title = note.title?.trim();

  return (
    <Card className="group relative gap-0 py-0 shadow-none transition-colors hover:border-primary/50 focus-within:border-primary/50">
      <Link
        href={"/note/" + note.id}
        className="block rounded-xl p-4 outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <h3
          className={cn(
            "pe-6 font-semibold leading-snug line-clamp-2 break-words",
            !title && "text-muted-foreground font-normal italic"
          )}
        >
          {title || "Untitled"}
        </h3>

        {note.preview.length > 0 ? (
          <div
            className={cn(
              "mt-2 space-y-1.5 overflow-hidden break-words",
              isLong(note.preview) &&
                "max-h-56 mask-[linear-gradient(to_bottom,black_70%,transparent)]"
            )}
          >
            {note.preview.map((block, i) =>
              block.kind === "heading" ? (
                <p key={i} className={cn(headingClass[block.level], i > 0 && "pt-1")}>
                  {block.text}
                </p>
              ) : (
                <p key={i} className="text-xs leading-relaxed text-card-foreground/80">
                  {block.text}
                </p>
              )
            )}
          </div>
        ) : (
          <p className="mt-2 text-xs text-muted-foreground">Empty note</p>
        )}

        <p
          className="mt-3 text-[0.65rem] text-muted-foreground truncate"
          suppressHydrationWarning
        >
          {formatUpdatedAt(note.updatedAt)}
        </p>
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Note actions"
            className="absolute top-2 right-1.5 size-8 text-muted-foreground
              md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100 md:data-[state=open]:opacity-100"
          >
            <EllipsisVerticalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-36">
          <DropdownMenuItem asChild>
            <Link href={"/note/" + note.id}>
              <PencilIcon /> Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onSelect={() => setConfirmOpen(true)}>
            <Trash2Icon /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this note?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{title || "Untitled"}&rdquo; will be permanently deleted.
              This can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() => onRemove(note.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default NoteCard;
