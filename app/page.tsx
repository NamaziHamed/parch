import Image from "next/image";
import Link from "next/link";
import Header from "@/components/header/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
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
    content: "Find any note instantly by its title or its content.",
    Icon: SearchCheckIcon,
    iconColor: "text-blue-500",
  },
  {
    id: 2,
    title: "Easy signup",
    content: "Sign in with Google or email and start writing in seconds.",
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
    <div className="relative min-h-svh overflow-x-clip">
      <Header />

      <main>
        {/* Hero */}
        <section className="relative px-4 pt-32 pb-12 text-center sm:pt-40 sm:pb-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[38rem]
              bg-[radial-gradient(ellipse_60%_55%_at_50%_0%,color-mix(in_oklch,var(--primary)_22%,transparent),transparent)]"
          />
          <h1
            className="mx-auto max-w-4xl font-bold text-balance text-primary leading-[1.05]
              text-5xl sm:text-6xl lg:text-7xl
              animate-in slide-in-from-top-10 fade-in-0 duration-700"
          >
            Your second brain is here!
          </h1>
          <p
            className="mx-auto mt-5 max-w-md text-pretty text-base text-muted-foreground sm:text-lg
              animate-in fade-in-0 duration-1000"
          >
            Write down your thoughts, get them out of your head!
          </p>
          <div
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row
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
              size="lg"
              variant="ghost"
              className="h-12 w-full max-w-xs text-base text-muted-foreground sm:w-auto"
            >
              <Link href="/login">I already have an account</Link>
            </Button>
          </div>
        </section>

        {/* Product shot: the desk photo, framed instead of hidden behind text */}
        <section className="px-4">
          <div className="relative mx-auto max-w-5xl animate-in fade-in-0 zoom-in-95 duration-1000">
            <div
              aria-hidden
              className="absolute inset-x-[10%] top-[20%] bottom-0 -z-10 rounded-full bg-primary/25 blur-3xl"
            />
            <div
              className="relative aspect-[5/4] overflow-hidden rounded-2xl border bg-card
                shadow-2xl shadow-black/50 sm:aspect-[16/9] sm:rounded-3xl"
            >
              <Image
                src="/banner.png"
                alt="Parch dashboard open on a laptop on a bright desk"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover object-[50%_60%] scale-[1.35] brightness-[0.82] sm:scale-125"
              />
              {/* Vignette so the bright photo sits comfortably on the dark page */}
              <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(ellipse_75%_70%_at_50%_55%,transparent_45%,color-mix(in_oklch,var(--background)_70%,transparent))]"
              />
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-4 pt-20 pb-16 sm:pt-28">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center text-2xl font-semibold text-balance sm:text-3xl">
              Everything you need,{" "}
              <span className="text-primary">nothing you don&apos;t</span>
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-5">
              {features.map(({ id, title, content, Icon, iconColor }) => (
                <Card
                  key={id}
                  className="shadow-none transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
                >
                  <CardContent className="flex items-start gap-4 sm:flex-col sm:items-center sm:text-center">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted">
                      <Icon className={`size-5 ${iconColor}`} />
                    </span>
                    <div>
                      <CardTitle className="font-semibold italic mb-1.5">
                        {title}
                      </CardTitle>
                      <p className="text-sm text-pretty leading-relaxed text-muted-foreground">
                        {content}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t px-4 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Parch · Scribe your notes, never lose them
      </footer>
    </div>
  );
}
