import { ReactNode } from "react";
import { Literata } from "next/font/google";

// A reading serif for the writing surface ("Parch" as in parchment).
// Loaded here so only note pages download it.
const literata = Literata({
  subsets: ["latin"],
  variable: "--font-note",
  display: "swap",
});

export default function NoteLayout({ children }: { children: ReactNode }) {
  return <div className={literata.variable}>{children}</div>;
}
