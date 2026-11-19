import NotesSkeleton from "@/components/dashboard/NotesSkeleton";

export default function Loading() {
  return (
    <main>
      <aside className="min-h-screen fixed top-0 bg-card w-16" />
      <div className="ps-24 pt-10 pe-3">
        <div className="h-8 w-32 mb-4 rounded-md bg-card animate-pulse" />
        <div className="h-9 w-full rounded-md border bg-card animate-pulse" />
      </div>
      <NotesSkeleton />
    </main>
  );
}
