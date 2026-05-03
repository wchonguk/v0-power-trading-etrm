"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ScrollText,
  BarChart3,
  CheckSquare,
  FileCheck,
  Banknote,
  TrendingUp,
  Database,
  Lightbulb,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/blotter", label: "Trade Blotter", icon: ScrollText },
  { href: "/positions", label: "Positions", icon: BarChart3 },
  { href: "/validation", label: "Validation & Approvals", icon: CheckSquare },
  { href: "/confirmations", label: "Confirmations", icon: FileCheck },
  { href: "/settlement", label: "Settlement", icon: Banknote },
  { href: "/market-data", label: "Market Data", icon: TrendingUp },
  { href: "/master-data", label: "Master Data", icon: Database },
  { href: "/insights", label: "Insights", icon: Lightbulb },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-60 flex-col bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 border-b border-sidebar-border px-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-sidebar-primary">
          <Zap className="h-4 w-4 text-sidebar-primary-foreground" />
        </div>
        <div>
          <p className="text-sm font-semibold text-sidebar-foreground leading-none">Power Trading</p>
          <p className="text-[10px] text-sidebar-foreground/50 leading-none mt-0.5">ETRM Platform</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">
          Navigation
        </p>
        <ul className="space-y-0.5">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-foreground font-medium"
                      : "text-sidebar-foreground/60 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                  )}
                >
                  <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-sidebar-primary" : "text-sidebar-foreground/40")} />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border px-4 py-3">
        <p className="text-[10px] text-sidebar-foreground/30">v1.0.0 &bull; Demo Mode</p>
      </div>
    </aside>
  );
}
