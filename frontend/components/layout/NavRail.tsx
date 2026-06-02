"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarCheck,
  LineChart,
  BookOpen,
  UtensilsCrossed,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { label: "Daily Tracker", href: "/daily-tracker", icon: CalendarCheck },
  { label: "Finance", href: "/finance", icon: LineChart },
  { label: "Blog", href: "/blog", icon: BookOpen },
  { label: "Food Menu", href: "/food-menu", icon: UtensilsCrossed },
];

interface NavRailProps {
  isExpanded: boolean;
}

export function NavRail({ isExpanded }: NavRailProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "shrink-0 border-r border-border bg-sidebar flex flex-col py-3 overflow-hidden transition-all duration-300 ease-in-out",
        isExpanded ? "w-56" : "w-16"
      )}
    >
      <nav className="flex flex-col gap-1 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          const itemContent = (
            <Link
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150 group relative",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 shrink-0 transition-colors",
                  isActive
                    ? "text-primary-foreground"
                    : "text-sidebar-foreground/60 group-hover:text-sidebar-accent-foreground"
                )}
              />
              <span
                className={cn(
                  "whitespace-nowrap overflow-hidden transition-all duration-300",
                  isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"
                )}
              >
                {item.label}
              </span>
            </Link>
          );

          if (!isExpanded) {
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger className="w-full block">
                  {itemContent}
                </TooltipTrigger>
                <TooltipContent side="right" className="font-medium">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          }

          return <div key={item.href}>{itemContent}</div>;
        })}
      </nav>

      <div className="mt-auto px-2 pb-1">
        <div
          className={cn(
            "h-px bg-border mx-1 mb-3 transition-opacity duration-300",
            isExpanded ? "opacity-100" : "opacity-0"
          )}
        />
        {isExpanded && (
          <p className="px-3 text-[11px] text-sidebar-foreground/40 font-medium uppercase tracking-widest">
            EJ Finance
          </p>
        )}
      </div>
    </aside>
  );
}
