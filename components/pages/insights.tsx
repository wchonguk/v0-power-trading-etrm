"use client";

import { useState } from "react";
import { Sparkles, AlertTriangle, TrendingUp, BarChart2, RefreshCw, Clock } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { insights, type Insight } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const categoryConfig: Record<Insight["category"], { icon: React.ElementType; className: string; label: string }> = {
  Risk: {
    icon: AlertTriangle,
    className: "bg-loss-muted text-loss border-loss/20",
    label: "Risk",
  },
  Opportunity: {
    icon: TrendingUp,
    className: "bg-profit-muted text-profit border-profit/20",
    label: "Opportunity",
  },
  Market: {
    icon: BarChart2,
    className: "bg-primary/10 text-primary border-primary/20",
    label: "Market",
  },
};

export function InsightsPage() {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isGenerating, setIsGenerating] = useState(false);
  const [shownInsights, setShownInsights] = useState(insights);

  const filtered = categoryFilter === "all"
    ? shownInsights
    : shownInsights.filter((i) => i.category === categoryFilter);

  function handleGenerate() {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShownInsights([
        {
          id: `INS-NEW-${Date.now()}`,
          title: "Intraday Volatility Spike Detected",
          description: "UK Base Load Power intraday volatility has increased 22% over the last 6 hours. Consider reviewing open positions for Q3 delivery — elevated risk of mark-to-market P&L swings.",
          timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
          category: "Risk",
        },
        ...shownInsights,
      ]);
    }, 2000);
  }

  const counts = {
    Risk: shownInsights.filter((i) => i.category === "Risk").length,
    Opportunity: shownInsights.filter((i) => i.category === "Opportunity").length,
    Market: shownInsights.filter((i) => i.category === "Market").length,
  };

  return (
    <div className="space-y-4">
      {/* Header Row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-8 w-36 text-sm">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Risk">Risk</SelectItem>
              <SelectItem value="Opportunity">Opportunity</SelectItem>
              <SelectItem value="Market">Market</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            {Object.entries(counts).map(([cat, count]) => {
              const cfg = categoryConfig[cat as Insight["category"]];
              return (
                <span
                  key={cat}
                  className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium cursor-pointer", cfg.className,
                    categoryFilter === cat ? "ring-2 ring-offset-1 ring-current" : ""
                  )}
                  onClick={() => setCategoryFilter(categoryFilter === cat ? "all" : cat)}
                >
                  <cfg.icon className="h-3 w-3" />
                  {cat} ({count})
                </span>
              );
            })}
          </div>
        </div>
        <Button
          className="gap-2 h-8 text-sm"
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Sparkles className="h-3.5 w-3.5" />
          )}
          {isGenerating ? "Generating..." : "Generate Insights"}
        </Button>
      </div>

      {/* Insight Cards */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Sparkles className="h-10 w-10 mb-3 opacity-30" />
            <p className="text-sm font-medium">No insights in this category</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((insight) => {
            const cfg = categoryConfig[insight.category];
            const Icon = cfg.icon;
            return (
              <Card key={insight.id} className="flex flex-col">
                <CardHeader className="pb-2 pt-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <div className={cn("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border", cfg.className)}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-balance">{insight.title}</p>
                        <span className={cn("inline-flex items-center rounded-full border px-1.5 py-0 text-[10px] font-medium mt-0.5", cfg.className)}>
                          {insight.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 pb-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">{insight.description}</p>
                  <div className="flex items-center gap-1 mt-3 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span className="text-[10px] font-mono">{insight.timestamp}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
