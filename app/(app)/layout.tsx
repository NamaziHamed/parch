import { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";

// Shared by the auth and app pages (not the landing page), so the toast
// library only loads where it's used, and toasts survive login -> dashboard.
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
