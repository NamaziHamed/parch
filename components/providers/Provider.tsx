import { ReactNode } from "react";
import { ThemeProvider } from "./theme-provider";
import AuthProvider from "./auth-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function Provider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute={"class"}
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <TooltipProvider delayDuration={300}>{children}</TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
