"use client";

import { HeroUIProvider } from "@heroui/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return <HeroUIProvider className="flex flex-col h-full">{children}</HeroUIProvider>;
}