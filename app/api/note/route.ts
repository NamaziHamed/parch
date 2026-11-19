import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { readNoteBody } from "@/lib/noteText";

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId)
    return NextResponse.json({ message: "Not Authorized" }, { status: 401 });

  const note = await readNoteBody(req);
  if (!note)
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });

  try {
    const newNote = await prisma.note.create({
      data: {
        title: note.title,
        jsonText: JSON.stringify(note.jsonText),
        plainText: note.plainText,
        userId,
      },
    });
    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    console.error("Create note failed", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId)
    return NextResponse.json({ message: "Not Authorized" }, { status: 401 });

  try {
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
    return NextResponse.json(notes, { status: 200 });
  } catch (error) {
    console.error("List notes failed", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
