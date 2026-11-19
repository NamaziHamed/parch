import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { LogInIcon, UserPlus2 } from "lucide-react";

const Header = () => {
  return (
    <header
      className="relative z-50 flex h-16 w-full shrink-0 items-center justify-between
      border-b bg-card/80 px-4 backdrop-blur-md sm:h-20 sm:px-6"
    >
      <div>
        <Link href={"/"} aria-label="Parch home">
          <Image
            src={"/logo.png"}
            width={120}
            height={50}
            alt="Parch logo"
            priority
            className="h-auto w-24 sm:w-30"
          />
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <Button asChild size={"sm"} variant={"default"}>
          <Link href={"/login"}>
            <LogInIcon /> Login
          </Link>
        </Button>

        <Button asChild size={"sm"} variant={"outline"}>
          <Link href={"/register"}>
            <UserPlus2 /> Signup
          </Link>
        </Button>
      </div>
    </header>
  );
};

export default Header;
