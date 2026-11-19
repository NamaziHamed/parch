import type { JSONContent } from "@tiptap/core";

export type PreviewBlock =
  | { kind: "heading"; level: 1 | 2 | 3; text: string }
  | { kind: "text"; text: string };

const MAX_BLOCKS = 12;
const MAX_CHARS = 600;

function textOf(node: JSONContent): string {
  if (node.type === "text") return node.text ?? "";
  if (node.type === "hardBreak") return " ";
  return (node.content ?? []).map(textOf).join("");
}

/**
 * Turns a Tiptap document into a short card preview: headings keep their
 * level, everything else (paragraphs, list items, quotes, code) becomes plain
 * text lines. Built on the server so the client never receives full notes.
 */
export function toPreview(jsonText: string | null): PreviewBlock[] {
  let doc: JSONContent;
  try {
    doc = JSON.parse(jsonText || "{}");
  } catch {
    return [];
  }

  const blocks: PreviewBlock[] = [];
  let chars = 0;

  const visit = (node: JSONContent) => {
    if (blocks.length >= MAX_BLOCKS || chars >= MAX_CHARS) return;
    switch (node.type) {
      case "heading": {
        const text = textOf(node).trim();
        if (text) {
          const level = Math.min(Math.max(node.attrs?.level ?? 1, 1), 3);
          blocks.push({ kind: "heading", level: level as 1 | 2 | 3, text });
          chars += text.length;
        }
        return;
      }
      case "paragraph":
      case "codeBlock": {
        const text = textOf(node).trim();
        if (text) {
          blocks.push({ kind: "text", text });
          chars += text.length;
        }
        return;
      }
      default:
        // doc, lists, list items, blockquotes: descend into children
        (node.content ?? []).forEach(visit);
    }
  };

  visit(doc);
  return blocks;
}
