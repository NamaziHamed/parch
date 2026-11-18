"use client";
import { debounce } from "lodash";
import React from "react";
import { Editor } from "@tiptap/react";
import { HexColorPicker } from "react-colorful";
import { BanIcon, HighlighterIcon, TypeIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { EditorActiveState } from "@/utils/types";
import { cn } from "@/lib/utils";

interface ColorToolProps {
  editor: Editor;
  editorState: EditorActiveState;
}

const TEXT_SWATCHES = [
  "#9a3412",
  "#b45309",
  "#4d7c0f",
  "#0f766e",
  "#1d4ed8",
  "#6d28d9",
  "#be185d",
];

const HIGHLIGHT_SWATCHES = [
  "#fef08a",
  "#fed7aa",
  "#fecaca",
  "#fbcfe8",
  "#ddd6fe",
  "#bae6fd",
  "#bbf7d0",
];

const ColorSeterButtons = ({ editor, editorState }: ColorToolProps) => {
  const colorTools = [
    {
      title: "Text color",
      Icon: TypeIcon,
      current: editorState.currentTextColor,
      type: "text",
      swatches: TEXT_SWATCHES,
    },
    {
      title: "Highlight",
      Icon: HighlighterIcon,
      current: editorState.currentBgColor,
      type: "bg",
      swatches: HIGHLIGHT_SWATCHES,
    },
  ];

  const applyColor = (type: string, color: string) => {
    if (type === "bg") {
      editor.chain().focus().setBackgroundColor(color).run();
    } else {
      editor.chain().focus().setColor(color).run();
    }
  };

  const handleColorChange = debounce(applyColor, 300);

  const clearColor = (type: string) => {
    if (type === "bg") {
      editor.chain().focus().unsetBackgroundColor().run();
    } else {
      editor.chain().focus().unsetColor().run();
    }
  };

  return (
    <div className="flex items-center gap-0.5">
      {colorTools.map((item) => (
        <Popover key={item.title}>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger
                aria-label={item.title}
                className="relative grid size-8 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[state=open]:bg-accent"
              >
                <item.Icon className="size-4" />
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute bottom-1 left-1/2 h-[3px] w-4 -translate-x-1/2 rounded-full",
                    !item.current && "bg-border"
                  )}
                  style={item.current ? { backgroundColor: item.current } : undefined}
                />
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent>{item.title}</TooltipContent>
          </Tooltip>
          <PopoverContent
            className="w-auto space-y-3 p-3"
            align="start"
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            <p className="text-xs font-medium text-muted-foreground">
              {item.title}
            </p>
            <div className="grid grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => clearColor(item.type)}
                aria-label={`Remove ${item.title.toLowerCase()}`}
                className="grid size-7 place-items-center rounded-md border text-muted-foreground transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                <BanIcon className="size-3.5" />
              </button>
              {item.swatches.map((color) => (
                <button
                  type="button"
                  key={color}
                  onClick={() => applyColor(item.type, color)}
                  aria-label={`Use ${color}`}
                  aria-pressed={item.current?.toLowerCase() === color}
                  className={cn(
                    "size-7 rounded-md border border-black/10 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                    item.current?.toLowerCase() === color &&
                      "ring-2 ring-ring ring-offset-2 ring-offset-popover"
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <HexColorPicker
              color={item.current}
              onChange={(color: string) => handleColorChange(item.type, color)}
            />
          </PopoverContent>
        </Popover>
      ))}
    </div>
  );
};

export default ColorSeterButtons;
