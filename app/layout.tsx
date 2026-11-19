import type { Metadata, Viewport } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Provider from "@/components/providers/Provider";

const roboto = Roboto({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Parch",
  description: "Scribe your note, never lose them",
};

// viewport-fit=cover lets the mobile bottom bar extend under the home
// indicator (padded with env(safe-area-inset-bottom)).
export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.className} antialiased`}>
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  );
}
