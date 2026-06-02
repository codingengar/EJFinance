"use client";

import { useState } from "react";
import { AppBar } from "./AppBar";
import { NavRail } from "./NavRail";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-background">
      <AppBar isExpanded={isExpanded} onToggle={() => setIsExpanded((v) => !v)} />
      <div className="flex flex-1 overflow-hidden">
        <NavRail isExpanded={isExpanded} />
        <main className="flex-1 overflow-auto bg-muted/30">
          {children}
        </main>
      </div>
    </div>
  );
}
