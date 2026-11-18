"use client";
import { Session } from "next-auth";
import { LogOutIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { logout } from "@/utils/authActions";

const initials = (name?: string | null) =>
  (name ?? "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "?";

const UserMenu = ({ session }: { session: Session | null }) => {
  const user = session?.user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Account menu"
        className="rounded-full outline-none transition-shadow focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <Avatar className="size-8 border">
          <AvatarImage src={user?.image ?? ""} alt="" />
          <AvatarFallback className="bg-accent text-xs font-medium text-accent-foreground">
            {initials(user?.name)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-60">
        <DropdownMenuLabel className="font-normal">
          <p className="truncate text-sm font-medium">{user?.name ?? "Writer"}</p>
          {user?.email && (
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <form action={logout}>
          <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
            <button type="submit" className="w-full cursor-pointer">
              <LogOutIcon />
              Sign out
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
