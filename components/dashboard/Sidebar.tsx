import { Session } from "next-auth";
import React from "react";
import Link from "next/link";
import { LogOutIcon, PlusIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { logout } from "@/utils/authActions";

/**
 * Desktop: a slim rail on the left. Mobile: a bottom tab bar within thumb
 * reach, with the new-note button raised in the middle like a native app.
 */
const Sidebar = ({ session }: { session: Session | null }) => {
  const name = session?.user?.name ?? "";

  return (
    <nav
      aria-label="Dashboard"
      className="fixed z-40 bg-card/95 backdrop-blur-md
        inset-x-0 bottom-0 border-t pb-[env(safe-area-inset-bottom)]
        md:inset-x-auto md:top-0 md:left-0 md:h-svh md:w-20 md:border-t-0 md:border-r md:pb-0"
    >
      <div
        className="grid h-16 grid-cols-3 items-center px-6
          md:flex md:h-full md:flex-col md:justify-between md:px-2 md:py-5"
      >
        <div className="flex flex-col items-center gap-1 justify-self-start md:justify-self-auto">
          <Avatar className="size-8 md:size-10">
            <AvatarImage src={session?.user?.image ?? ""} alt={name} />
            <AvatarFallback>{name.charAt(0).toUpperCase() || "?"}</AvatarFallback>
          </Avatar>
          <p className="hidden max-w-16 truncate text-xs md:block">
            {name.split(" ")[0]}
          </p>
        </div>

        <Link
          href="/note/new"
          aria-label="New note"
          className="justify-self-center -mt-7 flex size-14 items-center justify-center rounded-full
            bg-primary text-primary-foreground shadow-lg shadow-primary/30 ring-4 ring-background
            transition-transform active:scale-95 md:hidden"
        >
          <PlusIcon className="size-7" />
        </Link>

        <form action={logout} className="justify-self-end md:justify-self-auto">
          <Button
            variant="ghost"
            size="icon"
            title="Log out"
            aria-label="Log out"
            type="submit"
            className="size-10 text-muted-foreground hover:text-foreground"
          >
            <LogOutIcon className="size-5" />
          </Button>
        </form>
      </div>
    </nav>
  );
};

export default Sidebar;
