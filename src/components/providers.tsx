"use client";

import { IconContext } from "@phosphor-icons/react";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
      <IconContext.Provider value={{ size: 18, weight: "regular" }}>{children}</IconContext.Provider>
    </ThemeProvider>
  );
}
