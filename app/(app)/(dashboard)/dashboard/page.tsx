import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Sidebar from "@/components/dashboard/Sidebar";
import AddNewNote from "@/components/dashboard/AddNewNote";
import NotesBoard from "@/components/dashboard/NotesBoard";

// Rendered on the server: the session and notes arrive with the HTML, so
// there's no client-side session fetch, no loading spinner, and no
// next-auth/react in the browser bundle.
export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/login");

  const notes = await prisma.note.findMany({
    where: { userId },
    select: {
      id: true,
      title: true,
      plainText: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <main>
      <Sidebar session={session} />
      <NotesBoard initialNotes={notes} />
      <AddNewNote />
    </main>
  );
}
