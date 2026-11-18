import { CheckIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

/**
 * Reflects the note page's existing `hasChanged` flag. Parch persists edits
 * automatically when you leave the page (navigate away, close or reload the
 * tab), so the indicator describes exactly that.
 */
const SaveStatus = ({
  isNew,
  hasChanged,
}: {
  isNew: boolean;
  hasChanged: boolean;
}) => {
  const label = hasChanged ? "Edited" : isNew ? "New note" : "Saved";
  const hint = hasChanged
    ? "Your changes save automatically when you leave this page."
    : isNew
      ? "Start typing. Parch saves the note when you leave."
      : "All changes are saved.";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          role="status"
          aria-live="polite"
          tabIndex={0}
          className="inline-flex h-7 items-center gap-1.5 rounded-full border bg-card px-2.5 text-xs text-muted-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          {hasChanged ? (
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/50 [animation-iteration-count:2]" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
          ) : (
            <CheckIcon className="size-3.5 text-primary" />
          )}
          {label}
          <span className="sr-only">. {hint}</span>
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-60">{hint}</TooltipContent>
    </Tooltip>
  );
};

export default SaveStatus;
