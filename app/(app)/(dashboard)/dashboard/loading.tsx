import NotesSkeleton from "@/components/dashboard/NotesSkeleton";

export default function Loading() {
  return (
    <>
      <div className="fixed inset-x-0 bottom-0 h-16 border-t bg-card md:inset-x-auto md:top-0 md:h-svh md:w-20 md:border-t-0 md:border-r" />
      <main className="px-4 pt-8 pb-32 md:ps-28 md:pe-8 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
          <div className="h-8 w-36 rounded-md bg-card animate-pulse" />
          <div className="h-10 w-full sm:max-w-sm rounded-md border bg-card animate-pulse" />
        </div>
        <NotesSkeleton />
      </main>
    </>
  );
}
