"use client";
import React, { useState } from "react";
import Toolbar from "./Toolbar";
import { EditorContent } from "@tiptap/react";
import { JSONContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import {
  TextStyle,
  BackgroundColor,
  Color,
} from "@tiptap/extension-text-style";

const Tiptap = ({
  initialValue,
  onChange,
}: {
  initialValue: JSONContent | null;
  onChange: (json: JSONContent) => void;
}) => {
  const [text] = useState(initialValue || null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      BackgroundColor,
      TaskList,
      Color,
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: "checkList",
        },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: text,
    autofocus: true,
    editorProps: {
      attributes: {
        class: "min-h-[60vh] pb-32",
        "aria-label": "Note content",
        "aria-multiline": "true",
        role: "textbox",
      },
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onChange(json);
    },
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <div>
      <div className="sticky top-14 z-20 -mx-1 pt-2 pb-6">
        <Toolbar editor={editor} />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;
