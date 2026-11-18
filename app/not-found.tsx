import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="paper-glow flex min-h-dvh flex-col items-center justify-center px-4 text-center">
      <Logo className="mb-10" />
      <p className="font-serif text-7xl font-semibold tracking-tight text-primary">
        404
      </p>
      <h1 className="mt-4 font-serif text-2xl font-semibold tracking-tight">
        This page was never written
      </h1>
      <p className="mt-2 max-w-sm text-muted-foreground">
        The link may be broken, or the note may have been deleted.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Back to Parch</Link>
      </Button>
    </div>
  );
}
