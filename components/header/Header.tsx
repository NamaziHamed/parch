import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { Logo } from "../brand/Logo";
import { ThemeToggle } from "../brand/ThemeToggle";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/65">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav aria-label="Account" className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/register">Get started</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
