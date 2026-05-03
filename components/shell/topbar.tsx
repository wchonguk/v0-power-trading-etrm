"use client";

import { usePathname } from "next/navigation";
import { Bell, ChevronDown, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/blotter": "Trade Blotter",
  "/positions": "Positions",
  "/validation": "Validation & Approvals",
  "/confirmations": "Confirmations",
  "/settlement": "Settlement",
  "/market-data": "Market Data",
  "/master-data": "Master Data",
  "/insights": "Insights",
};

export function Topbar() {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "Power Trading ETRM";

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-6">
      <h1 className="text-base font-semibold text-foreground">{title}</h1>
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative h-8 w-8">
          <Bell className="h-4 w-4" />
          <Badge className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full p-0 text-[9px] bg-loss text-loss-foreground border-0">
            4
          </Badge>
          <span className="sr-only">Notifications</span>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 gap-2 px-2 text-sm">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                JS
              </div>
              <span className="hidden md:inline text-sm font-medium">J. Smith</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>
              <div>
                <p className="font-medium">James Smith</p>
                <p className="text-xs font-normal text-muted-foreground">Trader</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
