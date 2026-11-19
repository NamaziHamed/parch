"use client";
import React from "react";
import { Editor, EditorContent, JSONContent, useEditor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import {
  TextStyle,
  BackgroundColor,
  Color,
} from "@tiptap/extension-text-style";
import { Placeholder } from "@tiptap/extensions";
import EditorTools from "./EditorTools";

const countWords = (editor: Editor) =>
  editor.getText().trim().split(/\s+/).filter(Boolean).length;

const isDesktop = () =>
  typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;

const Tiptap = ({
  initialValue,
  onChange,
  onWordCount,
  onReady,
}: {
  initialValue: JSONContent | null;
  onChange: (json: JSONContent) => void;
  onWordCount?: (words: number) => void;
  onReady?: (editor: Editor) => void;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      BackgroundColor,
      Color,
      TaskList,
      TaskItem.configure({ nested: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({
        placeholder: ({ node }) =>
          node.type.name === "heading" ? "Heading" : "Start writing…",
      }),
    ],
    content: initialValue && Object.keys(initialValue).length ? initialValue : null,
    autofocus: initialValue && Object.keys(initialValue).length ? false : "end",
    editorProps: {
      attributes: { class: "tiptap note-body min-h-[50vh] pb-24" },
    },
    onCreate: ({ editor }) => {
      onWordCount?.(countWords(editor));
      onReady?.(editor);
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
      onWordCount?.(countWords(editor));
    },
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <div>
      {/* Phones: tools live in a compact bar under the page header. */}
      <div
        className="sticky top-14 z-20 -mx-5 mb-4 border-b bg-background/90 px-3 py-1.5 backdrop-blur-md
          sm:-mx-8 sm:px-6 md:hidden"
      >
        <EditorTools editor={editor} variant="bar" />
      </div>

      {/* Desktop: floating menu on text selection. */}
      <BubbleMenu
        editor={editor}
        options={{ placement: "top", offset: 10 }}
        shouldShow={({ editor, state, from, to }) => {
          if (!isDesktop() || !editor.isEditable) return false;
          return !state.selection.empty && state.doc.textBetween(from, to).length > 0;
        }}
      >
        <EditorTools editor={editor} variant="bubble" />
      </BubbleMenu>

      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;
