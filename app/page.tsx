import Header from "@/components/header/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  ArrowRightIcon,
  FastForwardIcon,
  LucideToolCase,
  SearchCheckIcon,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    id: 2,
    title: "Search system",
    content: "Find any note instantly by its title or its content.",
    Icon: SearchCheckIcon,
    iconColor: "text-blue-500",
  },
  {
    id: 1,
    title: "Easy signup",
    content:
      "Sign in with Google or email and start writing in seconds.",
    Icon: FastForwardIcon,
    iconColor: "text-red-500",
  },

  {
    id: 3,
    title: "User Friendly tools",
    content:
      "No clutter, just what you need: headings, alignment, lists, colors and highlights.",
    Icon: LucideToolCase,
    iconColor: "text-violet-300",
  },
];

export default function Home() {
  return (
    <div className="relative min-h-svh overflow-x-hidden">
      {/* Background photo + a soft fade so text stays readable on top of it */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10 bg-[url('/banner.png')] bg-cover bg-center opacity-40"
      />
      <div
        aria-hidden
        className="fixed inset-0 -z-10 bg-linear-to-b from-background/70 via-background/20 to-background/90"
      />
      <Header />
      <main className="flex min-h-svh flex-col items-center justify-around gap-10 px-4 pt-28 pb-10">
        <div className="flex flex-col items-center justify-center space-y-5 text-center">
          <h1
            className="font-bold text-balance text-primary text-5xl sm:text-6xl lg:text-7xl
            animate-in slide-in-from-top-80 duration-500 fade-in-0 drop-shadow-sm"
          >
            Your second brain is here!
          </h1>
          <p className="max-w-md text-pretty text-base text-foreground/90 sm:text-lg">
            Write down your thoughts, get them out of your head!
          </p>
          <Button
            asChild
            size={"lg"}
            className="group h-11 px-7 text-base shadow-lg shadow-primary/20 transition-all
              hover:-translate-y-0.5 hover:shadow-primary/30
              animate-in slide-in-from-bottom-80 duration-500 fade-in-0"
          >
            <Link href={"/register"}>
              Get started
              <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <div className="grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3 md:gap-5">
          {features.map(({ id, title, content, Icon, iconColor }) => (
            <Card
              key={id}
              className="bg-card/85 backdrop-blur-sm shadow-none transition-all duration-300
                hover:-translate-y-1 hover:border-primary/40"
            >
              <CardContent className="flex flex-col items-center text-center">
                <span className="mb-3 flex size-9 items-center justify-center rounded-full bg-muted">
                  <Icon className={`size-5 ${iconColor}`} />
                </span>
                <CardTitle className="font-semibold italic mb-2">
                  {title}
                </CardTitle>
                <p className="text-xs text-pretty leading-relaxed text-muted-foreground">
                  {content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
