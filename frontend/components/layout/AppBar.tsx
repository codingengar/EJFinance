"use client";

import { Menu, Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

interface AppBarProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export function AppBar({ onToggle }: AppBarProps) {
  return (
    <header className="h-14 border-b border-border bg-background/95 backdrop-blur-sm flex items-center justify-between px-4 shrink-0 z-40 shadow-sm">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="text-muted-foreground hover:text-foreground shrink-0"
          aria-label="Toggle navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <span className="text-xs font-bold text-primary-foreground">EJ</span>
          </div>
          <span className="font-semibold text-sm tracking-tight hidden sm:block">
            EJ Finance
          </span>
        </div>
      </div>

      <div className="flex-1 max-w-sm mx-6 hidden md:flex">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full h-9 pl-9 pr-4 text-sm rounded-lg border border-input bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring focus:bg-background transition-colors placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 p-0 flex items-center justify-center text-[10px] leading-none">
            3
          </Badge>
        </Button>

        <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-transparent hover:ring-primary/30 transition-all">
          <AvatarImage src="" alt="User" />
          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
            EJ
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
