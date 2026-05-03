"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  positionsByBook, positionsByProduct, positionsByDelivery, positionOverTime,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

function PositionTable({ data, nameKey }: { data: { netPosition: number; marketValue: number; [key: string]: unknown }[]; nameKey: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground capitalize">{nameKey.replace(/([A-Z])/g, " $1")}</th>
            <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">Net Position (MWh)</th>
            <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">Market Value (£)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className={cn("border-b border-border/40 hover:bg-muted/20 transition-colors", i % 2 !== 0 ? "bg-muted/10" : "")}>
              <td className="px-4 py-3 text-sm font-medium">{String(row[nameKey])}</td>
              <td className={cn("px-4 py-3 text-sm font-mono font-semibold text-right", row.netPosition >= 0 ? "text-profit" : "text-loss")}>
                {row.netPosition >= 0 ? "+" : ""}{row.netPosition.toLocaleString()}
              </td>
              <td className={cn("px-4 py-3 text-sm font-mono text-right", row.marketValue >= 0 ? "text-profit" : "text-loss")}>
                £{row.marketValue.toLocaleString()}
              </td>
            </tr>
          ))}
          {/* Totals */}
          <tr className="border-t-2 border-border bg-muted/30 font-bold">
            <td className="px-4 py-2.5 text-xs font-semibold text-muted-foreground">TOTAL</td>
            <td className={cn("px-4 py-2.5 text-sm font-mono font-bold text-right",
              data.reduce((s, r) => s + r.netPosition, 0) >= 0 ? "text-profit" : "text-loss")}>
              {data.reduce((s, r) => s + r.netPosition, 0) >= 0 ? "+" : ""}
              {data.reduce((s, r) => s + r.netPosition, 0).toLocaleString()}
            </td>
            <td className="px-4 py-2.5 text-sm font-mono font-bold text-right">
              £{data.reduce((s, r) => s + r.marketValue, 0).toLocaleString()}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function PositionsPage() {
  const positionBarData = positionsByProduct.map((p) => ({
    name: p.product.replace(" Power", "").replace(" Load", "").replace(" Load Power", ""),
    position: p.netPosition,
  }));

  return (
    <div className="space-y-4">
      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Position Over Time (MWh)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={positionOverTime} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
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

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Net Position by Product (MWh)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={positionBarData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "6px", fontSize: "12px" }}
                  formatter={(v: number) => [`${v.toLocaleString()} MWh`, "Net Position"]}
                />
                <Bar
                  dataKey="position"
                  radius={[3, 3, 0, 0]}
                  fill="var(--color-chart-1)"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tables */}
      <Card>
        <Tabs defaultValue="book">
          <div className="border-b border-border px-4">
            <TabsList className="h-10 bg-transparent gap-0 p-0">
              {["book", "product", "delivery"].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="h-10 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-sm capitalize"
                >
                  By {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <TabsContent value="book" className="m-0">
            <PositionTable data={positionsByBook} nameKey="book" />
          </TabsContent>
          <TabsContent value="product" className="m-0">
            <PositionTable data={positionsByProduct} nameKey="product" />
          </TabsContent>
          <TabsContent value="delivery" className="m-0">
            <PositionTable data={positionsByDelivery} nameKey="delivery" />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
