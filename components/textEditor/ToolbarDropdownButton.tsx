"use client";
import React from "react";
import { EditorActiveState } from "@/utils/types";
import { Editor } from "@tiptap/react";
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  CheckIcon,
  ChevronDownIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  PilcrowIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { cn } from "@/lib/utils";

type Option = {
  title: string;
  Icon: React.ComponentType<{ className?: string }>;
  command: () => void;
  isActive: boolean;
};

const triggerClass =
  "inline-flex h-8 shrink-0 items-center gap-1 rounded-md px-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[state=open]:bg-accent data-[state=open]:text-foreground";

const Dropdown = ({
  label,
  options,
  children,
  triggerClassName,
}: {
  label: string;
  options: Option[];
  children: React.ReactNode;
  triggerClassName?: string;
}) => (
  <DropdownMenu modal={false}>
    <Tooltip>
      <TooltipTrigger asChild>
        <DropdownMenuTrigger aria-label={label} className={cn(triggerClass, triggerClassName)}>
          {children}
          <ChevronDownIcon className="size-3 opacity-60" />
        </DropdownMenuTrigger>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
    <DropdownMenuContent
      align="start"
      className="min-w-44"
      onCloseAutoFocus={(e) => e.preventDefault()}
    >
      {options.map(({ title, Icon, command, isActive }) => (
        <DropdownMenuItem
          key={title}
          onSelect={command}
          className={cn(isActive && "text-primary")}
        >
          <Icon className="size-4" />
          <span className="flex-1">{title}</span>
          {isActive && <CheckIcon className="size-3.5" />}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);

type MenuProps = { editorState: EditorActiveState; editor: Editor };

/** "Text style" menu: paragraph / heading levels. */
export const BlockTypeMenu = ({ editorState, editor }: MenuProps) => {
  const options: Option[] = [
    {
      title: "Paragraph",
      Icon: PilcrowIcon,
      command: () => editor.chain().focus().setParagraph().run(),
      isActive:
        editorState.isParagraph &&
        !editorState.isHeading1 &&
        !editorState.isHeading2 &&
        !editorState.isHeading3,
    },
    {
      title: "Heading 1",
      Icon: Heading1Icon,
      command: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editorState.isHeading1,
    },
    {
      title: "Heading 2",
      Icon: Heading2Icon,
      command: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editorState.isHeading2,
    },
    {
      title: "Heading 3",
      Icon: Heading3Icon,
      command: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editorState.isHeading3,
    },
  ];
  const current =
    options.slice(1).find((o) => o.isActive)?.title ?? "Paragraph";

  return (
    <Dropdown
      label="Text style"
      options={options}
      triggerClassName="w-[7.25rem] justify-between"
    >
      <span className="truncate text-foreground">{current}</span>
    </Dropdown>
  );
};

/** Alignment menu; the trigger mirrors the current alignment. */
export const AlignMenu = ({ editorState, editor }: MenuProps) => {
  const options: Option[] = [
    {
      title: "Align left",
      Icon: AlignLeftIcon,
      command: () => editor.chain().focus().setTextAlign("left").run(),
      isActive: editorState.isAlignLeft,
    },
    {
      title: "Align center",
      Icon: AlignCenterIcon,
      command: () => editor.chain().focus().setTextAlign("center").run(),
      isActive: editorState.isAlignCenter,
    },
    {
      title: "Align right",
      Icon: AlignRightIcon,
      command: () => editor.chain().focus().setTextAlign("right").run(),
      isActive: editorState.isAlignRight,
    },
    {
      title: "Justify",
      Icon: AlignJustifyIcon,
      command: () => editor.chain().focus().setTextAlign("justify").run(),
      isActive: editorState.isJustify,
    },
  ];
  const CurrentIcon = options.find((o) => o.isActive)?.Icon ?? AlignLeftIcon;

  return (
    <Dropdown label="Alignment" options={options}>
      <CurrentIcon className="size-4" />
    </Dropdown>
  );
};

const ToolbarDropdownButton = (props: MenuProps) => (
  <>
    <BlockTypeMenu {...props} />
    <AlignMenu {...props} />
  </>
);

export default ToolbarDropdownButton;
