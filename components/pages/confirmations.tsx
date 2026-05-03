"use client";

import { useState } from "react";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { confirmations, trades, type ConfirmationStatus } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function ConfirmationsPage() {
  const [statuses, setStatuses] = useState<Record<string, ConfirmationStatus>>(
    Object.fromEntries(confirmations.map((c) => [c.tradeId, c.status]))
  );

  function markAs(tradeId: string, status: ConfirmationStatus) {
    setStatuses((s) => ({ ...s, [tradeId]: status }));
  }

  const enriched = confirmations.map((c) => ({
    ...c,
    status: statuses[c.tradeId],
    trade: trades.find((t) => t.id === c.tradeId),
  }));

  const counts = {
    Matched: enriched.filter((c) => c.status === "Matched").length,
    Pending: enriched.filter((c) => c.status === "Pending").length,
    Sent: enriched.filter((c) => c.status === "Sent").length,
    Disputed: enriched.filter((c) => c.status === "Disputed").length,
  };

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        {Object.entries(counts).map(([status, count]) => (
          <Card key={status}>
            <CardContent className="pt-4 pb-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{status}</p>
              <p className={cn("text-3xl font-bold tabular-nums mt-1",
                status === "Matched" ? "text-profit" :
                status === "Disputed" ? "text-loss" :
                status === "Pending" ? "text-pending" : "text-primary"
              )}>{count}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-3 px-4 border-b border-border">
          <CardTitle className="text-sm font-semibold">Confirmation Status</CardTitle>
          <Button size="sm" variant="outline" className="h-7 gap-1.5 text-xs">
            <Upload className="h-3.5 w-3.5" />
            Upload Confirmation
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {["Trade ID", "Counterparty", "Product", "Volume", "Price", "Conf. Date", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {enriched.map((c, i) => (
                  <tr key={c.tradeId} className={cn("border-b border-border/40 hover:bg-muted/20 transition-colors", i % 2 !== 0 ? "bg-muted/10" : "")}>
                    <td className="px-4 py-3 text-xs font-mono font-medium text-primary">{c.tradeId}</td>
                    <td className="px-4 py-3 text-xs font-medium">{c.counterparty}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground max-w-32 truncate">{c.trade?.product ?? "—"}</td>
                    <td className={cn("px-4 py-3 text-xs font-mono font-semibold",
                      c.trade?.buySell === "Buy" ? "text-profit" : "text-loss")}>
                      {c.trade ? `${c.trade.buySell === "Buy" ? "+" : "-"}${c.trade.volume.toLocaleString()}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-xs font-mono">{c.trade ? `£${c.trade.price.toFixed(2)}` : "—"}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{c.confirmationDate}</td>
                    <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {c.status !== "Matched" && (
                          <Button
                            size="sm"
                            className="h-6 px-2 text-[10px] gap-1 bg-profit hover:bg-profit/90 text-profit-foreground"
                            onClick={() => markAs(c.tradeId, "Matched")}
                          >
                            <CheckCircle className="h-3 w-3" /> Match
                          </Button>
                        )}
                        {c.status !== "Disputed" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 px-2 text-[10px] gap-1 border-loss text-loss hover:bg-loss hover:text-loss-foreground"
                            onClick={() => markAs(c.tradeId, "Disputed")}
                          >
                            <AlertCircle className="h-3 w-3" /> Dispute
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Reconciliation section */}
      <Card>
        <CardHeader className="py-3 px-4 border-b border-border">
          <CardTitle className="text-sm font-semibold">Match & Reconcile</CardTitle>
        </CardHeader>
        <CardContent className="py-4">
          <div className="space-y-3">
            {enriched.filter((c) => c.status === "Disputed").map((c) => (
              <div key={c.tradeId} className="rounded-lg border border-loss/30 bg-loss-muted p-3 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="h-4 w-4 text-loss" />
                    <span className="text-sm font-semibold text-loss">Discrepancy — {c.tradeId}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {c.counterparty} — confirmation details do not match trade capture. Please contact counterparty to resolve.
                  </p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => markAs(c.tradeId, "Matched")}>Resolve</Button>
                </div>
              </div>
            ))}
            {enriched.filter((c) => c.status === "Disputed").length === 0 && (
              <div className="flex items-center gap-2 text-profit">
                <CheckCircle className="h-4 w-4" />
                <p className="text-sm font-medium">No active discrepancies</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
