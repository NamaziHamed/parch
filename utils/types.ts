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

export type EditorActiveState = {
  isBold: boolean;
  isUnderline: boolean;
  isItalic: boolean;
  isStrike: boolean;
  isHeading1: boolean;
  isHeading2: boolean;
  isHeading3: boolean;
  isBulletList: boolean;
  isOrderedList: boolean;
  isTaskList: boolean;
  isParagraph: boolean;
  isAlignLeft: boolean;
  isAlignRight: boolean;
  isAlignCenter: boolean;
  isJustify: boolean;
  currentBgColor: string;
  currentTextColor: string;
};
