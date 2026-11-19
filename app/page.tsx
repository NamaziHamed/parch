import Image from "next/image";
import Link from "next/link";
import Header from "@/components/header/Header";
import { Button } from "@/components/ui/button";
import {
  ArrowRightIcon,
  FastForwardIcon,
  LucideToolCase,
  SearchCheckIcon,
} from "lucide-react";

const features = [
  {
    id: 1,
    title: "Search system",
    short: "Search",
    content: "Find any note instantly by its title or its content.",
    Icon: SearchCheckIcon,
    iconColor: "text-blue-500",
  },
  {
    id: 2,
    title: "Easy signup",
    short: "Quick signup",
    content: "Sign in with Google or email and start writing in seconds.",
    Icon: FastForwardIcon,
    iconColor: "text-red-500",
  },
  {
    id: 3,
    title: "User Friendly tools",
    short: "Simple tools",
    content: "Headings, alignment, lists, colors and highlights. No clutter.",
    Icon: LucideToolCase,
    iconColor: "text-violet-300",
  },
];

/**
 * Single-screen landing: everything fits in one viewport like an app splash.
 * Desktop is a two-column split; on phones the product shot flexes to fill
 * whatever height is left between the hero and the feature chips. Very short
 * screens fall back to scrolling instead of clipping.
 */
export default function Home() {
  return (
    <div className="relative flex min-h-svh flex-col overflow-x-clip lg:h-svh lg:overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10
          bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,color-mix(in_oklch,var(--primary)_18%,transparent),transparent)]
          lg:bg-[radial-gradient(ellipse_45%_60%_at_75%_55%,color-mix(in_oklch,var(--primary)_16%,transparent),transparent)]"
      />
      <Header />

      <main
        className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-5 px-4 pt-6 pb-5
          sm:gap-7 sm:px-6 sm:pt-10
          lg:grid lg:min-h-0 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-center lg:gap-12 lg:px-10 lg:py-10"
      >
        {/* Copy, actions and features */}
        <div className="flex flex-col text-center lg:text-left">
          <h1
            className="font-bold text-balance text-primary leading-[1.05]
              text-4xl sm:text-6xl xl:text-7xl
              animate-in slide-in-from-top-10 fade-in-0 duration-700"
          >
            Your second brain is here!
          </h1>
          <p
            className="mx-auto mt-3 max-w-md text-pretty text-base text-muted-foreground sm:mt-5 sm:text-lg lg:mx-0
              animate-in fade-in-0 duration-1000"
          >
            Write down your thoughts, get them out of your head!
          </p>

          <div
            className="mt-5 flex flex-col items-center gap-2 sm:mt-8 sm:flex-row sm:justify-center sm:gap-3 lg:justify-start
              animate-in slide-in-from-bottom-10 fade-in-0 duration-700"
          >
            <Button
              asChild
              size="lg"
              className="group h-12 w-full max-w-xs px-8 text-base shadow-lg shadow-primary/25
                transition-all hover:-translate-y-0.5 hover:shadow-primary/40 sm:w-auto"
            >
              <Link href="/register">
                Get started
                <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="h-9 text-sm text-muted-foreground sm:h-12 sm:text-base"
            >
              <Link href="/login">I already have an account</Link>
            </Button>
          </div>

          {/* Desktop: compact feature list under the actions */}
          <ul className="mt-10 hidden space-y-5 lg:block xl:mt-12 animate-in fade-in-0 duration-1000">
            {features.map(({ id, title, content, Icon, iconColor }) => (
              <li key={id} className="flex items-start gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border bg-card">
                  <Icon className={`size-5 ${iconColor}`} />
                </span>
                <div>
                  <p className="font-semibold italic">{title}</p>
                  <p className="text-sm text-muted-foreground">{content}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Product shot: flexes to fill the remaining height on phones */}
        <div
          className="relative flex min-h-40 flex-1 lg:h-full lg:max-h-[620px] lg:min-h-0 lg:flex-none
            animate-in fade-in-0 zoom-in-95 duration-1000"
        >
          <div
            aria-hidden
            className="absolute inset-x-[10%] top-[25%] bottom-0 -z-10 rounded-full bg-primary/25 blur-3xl"
          />
          <div className="relative w-full overflow-hidden rounded-2xl border bg-card shadow-2xl shadow-black/50 sm:rounded-3xl">
            <Image
              src="/banner.png"
              alt="Parch dashboard open on a laptop on a bright desk"
              fill
              priority
              // The photo is zoomed in on the laptop, so request a larger rendition
              // than the frame itself or it comes out blurry.
              sizes="(max-width: 1024px) 140vw, 85vw"
              className="object-cover object-[50%_60%] scale-[1.3] brightness-[0.82] lg:scale-[1.45]"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(ellipse_75%_70%_at_50%_55%,transparent_45%,color-mix(in_oklch,var(--background)_70%,transparent))]"
            />
          </div>
        </div>

        {/* Phones and tablets: feature chips at the bottom of the screen */}
        <ul className="grid grid-cols-3 gap-2 sm:gap-3 lg:hidden">
          {features.map(({ id, short, Icon, iconColor }) => (
            <li
              key={id}
              className="flex flex-col items-center gap-1.5 rounded-xl border bg-card/80 px-2 py-3 text-center sm:flex-row sm:justify-center sm:gap-2"
            >
              <Icon className={`size-5 shrink-0 ${iconColor}`} />
              <span className="text-xs font-medium sm:text-sm">{short}</span>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
