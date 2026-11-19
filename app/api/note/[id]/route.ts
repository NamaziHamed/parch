import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { readNoteBody } from "@/lib/noteText";

type Context = { params: Promise<{ id: string }> };

const unauthorized = () =>
  NextResponse.json({ message: "Not Authorized" }, { status: 401 });
const notFound = () =>
  NextResponse.json({ message: "Note not found" }, { status: 404 });
const serverError = (error: unknown) => {
  console.error(error);
  return NextResponse.json(
    { message: "Internal server error" },
    { status: 500 }
  );
};

async function updateNote(req: Request, context: Context) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return unauthorized();

  const { id } = await context.params;
  const note = await readNoteBody(req);
  if (!note)
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });

  try {
    const { count } = await prisma.note.updateMany({
      where: { id, userId },
      data: {
        title: note.title,
        jsonText: JSON.stringify(note.jsonText),
        plainText: note.plainText,
      },
    });
    if (!count) return notFound();
    return NextResponse.json({ message: "Note updated" }, { status: 200 });
  } catch (error) {
    return serverError(error);
  }
}

// POST is kept alongside PUT because navigator.sendBeacon can only POST.
export const POST = updateNote;
export const PUT = updateNote;

export async function GET(_req: Request, context: Context) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return unauthorized();

  const { id } = await context.params;
  try {
    const note = await prisma.note.findFirst({ where: { id, userId } });
    if (!note) return notFound();
    return NextResponse.json(note, { status: 200 });
  } catch (error) {
    return serverError(error);
  }
}

export async function DELETE(_req: Request, context: Context) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return unauthorized();

  const { id } = await context.params;
  try {
    const { count } = await prisma.note.deleteMany({ where: { id, userId } });
    if (!count) return notFound();
    return NextResponse.json({ message: "Note deleted" }, { status: 200 });
  } catch (error) {
    return serverError(error);
  }
}
