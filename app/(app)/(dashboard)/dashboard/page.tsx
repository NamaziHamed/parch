import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { toPreview } from "@/lib/notePreview";
import Sidebar from "@/components/dashboard/Sidebar";
import AddNewNote from "@/components/dashboard/AddNewNote";
import NotesBoard from "@/components/dashboard/NotesBoard";
import { DashboardNote } from "@/utils/types";

// Rendered on the server: the session and notes arrive with the HTML, so
// there's no client-side session fetch, no loading spinner, and no
// next-auth/react in the browser bundle.
export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/login");

  const rows = await prisma.note.findMany({
    where: { userId },
    select: {
      id: true,
      title: true,
      plainText: true,
      jsonText: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  // Ship a small preview instead of each full document.
  const notes: DashboardNote[] = rows.map(({ jsonText, ...note }) => ({
    ...note,
    preview: toPreview(jsonText),
  }));

  return (
    <>
      <Sidebar session={session} />
      <main className="px-4 pt-8 pb-32 md:ps-28 md:pe-8 md:pb-12">
        <NotesBoard initialNotes={notes} />
      </main>
      <AddNewNote />
    </>
  );
}
