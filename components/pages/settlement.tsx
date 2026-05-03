"use client";

import { useState, useMemo } from "react";
import { Download, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { settlements, counterparties } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function SettlementPage() {
  const [cpFilter, setCpFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const filtered = useMemo(() => {
    return settlements.filter((s) => {
      if (cpFilter !== "all" && s.counterparty !== cpFilter) return false;
      if (fromDate && s.settlementDate < fromDate) return false;
      if (toDate && s.settlementDate > toDate) return false;
      return true;
    });
  }, [cpFilter, fromDate, toDate]);

  const totalValue = filtered.reduce((sum, s) => sum + s.value, 0);
  const pendingCount = filtered.filter((s) => s.status === "Pending").length;
  const processedValue = filtered.filter((s) => s.status === "Processed").reduce((sum, s) => sum + s.value, 0);

  function handleExport() {
    const header = "Trade ID,Counterparty,Settlement Date,Value,Currency,Status";
    const rows = filtered.map((s) =>
      `${s.tradeId},${s.counterparty},${s.settlementDate},${s.value},${s.currency},${s.status}`
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "settlements.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Settlement Value", value: `£${totalValue.toLocaleString()}`, sub: `${filtered.length} settlements` },
          { label: "Pending Settlements", value: pendingCount, sub: "awaiting processing" },
          { label: "Processed Value", value: `£${processedValue.toLocaleString()}`, sub: "settled" },
        ].map((c) => (
          <Card key={c.label}>
            <CardContent className="pt-4 pb-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{c.label}</p>
              <p className="text-2xl font-bold tabular-nums mt-1">{c.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{c.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-3">
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <Select value={cpFilter} onValueChange={setCpFilter}>
              <SelectTrigger className="h-8 w-44 text-sm">
                <SelectValue placeholder="All Counterparties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Counterparties</SelectItem>
                {counterparties.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="h-8 w-36 text-sm" placeholder="From date" />
            <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="h-8 w-36 text-sm" placeholder="To date" />
            <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => { setCpFilter("all"); setFromDate(""); setToDate(""); }}>
              Clear
            </Button>
            <div className="ml-auto">
              <Button size="sm" className="h-8 gap-1.5 text-xs" onClick={handleExport}>
                <Download className="h-3.5 w-3.5" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader className="py-3 px-4 border-b border-border">
          <p className="text-xs text-muted-foreground">{filtered.length} records</p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {["Trade ID", "Counterparty", "Settlement Date", "Value", "Currency", "Status"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => (
                  <tr key={s.tradeId} className={cn("border-b border-border/40 hover:bg-muted/20 transition-colors", i % 2 !== 0 ? "bg-muted/10" : "")}>
                    <td className="px-4 py-3 text-xs font-mono font-medium text-primary">{s.tradeId}</td>
                    <td className="px-4 py-3 text-xs font-medium">{s.counterparty}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{s.settlementDate}</td>
                    <td className="px-4 py-3 text-sm font-mono font-semibold">{s.currency} {s.value.toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{s.currency}</td>
                    <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-16 text-center text-sm text-muted-foreground">No settlement records match your filters</td>
                  </tr>
                )}
              </tbody>
              {filtered.length > 0 && (
                <tfoot>
                  <tr className="border-t-2 border-border bg-muted/30 font-bold">
                    <td colSpan={3} className="px-4 py-2.5 text-xs font-semibold text-muted-foreground">TOTAL</td>
                    <td className="px-4 py-2.5 text-sm font-mono font-bold">
                      £{totalValue.toLocaleString()}
                    </td>
                    <td colSpan={2} />
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
