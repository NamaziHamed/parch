"use client";
import React from "react";
import { Editor, useEditorState } from "@tiptap/react";
import {
  BoldIcon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  ListTodoIcon,
  Redo2Icon,
  StrikethroughIcon,
  UnderlineIcon,
  Undo2Icon,
} from "lucide-react";
import { BubbleMenu } from "@tiptap/react/menus";
import ToolbarButton from "./ToolbarButton";
import { AlignMenu, BlockTypeMenu } from "./ToolbarDropdownButton";
import ColorSeterButtons from "./ColorSeterButtons";

const Divider = () => (
  <span aria-hidden="true" className="mx-1 h-5 w-px shrink-0 bg-border" />
);

const Toolbar = ({ editor }: { editor: Editor }) => {
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isBold: ctx.editor.isActive("bold") ?? false,
        isUnderline: ctx.editor.isActive("underline") ?? false,
        isItalic: ctx.editor.isActive("italic") ?? false,
        isStrike: ctx.editor.isActive("strike") ?? false,
        isHeading1: ctx.editor.isActive("heading", { level: 1 }) ?? false,
        isHeading2: ctx.editor.isActive("heading", { level: 2 }) ?? false,
        isHeading3: ctx.editor.isActive("heading", { level: 3 }) ?? false,
        isBulletList: ctx.editor.isActive("bulletList") ?? false,
        isOrderedList: ctx.editor.isActive("orderedList") ?? false,
        isTaskList: ctx.editor.isActive("taskList") ?? false,
        isParagraph: ctx.editor.isActive("paragraph") ?? false,
        isAlignLeft: ctx.editor.isActive({ textAlign: "left" }) ?? false,
        isAlignRight: ctx.editor.isActive({ textAlign: "right" }) ?? false,
        isAlignCenter: ctx.editor.isActive({ textAlign: "center" }) ?? false,
        isJustify: ctx.editor.isActive({ textAlign: "justify" }) ?? false,
        currentBgColor:
          ctx.editor.getAttributes("textStyle").backgroundColor ?? "",
        currentTextColor: ctx.editor.getAttributes("textStyle").color ?? "",
        canUndo: ctx.editor.can().undo(),
        canRedo: ctx.editor.can().redo(),
      };
    },
  });

  const markTools = [
    {
      title: "Bold",
      shortcut: "Ctrl B",
      Icon: BoldIcon,
      command: () => editor.chain().focus().toggleBold().run(),
      isActive: editorState.isBold,
    },
    {
      title: "Italic",
      shortcut: "Ctrl I",
      Icon: ItalicIcon,
      command: () => editor.chain().focus().toggleItalic().run(),
      isActive: editorState.isItalic,
    },
    {
      title: "Underline",
      shortcut: "Ctrl U",
      Icon: UnderlineIcon,
      command: () => editor.chain().focus().toggleUnderline().run(),
      isActive: editorState.isUnderline,
    },
    {
      title: "Strikethrough",
      shortcut: "Ctrl Shift S",
      Icon: StrikethroughIcon,
      command: () => editor.chain().focus().toggleStrike().run(),
      isActive: editorState.isStrike,
    },
  ];

  const listTools = [
    {
      title: "Bullet list",
      Icon: ListIcon,
      command: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editorState.isBulletList,
    },
    {
      title: "Numbered list",
      Icon: ListOrderedIcon,
      command: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editorState.isOrderedList,
    },
    {
      title: "Checklist",
      Icon: ListTodoIcon,
      command: () => editor.chain().focus().toggleTaskList().run(),
      isActive: editorState.isTaskList,
    },
  ];

  return (
    <>
      {/* Persistent toolbar */}
      <div
        role="toolbar"
        aria-label="Formatting"
        className="flex items-center overflow-x-auto rounded-xl border bg-card/90 p-1 shadow-paper backdrop-blur-md [scrollbar-width:none] supports-[backdrop-filter]:bg-card/75"
      >
        <ToolbarButton
          title="Undo"
          shortcut="Ctrl Z"
          command={() => editor.chain().focus().undo().run()}
          disabled={!editorState.canUndo}
        >
          <Undo2Icon />
        </ToolbarButton>
        <ToolbarButton
          title="Redo"
          shortcut="Ctrl Shift Z"
          command={() => editor.chain().focus().redo().run()}
          disabled={!editorState.canRedo}
        >
          <Redo2Icon />
        </ToolbarButton>
        <Divider />
        <BlockTypeMenu editor={editor} editorState={editorState} />
        <Divider />
        {markTools.map(({ title, Icon, command, isActive, shortcut }) => (
          <ToolbarButton
            key={title}
            title={title}
            shortcut={shortcut}
            command={command}
            isActive={isActive}
          >
            <Icon />
          </ToolbarButton>
        ))}
        <Divider />
        {listTools.map(({ title, Icon, command, isActive }) => (
          <ToolbarButton
            key={title}
            title={title}
            command={command}
            isActive={isActive}
          >
            <Icon />
          </ToolbarButton>
        ))}
        <Divider />
        <AlignMenu editor={editor} editorState={editorState} />
        <Divider />
        <ColorSeterButtons editor={editor} editorState={editorState} />
      </div>

      {/* Quick formatting on text selection */}
      <BubbleMenu editor={editor}>
        <div className="flex items-center gap-0.5 rounded-lg border bg-popover p-1 shadow-lifted animate-in fade-in-0 zoom-in-95 duration-150">
          {markTools.map(({ title, Icon, command, isActive, shortcut }) => (
            <ToolbarButton
              key={title}
              title={title}
              shortcut={shortcut}
              command={command}
              isActive={isActive}
            >
              <Icon />
            </ToolbarButton>
          ))}
        </div>
      </BubbleMenu>
    </>
  );
};

export default Toolbar;
