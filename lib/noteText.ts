import { generateText, type JSONContent } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import {
  BackgroundColor,
  Color,
  TextStyle,
} from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";

const extensions = [
  StarterKit,
  TextStyle,
  BackgroundColor,
  Color,
  TaskList,
  TaskItem,
  TextAlign,
];

/** Extracts searchable plain text from a Tiptap JSON document. */
export function toPlainText(json: JSONContent | null | undefined): string {
  if (!json || json.type !== "doc") return "";
  try {
    return generateText(json, extensions);
  } catch (error) {
    console.error("Error generating plain text:", error);
    return "";
  }
}

/** Parses and validates the body sent by the note editor. */
export async function readNoteBody(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return null;
  const title = typeof body.title === "string" ? body.title : "";
  const jsonText: JSONContent =
    body.jsonText && typeof body.jsonText === "object" ? body.jsonText : {};
  return { title, jsonText, plainText: toPlainText(jsonText) };
}
