import Link from "next/link";
import Header from "@/components/header/Header";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/Logo";
import { EditorPreview } from "@/components/landing/EditorPreview";
import {
  ArrowRightIcon,
  CloudIcon,
  LayoutGridIcon,
  MoonStarIcon,
  PenLineIcon,
  SearchIcon,
  ShieldCheckIcon,
} from "lucide-react";

const features = [
  {
    title: "Rich text, without the clutter",
    content:
      "Headings, lists, checklists, alignment, colour and highlights. Everything you need, tucked away until you need it.",
    Icon: PenLineIcon,
  },
  {
    title: "Autosave you never think about",
    content:
      "Close the tab, walk away. Parch keeps your words safe so you never have to hunt for a save button.",
    Icon: CloudIcon,
  },
  {
    title: "Find anything, instantly",
    content:
      "Search across every title and every line of text. Your notes appear as you type.",
    Icon: SearchIcon,
  },
  {
    title: "A board for your thoughts",
    content:
      "Notes settle into a calm masonry grid, freshest first, so long and short ideas sit happily together.",
    Icon: LayoutGridIcon,
  },
  {
    title: "Sign in your way",
    content:
      "One click with Google, or a classic email and password. Your notebook is private to you.",
    Icon: ShieldCheckIcon,
  },
  {
    title: "Easy on the eyes, day or night",
    content:
      "A warm paper theme by day and a lamplit dark mode by night, following your system automatically.",
    Icon: MoonStarIcon,
  },
];

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="paper-glow relative overflow-hidden">
          <div className="mx-auto max-w-6xl px-4 pt-16 pb-20 text-center sm:px-6 sm:pt-24 sm:pb-28">
            <p className="mx-auto inline-flex items-center gap-2 rounded-full border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground shadow-paper animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
              <span className="size-1.5 rounded-full bg-primary" />
              Free, private and built for writing
            </p>

            <h1 className="mx-auto mt-6 max-w-3xl font-serif text-[2.6rem] leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl animate-in fade-in-0 slide-in-from-bottom-3 duration-700">
              A quiet place for{" "}
              <em className="font-normal text-primary">everything</em> on your
              mind.
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base text-pretty text-muted-foreground sm:text-lg animate-in fade-in-0 slide-in-from-bottom-3 duration-700 delay-100 fill-mode-backwards">
              Parch is a calm, paper-like notebook. Capture ideas in rich text,
              find them again in a keystroke, and let autosave take care of the
              rest.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row animate-in fade-in-0 slide-in-from-bottom-3 duration-700 delay-200 fill-mode-backwards">
              <Button asChild size="lg" className="group h-11 px-6 text-[0.95rem]">
                <Link href="/register">
                  Start writing, it&apos;s free
                  <ArrowRightIcon className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="h-11 px-6 text-[0.95rem]">
                <Link href="/login">I already have an account</Link>
              </Button>
            </div>

            <div className="mt-16 sm:mt-20 animate-in fade-in-0 slide-in-from-bottom-6 duration-1000 delay-300 fill-mode-backwards">
              <EditorPreview />
            </div>
          </div>
        </section>

        {/* Features */}
        <section
          aria-labelledby="features-heading"
          className="border-t bg-paper/60"
        >
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-primary">Why Parch</p>
              <h2
                id="features-heading"
                className="mt-2 font-serif text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
              >
                Everything a notebook should do. Nothing it shouldn&apos;t.
              </h2>
            </div>

            <ul className="mt-12 grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-3">
              {features.map(({ title, content, Icon }) => (
                <li
                  key={title}
                  className="group bg-card p-6 transition-colors hover:bg-paper sm:p-8"
                >
                  <span className="grid size-10 place-items-center rounded-lg bg-accent text-primary transition-transform duration-300 group-hover:-translate-y-0.5">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-5 font-serif text-xl font-semibold tracking-tight">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {content}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="border-t">
          <div className="paper-lines mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 sm:py-24">
            <h2 className="mx-auto max-w-2xl font-serif text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
              Your next good idea deserves a page.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-muted-foreground">
              Create an account in seconds and start with a blank sheet.
            </p>
            <Button asChild size="lg" className="group mt-8 h-11 px-6">
              <Link href="/register">
                Create your notebook
                <ArrowRightIcon className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6">
          <Logo />
          <p>Built with Next.js, TipTap and Auth.js.</p>
        </div>
      </footer>
    </div>
  );
}
