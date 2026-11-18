import type { Metadata, Viewport } from "next";
import { Geist, Newsreader } from "next/font/google";
import "./globals.css";
import Provider from "@/components/providers/Provider";
import { Toaster } from "@/components/ui/sonner";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Parch: a quiet place to write",
    template: "%s · Parch",
  },
  description:
    "Parch is a calm, distraction-free notebook. Rich text, instant search and autosave, in a space that feels like paper.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f5ef" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1916" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} ${newsreader.variable}`}
    >
      <body className="min-h-dvh font-sans antialiased">
        <Provider>
          {children}
          <Toaster position="bottom-center" />
        </Provider>
      </body>
    </html>
  );
}
