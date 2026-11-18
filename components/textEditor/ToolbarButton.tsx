import React, { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { cn } from "@/lib/utils";

interface IToolbarButtonProps {
  title: string;
  command?: () => void;
  /** Omit for plain actions (undo/redo); pass a boolean for toggles. */
  isActive?: boolean;
  disabled?: boolean;
  shortcut?: string;
  children: ReactNode;
}

const ToolbarButton = ({
  title,
  command,
  isActive,
  disabled,
  shortcut,
  children,
}: IToolbarButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={command}
          disabled={disabled}
          aria-label={title}
          aria-pressed={isActive === undefined ? undefined : isActive}
          className={cn(
            "grid size-8 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors",
            "hover:bg-accent hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
            "disabled:pointer-events-none disabled:opacity-35",
            "[&_svg]:size-4",
            isActive && "bg-accent text-primary hover:text-primary"
          )}
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent className="flex items-center gap-2">
        {title}
        {shortcut && (
          <kbd className="font-mono text-[0.65rem] opacity-70">{shortcut}</kbd>
        )}
      </TooltipContent>
    </Tooltip>
  );
};

export default ToolbarButton;
