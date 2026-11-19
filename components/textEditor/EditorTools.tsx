"use client";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { Editor, useEditorState } from "@tiptap/react";
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BaselineIcon,
  BoldIcon,
  ChevronDownIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  ListTodoIcon,
  PilcrowIcon,
  StrikethroughIcon,
  UnderlineIcon,
  BanIcon,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { cn } from "@/lib/utils";

const TEXT_COLORS = [
  { name: "Gray", value: "#a1a1aa" },
  { name: "Red", value: "#f87171" },
  { name: "Orange", value: "#fb923c" },
  { name: "Yellow", value: "#facc15" },
  { name: "Green", value: "#4ade80" },
  { name: "Blue", value: "#60a5fa" },
  { name: "Purple", value: "#c084fc" },
  { name: "Pink", value: "#f472b6" },
];
// Translucent so highlights stay readable on the dark page.
const HIGHLIGHTS = TEXT_COLORS.map((c) => ({ name: c.name, value: `${c.value}40` }));

const isMac =
  typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
const mod = isMac ? "⌘" : "Ctrl+";

/** Keeps the editor selection when a tool is clicked. */
const keepSelection = (e: React.MouseEvent) => e.preventDefault();

function ToolButton({
  label,
  shortcut,
  active,
  onClick,
  children,
  className,
}: {
  label: string;
  shortcut?: string;
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={label}
          aria-pressed={active}
          onMouseDown={keepSelection}
          onClick={onClick}
          className={cn(
            "inline-flex h-8 min-w-8 shrink-0 items-center justify-center gap-0.5 rounded-md px-1.5 text-muted-foreground transition-colors",
            "hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "[&_svg]:size-4",
            active && "bg-primary/15 text-primary hover:bg-primary/20 hover:text-primary",
            className
          )}
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={6}>
        {label}
        {shortcut && <span className="ms-2 opacity-60">{shortcut}</span>}
      </TooltipContent>
    </Tooltip>
  );
}

const Divider = () => <span aria-hidden className="mx-0.5 h-5 w-px shrink-0 bg-border" />;

function Panel({
  open,
  align = "left",
  children,
  className,
}: {
  open: boolean;
  align?: "left" | "right";
  children: ReactNode;
  className?: string;
}) {
  if (!open) return null;
  return (
    <div
      onMouseDown={keepSelection}
      className={cn(
        "absolute top-full z-50 mt-2 rounded-lg border bg-popover p-1 text-popover-foreground shadow-xl shadow-black/40",
        "animate-in fade-in-0 zoom-in-95 duration-100",
        align === "left" ? "left-0" : "right-0",
        className
      )}
    >
      {children}
    </div>
  );
}

type MenuName = "style" | "align" | "color" | null;

/**
 * Formatting tools for the note editor. `variant="bubble"` is the floating
 * selection menu on desktop; `variant="bar"` is the compact toolbar shown on
 * phones (no strike/align, to fit one row).
 */
export default function EditorTools({
  editor,
  variant,
}: {
  editor: Editor;
  variant: "bubble" | "bar";
}) {
  const [open, setOpen] = useState<MenuName>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const compact = variant === "bar";

  const s = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      underline: e.isActive("underline"),
      strike: e.isActive("strike"),
      h1: e.isActive("heading", { level: 1 }),
      h2: e.isActive("heading", { level: 2 }),
      h3: e.isActive("heading", { level: 3 }),
      bullet: e.isActive("bulletList"),
      ordered: e.isActive("orderedList"),
      task: e.isActive("taskList"),
      align: (["center", "right", "justify"] as const).find((a) =>
        e.isActive({ textAlign: a })
      ) ?? "left",
      color: (e.getAttributes("textStyle").color as string | undefined) ?? "",
      highlight:
        (e.getAttributes("textStyle").backgroundColor as string | undefined) ?? "",
    }),
  });

  // Close any open panel on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(null);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const toggle = (name: MenuName) => setOpen((cur) => (cur === name ? null : name));
  const run = (fn: () => void) => {
    fn();
    setOpen(null);
  };
  const chain = () => editor.chain().focus();

  const styles = [
    { label: "Text", Icon: PilcrowIcon, active: !s.h1 && !s.h2 && !s.h3, cmd: () => chain().setParagraph().run(), preview: "text-sm" },
    { label: "Heading 1", Icon: Heading1Icon, active: s.h1, cmd: () => chain().toggleHeading({ level: 1 }).run(), preview: "text-lg font-bold" },
    { label: "Heading 2", Icon: Heading2Icon, active: s.h2, cmd: () => chain().toggleHeading({ level: 2 }).run(), preview: "text-base font-semibold" },
    { label: "Heading 3", Icon: Heading3Icon, active: s.h3, cmd: () => chain().toggleHeading({ level: 3 }).run(), preview: "text-sm font-semibold" },
  ];
  const currentStyle = styles.find((x) => x.active && x.label !== "Text") ?? styles[0];

  const aligns = [
    { value: "left", label: "Align left", Icon: AlignLeftIcon },
    { value: "center", label: "Align center", Icon: AlignCenterIcon },
    { value: "right", label: "Align right", Icon: AlignRightIcon },
    { value: "justify", label: "Justify", Icon: AlignJustifyIcon },
  ] as const;
  const CurrentAlign = aligns.find((a) => a.value === s.align)?.Icon ?? AlignLeftIcon;

  return (
    <div
      ref={rootRef}
      className={cn(
        "flex items-center gap-0.5",
        variant === "bubble" &&
          "rounded-xl border bg-popover/95 p-1 shadow-xl shadow-black/40 backdrop-blur-md"
      )}
    >
      {/* Text style */}
      <div className="relative">
        <ToolButton label="Text style" active={open === "style"} onClick={() => toggle("style")} className="px-2">
          <currentStyle.Icon />
          <ChevronDownIcon className="size-3! opacity-60" />
        </ToolButton>
        <Panel open={open === "style"} className="w-44">
          {styles.map(({ label, Icon, active, cmd, preview }) => (
            <button
              key={label}
              type="button"
              onClick={() => run(cmd)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left hover:bg-accent",
                active && "text-primary"
              )}
            >
              <Icon className="size-4 shrink-0 opacity-70" />
              <span className={preview}>{label}</span>
            </button>
          ))}
        </Panel>
      </div>

      <Divider />

      <ToolButton label="Bold" shortcut={`${mod}B`} active={s.bold} onClick={() => chain().toggleBold().run()}>
        <BoldIcon />
      </ToolButton>
      <ToolButton label="Italic" shortcut={`${mod}I`} active={s.italic} onClick={() => chain().toggleItalic().run()}>
        <ItalicIcon />
      </ToolButton>
      <ToolButton label="Underline" shortcut={`${mod}U`} active={s.underline} onClick={() => chain().toggleUnderline().run()}>
        <UnderlineIcon />
      </ToolButton>
      {!compact && (
        <ToolButton label="Strikethrough" active={s.strike} onClick={() => chain().toggleStrike().run()}>
          <StrikethroughIcon />
        </ToolButton>
      )}

      <Divider />

      <ToolButton label="Bullet list" active={s.bullet} onClick={() => chain().toggleBulletList().run()}>
        <ListIcon />
      </ToolButton>
      <ToolButton label="Numbered list" active={s.ordered} onClick={() => chain().toggleOrderedList().run()}>
        <ListOrderedIcon />
      </ToolButton>
      <ToolButton label="Checklist" active={s.task} onClick={() => chain().toggleTaskList().run()}>
        <ListTodoIcon />
      </ToolButton>

      {!compact && (
        <>
          <Divider />
          <div className="relative">
            <ToolButton label="Alignment" active={open === "align"} onClick={() => toggle("align")}>
              <CurrentAlign />
              <ChevronDownIcon className="size-3! opacity-60" />
            </ToolButton>
            <Panel open={open === "align"} className="flex gap-0.5">
              {aligns.map(({ value, label, Icon }) => (
                <ToolButton
                  key={value}
                  label={label}
                  active={s.align === value}
                  onClick={() => run(() => chain().setTextAlign(value).run())}
                >
                  <Icon />
                </ToolButton>
              ))}
            </Panel>
          </div>
        </>
      )}

      <Divider />

      {/* Colors */}
      <div className="relative">
        <ToolButton label="Colors" active={open === "color"} onClick={() => toggle("color")}>
          <span className="relative flex flex-col items-center">
            <BaselineIcon style={{ color: s.color || undefined }} />
            <span
              className="absolute -bottom-0.5 h-0.5 w-3.5 rounded-full"
              style={{ background: s.highlight || "transparent" }}
            />
          </span>
          <ChevronDownIcon className="size-3! opacity-60" />
        </ToolButton>
        <Panel open={open === "color"} align="right" className="w-60 p-2.5">
          <p className="mb-1.5 text-[0.7rem] font-medium uppercase tracking-wide text-muted-foreground">
            Text
          </p>
          <div className="grid grid-cols-9 gap-1">
            <Swatch label="Default" selected={!s.color} onClick={() => run(() => chain().unsetColor().run())}>
              <BanIcon className="size-3.5 text-muted-foreground" />
            </Swatch>
            {TEXT_COLORS.map((c) => (
              <Swatch
                key={c.value}
                label={c.name}
                selected={s.color.toLowerCase() === c.value}
                onClick={() => run(() => chain().setColor(c.value).run())}
              >
                <span className="text-sm font-semibold" style={{ color: c.value }}>A</span>
              </Swatch>
            ))}
          </div>
          <p className="mt-3 mb-1.5 text-[0.7rem] font-medium uppercase tracking-wide text-muted-foreground">
            Highlight
          </p>
          <div className="grid grid-cols-9 gap-1">
            <Swatch label="None" selected={!s.highlight} onClick={() => run(() => chain().unsetBackgroundColor().run())}>
              <BanIcon className="size-3.5 text-muted-foreground" />
            </Swatch>
            {HIGHLIGHTS.map((c) => (
              <Swatch
                key={c.value}
                label={`${c.name} highlight`}
                selected={s.highlight.toLowerCase() === c.value}
                onClick={() => run(() => chain().setBackgroundColor(c.value).run())}
              >
                <span className="size-4 rounded-full" style={{ background: c.value.slice(0, 7), opacity: 0.55 }} />
              </Swatch>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Swatch({
  label,
  selected,
  onClick,
  children,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "flex size-6 items-center justify-center rounded-md border border-transparent hover:bg-accent",
        selected && "border-primary bg-accent"
      )}
    >
      {children}
    </button>
  );
}
