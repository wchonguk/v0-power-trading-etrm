"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, Activity, Clock, ArrowRight, Upload, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { StatusBadge } from "@/components/ui/status-badge";
import { TradeCapture } from "@/components/modals/trade-capture";
import {
  trades, pnlOverTime, positionOverTime, exposureByCounterparty,
  totalPosition, dailyPnl, openExposure, pendingValidationCount,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

function fmt(n: number, prefix = "") {
  return `${prefix}${n.toLocaleString("en-GB")}`;
}

const recentTrades = [...trades].slice(0, 10);

export function DashboardPage() {
  const [captureOpen, setCaptureOpen] = useState(false);

  const summaryCards = [
    {
      title: "Total Position",
      value: fmt(totalPosition),
      unit: "MWh",
      icon: Activity,
      trend: "+12.4%",
      positive: true,
    },
    {
      title: "Daily P&L",
      value: fmt(dailyPnl, "£"),
      unit: "",
      icon: dailyPnl >= 0 ? TrendingUp : TrendingDown,
      trend: "+8.2%",
      positive: dailyPnl >= 0,
    },
    {
      title: "Open Exposure",
      value: fmt(openExposure, "£"),
      unit: "",
      icon: Activity,
      trend: "+5.1%",
      positive: true,
    },
    {
      title: "Pending Validation",
      value: String(pendingValidationCount),
      unit: "trades",
      icon: Clock,
      trend: "",
      positive: pendingValidationCount === 0,
      warning: pendingValidationCount > 0,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <Card key={card.title}>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{card.title}</p>
                  <p className="mt-1.5 text-2xl font-bold text-foreground tabular-nums">{card.value}</p>
                  {card.unit && <p className="text-xs text-muted-foreground mt-0.5">{card.unit}</p>}
                </div>
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg",
                    card.warning ? "bg-pending-muted" : card.positive ? "bg-profit-muted" : "bg-loss-muted"
                  )}
                >
                  <card.icon
                    className={cn(
                      "h-4 w-4",
                      card.warning ? "text-pending" : card.positive ? "text-profit" : "text-loss"
                    )}
                  />
                </div>
              </div>
              {card.trend && (
                <p className={cn("mt-2 text-xs font-medium", card.positive ? "text-profit" : "text-loss")}>
                  {card.trend} vs last week
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Position Over Time */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Position Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={positionOverTime} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "6px", fontSize: "12px" }}
                  formatter={(v: number) => [`${v.toLocaleString()} MWh`, "Position"]}
                />
                <Line type="monotone" dataKey="position" stroke="var(--color-chart-1)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* P&L Over Time */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">P&L Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={pnlOverTime} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`} />
                <ReferenceLine y={0} stroke="var(--muted-foreground)" strokeDasharray="3 3" />
                <Tooltip
                  contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "6px", fontSize: "12px" }}
                  formatter={(v: number) => [`£${v.toLocaleString()}`, "P&L"]}
                />
                <Line
                  type="monotone"
                  dataKey="pnl"
                  stroke="var(--color-chart-2)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Exposure by Counterparty */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Exposure by Counterparty</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={exposureByCounterparty} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="counterparty" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} tickFormatter={(v) => `£${(v / 1000000).toFixed(1)}M`} />
                <Tooltip
                  contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "6px", fontSize: "12px" }}
                  formatter={(v: number) => [`£${v.toLocaleString()}`, "Exposure"]}
                />
                <Bar dataKey="exposure" fill="var(--color-chart-1)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Trades + Quick Actions */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {/* Recent Trades */}
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-semibold">Recent Trades</CardTitle>
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" asChild>
              <a href="/blotter">
                View all <ArrowRight className="h-3 w-3" />
              </a>
            </Button>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    {["Trade ID", "Date", "Counterparty", "Product", "Vol (MWh)", "Price (£)", "Status"].map((h) => (
                      <th key={h} className="whitespace-nowrap px-4 py-2 text-left text-xs font-medium text-muted-foreground">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentTrades.map((t, i) => (
                    <tr key={t.id} className={cn("border-b border-border/50 hover:bg-muted/30 transition-colors", i % 2 === 0 ? "" : "bg-muted/10")}>
                      <td className="px-4 py-2 text-xs font-mono font-medium text-primary">{t.id}</td>
                      <td className="px-4 py-2 text-xs text-muted-foreground">{t.tradeDate}</td>
                      <td className="px-4 py-2 text-xs font-medium">{t.counterparty}</td>
                      <td className="px-4 py-2 text-xs text-muted-foreground">{t.product}</td>
                      <td className="px-4 py-2 text-xs font-mono">
                        <span className={t.buySell === "Buy" ? "text-profit" : "text-loss"}>
                          {t.buySell === "Buy" ? "+" : "-"}{t.volume.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-xs font-mono">{t.price.toFixed(2)}</td>
                      <td className="px-4 py-2">
                        <StatusBadge status={t.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start gap-2 text-sm h-9" onClick={() => setCaptureOpen(true)}>
              <Plus className="h-4 w-4" />
              Capture Trade
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 text-sm h-9">
              <Upload className="h-4 w-4" />
              Upload Broker File
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 text-sm h-9" asChild>
              <a href="/positions">
                <Activity className="h-4 w-4" />
                View Positions
              </a>
            </Button>
            <div className="pt-3 border-t border-border">
              <p className="text-xs font-medium text-muted-foreground mb-2">Pending Actions</p>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between rounded-md bg-pending-muted px-2.5 py-1.5">
                  <span className="text-xs text-pending font-medium">Pending Validation</span>
                  <span className="text-xs font-bold text-pending">{pendingValidationCount}</span>
                </div>
                <div className="flex items-center justify-between rounded-md bg-muted px-2.5 py-1.5">
                  <span className="text-xs text-muted-foreground font-medium">Pending Confirm.</span>
                  <span className="text-xs font-bold text-muted-foreground">2</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <TradeCapture open={captureOpen} onOpenChange={setCaptureOpen} />
    </div>
  );
}
