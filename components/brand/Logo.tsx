import Link from "next/link";
import { cn } from "@/lib/utils";

/** A fountain-pen nib drawn as a single glyph. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={cn("size-7", className)}
    >
      <rect width="32" height="32" rx="8" className="fill-primary" />
      <path
        d="M16 6.5c3.6 3.3 6 7.2 6 11 0 2.4-1.2 4.4-3.2 5.6L16 26l-2.8-2.9C11.2 21.9 10 19.9 10 17.5c0-3.8 2.4-7.7 6-11Z"
        className="fill-primary-foreground"
      />
      <path
        d="M16 14v8.2"
        strokeWidth="1.4"
        strokeLinecap="round"
        className="stroke-primary"
      />
      <circle cx="16" cy="13.4" r="1.6" className="fill-primary" />
    </svg>
  );
}

export function Logo({
  href = "/",
  className,
}: {
  href?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-label="Parch home"
      className={cn(
        "group inline-flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        className
      )}
    >
      <LogoMark className="transition-transform duration-300 group-hover:-rotate-6" />
      <span className="font-serif text-[1.35rem] font-semibold tracking-tight">
        Parch
      </span>
    </Link>
  );
}
