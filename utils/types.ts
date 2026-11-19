export interface IPlainNotedata {
  id: string;
  title: string | null;
  plainText: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/** A note as shown on the dashboard: preview instead of the full document. */
export interface DashboardNote extends IPlainNotedata {
  preview: import("@/lib/notePreview").PreviewBlock[];
}

export interface NoteData extends IPlainNotedata {
  jsonText: string | null;
}
