import { Session } from "next-auth";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { Logo } from "../brand/Logo";
import { ThemeToggle } from "../brand/ThemeToggle";
import { Button } from "../ui/button";
import UserMenu from "./UserMenu";

const AppHeader = ({ session }: { session: Session | null }) => {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/65">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo href="/dashboard" />
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/note/new">
              <PlusIcon />
              New note
            </Link>
          </Button>
          <ThemeToggle />
          <UserMenu session={session} />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
