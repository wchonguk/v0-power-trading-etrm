"use client";

import { useState } from "react";
import { RefreshCw, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { marketPriceCurves, products } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const productNames = Object.keys(marketPriceCurves);

export function MarketDataPage() {
  const [selectedProduct, setSelectedProduct] = useState(productNames[0]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState("2024-05-06 08:00 UTC");

  const priceData = marketPriceCurves[selectedProduct] ?? [];
  const currentPrice = priceData[priceData.length - 1]?.price ?? 0;
  const prevPrice = priceData[priceData.length - 2]?.price ?? 0;
  const priceChange = currentPrice - prevPrice;
  const priceChangePct = prevPrice ? ((priceChange / prevPrice) * 100) : 0;

  function handleRefresh() {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefresh(new Date().toISOString().slice(0, 16).replace("T", " ") + " UTC");
    }, 1200);
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <Card>
        <CardContent className="py-3">
          <div className="flex flex-wrap items-center gap-2">
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger className="h-8 w-56 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {productNames.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs">
              <Upload className="h-3.5 w-3.5" />
              Upload Price Data
            </Button>
            <div className="ml-auto flex items-center gap-2">
              <p className="text-xs text-muted-foreground">Last updated: {lastRefresh}</p>
              <Button
                size="sm"
                variant="outline"
                className="h-8 gap-1.5 text-xs"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin")} />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Current Price</p>
            <p className="text-2xl font-bold font-mono mt-1">£{currentPrice.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">per MWh</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Price Change (MoM)</p>
            <p className={cn("text-2xl font-bold font-mono mt-1", priceChange >= 0 ? "text-profit" : "text-loss")}>
              {priceChange >= 0 ? "+" : ""}£{priceChange.toFixed(2)}
            </p>
            <p className={cn("text-xs", priceChange >= 0 ? "text-profit" : "text-loss")}>
              {priceChangePct >= 0 ? "+" : ""}{priceChangePct.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">12M Range</p>
            <p className="text-2xl font-bold font-mono mt-1">
              £{Math.min(...priceData.map((d) => d.price)).toFixed(2)} — £{Math.max(...priceData.map((d) => d.price)).toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground">low — high</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">{selectedProduct} — Forward Price Curve (£/MWh)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={priceData} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                tickLine={false}
                axisLine={false}
                domain={["auto", "auto"]}
                tickFormatter={(v) => `£${v}`}
              />
              <Tooltip
                contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "6px", fontSize: "12px" }}
                formatter={(v: number) => [`£${v.toFixed(2)}/MWh`, "Price"]}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="var(--color-chart-1)"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "var(--color-chart-1)" }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Price Table */}
      <Card>
        <CardHeader className="py-3 px-4 border-b border-border">
          <CardTitle className="text-sm font-semibold">Monthly Price Data</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {["Month", "Price (£/MWh)", "Change", "% Change"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {priceData.map((row, i) => {
                  const prev = priceData[i - 1];
                  const change = prev ? row.price - prev.price : null;
                  const pct = prev ? ((row.price - prev.price) / prev.price) * 100 : null;
                  return (
                    <tr key={row.date} className={cn("border-b border-border/40 hover:bg-muted/20 transition-colors", i % 2 !== 0 ? "bg-muted/10" : "")}>
                      <td className="px-4 py-2.5 text-sm font-medium">{row.date}</td>
                      <td className="px-4 py-2.5 text-sm font-mono font-semibold">£{row.price.toFixed(2)}</td>
                      <td className={cn("px-4 py-2.5 text-sm font-mono", change === null ? "" : change >= 0 ? "text-profit" : "text-loss")}>
                        {change !== null ? `${change >= 0 ? "+" : ""}£${change.toFixed(2)}` : "—"}
                      </td>
                      <td className={cn("px-4 py-2.5 text-sm font-mono", pct === null ? "" : pct >= 0 ? "text-profit" : "text-loss")}>
                        {pct !== null ? `${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%` : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
