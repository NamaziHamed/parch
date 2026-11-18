import React, { ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/brand/ThemeToggle";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_minmax(0,1.05fr)]">
      {/* Form column */}
      <div className="flex flex-col px-4 py-6 sm:px-8">
        <div className="flex items-center justify-between">
          <Logo />
          <ThemeToggle />
        </div>
        <main className="flex flex-1 items-center justify-center py-10">
          {children}
        </main>
        <p className="text-center text-xs text-muted-foreground">
          Your notes are private to your account.
        </p>
      </div>

      {/* Brand column */}
      <aside
        aria-hidden="true"
        className="paper-glow relative hidden overflow-hidden border-s bg-paper lg:flex lg:flex-col lg:justify-center"
      >
        <div className="paper-lines absolute inset-0 opacity-60" />
        <div className="absolute inset-y-0 left-16 w-px bg-primary/25" />
        <figure className="relative mx-auto max-w-md px-12 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
          <blockquote className="font-serif text-3xl leading-snug font-medium tracking-tight text-balance xl:text-4xl">
            &ldquo;Fill your paper with the breathings of your heart.&rdquo;
          </blockquote>
          <figcaption className="mt-6 text-sm text-muted-foreground">
            William Wordsworth
          </figcaption>
        </figure>
      </aside>
    </div>
  );
};

export default layout;
