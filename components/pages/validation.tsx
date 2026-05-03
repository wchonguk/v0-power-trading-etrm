"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Pencil, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { trades, auditTrail, type Trade } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const pendingTrades = trades.filter((t) => t.status === "Pending Validation");

export function ValidationPage() {
  const [selected, setSelected] = useState<Trade | null>(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [queue, setQueue] = useState(pendingTrades);
  const [approved, setApproved] = useState<Set<string>>(new Set());
  const [rejected, setRejected] = useState<Set<string>>(new Set());

  function handleApprove(id: string) {
    setApproved((s) => new Set([...s, id]));
    setQueue((q) => q.filter((t) => t.id !== id));
    if (selected?.id === id) setSelected(null);
  }

  function handleReject() {
    if (!selected) return;
    setRejected((s) => new Set([...s, selected.id]));
    setQueue((q) => q.filter((t) => t.id !== selected.id));
    setSelected(null);
    setRejectOpen(false);
    setRejectReason("");
  }

  const auditForSelected = selected ? auditTrail.filter((a) => a.tradeId === selected.id) : [];

  return (
    <div className="space-y-4">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Pending Validation", value: queue.length, color: "text-pending" },
          { label: "Approved Today", value: approved.size, color: "text-profit" },
          { label: "Rejected Today", value: rejected.size, color: "text-loss" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-4 pb-3">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{s.label}</p>
              <p className={cn("text-3xl font-bold mt-1 tabular-nums", s.color)}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Queue Table */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="py-3 px-4 border-b border-border">
              <CardTitle className="text-sm font-semibold">Validation Queue</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {queue.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <CheckCircle className="h-10 w-10 text-profit mb-3" />
                  <p className="text-sm font-medium text-profit">All trades validated</p>
                  <p className="text-xs mt-1">No pending trades in the queue</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        {["Trade ID", "Date", "Counterparty", "Product", "Vol", "Price", "By", "Actions"].map((h) => (
                          <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {queue.map((t, i) => (
                        <tr
                          key={t.id}
                          className={cn(
                            "border-b border-border/40 cursor-pointer transition-colors",
                            selected?.id === t.id ? "bg-accent" : i % 2 !== 0 ? "bg-muted/10 hover:bg-muted/30" : "hover:bg-muted/20"
                          )}
                          onClick={() => setSelected(selected?.id === t.id ? null : t)}
                        >
                          <td className="px-4 py-2.5 text-xs font-mono font-medium text-primary">{t.id}</td>
                          <td className="px-4 py-2.5 text-xs text-muted-foreground">{t.tradeDate}</td>
                          <td className="px-4 py-2.5 text-xs font-medium">{t.counterparty}</td>
                          <td className="px-4 py-2.5 text-xs text-muted-foreground max-w-28 truncate">{t.product}</td>
                          <td className={cn("px-4 py-2.5 text-xs font-mono font-semibold", t.buySell === "Buy" ? "text-profit" : "text-loss")}>
                            {t.buySell === "Buy" ? "+" : "-"}{t.volume.toLocaleString()}
                          </td>
                          <td className="px-4 py-2.5 text-xs font-mono">{t.price.toFixed(2)}</td>
                          <td className="px-4 py-2.5 text-xs text-muted-foreground">{t.submittedBy}</td>
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                className="h-6 px-2 text-[10px] gap-1 bg-profit hover:bg-profit/90 text-profit-foreground"
                                onClick={(e) => { e.stopPropagation(); handleApprove(t.id); }}
                              >
                                <CheckCircle className="h-3 w-3" /> Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 px-2 text-[10px] gap-1 border-loss text-loss hover:bg-loss hover:text-loss-foreground"
                                onClick={(e) => { e.stopPropagation(); setSelected(t); setRejectOpen(true); }}
                              >
                                <XCircle className="h-3 w-3" /> Reject
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6"
                                onClick={(e) => { e.stopPropagation(); setSelected(t); }}
                              >
                                <ChevronRight className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Detail Panel */}
        <div className="space-y-4">
          {selected ? (
            <>
              <Card>
                <CardHeader className="py-3 px-4 border-b border-border">
                  <CardTitle className="text-sm font-semibold">Trade Detail</CardTitle>
                </CardHeader>
                <CardContent className="py-4 space-y-2">
                  {[
                    ["Trade ID", selected.id],
                    ["Trade Date", selected.tradeDate],
                    ["Counterparty", selected.counterparty],
                    ["Product", selected.product],
                    ["Book", selected.book],
                    ["Direction", selected.buySell],
                    ["Volume", `${selected.volume.toLocaleString()} MWh`],
                    ["Price", `£${selected.price.toFixed(2)}/MWh`],
                    ["Delivery", `${selected.deliveryStart} — ${selected.deliveryEnd}`],
                    ["Submitted By", selected.submittedBy],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-2">
                      <span className="text-xs text-muted-foreground shrink-0">{k}</span>
                      <span className={cn(
                        "text-xs font-medium text-right",
                        k === "Direction" ? (v === "Buy" ? "text-profit font-semibold" : "text-loss font-semibold") : ""
                      )}>{v}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Audit Trail */}
              {auditForSelected.length > 0 && (
                <Card>
                  <CardHeader className="py-3 px-4 border-b border-border">
                    <CardTitle className="text-sm font-semibold">Audit Trail</CardTitle>
                  </CardHeader>
                  <CardContent className="py-3 space-y-3">
                    {auditForSelected.map((a, i) => (
                      <div key={i} className="text-xs space-y-0.5">
                        <p className="font-medium">{a.action}</p>
                        <p className="text-muted-foreground">{a.user}</p>
                        <p className="text-muted-foreground font-mono">{a.timestamp}</p>
                        {a.comments && <p className="text-muted-foreground italic">&ldquo;{a.comments}&rdquo;</p>}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 gap-1 bg-profit hover:bg-profit/90 text-profit-foreground"
                  onClick={() => handleApprove(selected.id)}
                >
                  <CheckCircle className="h-3.5 w-3.5" /> Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 gap-1 border-loss text-loss hover:bg-loss hover:text-loss-foreground"
                  onClick={() => setRejectOpen(true)}
                >
                  <XCircle className="h-3.5 w-3.5" /> Reject
                </Button>
                <Button size="sm" variant="outline" className="gap-1">
                  <Pencil className="h-3.5 w-3.5" /> Amend
                </Button>
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <p className="text-sm">Select a trade to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Reject Trade</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-sm text-muted-foreground">
              You are rejecting trade <span className="font-mono font-medium text-foreground">{selected?.id}</span>.
            </p>
            <div>
              <Label className="text-xs font-medium mb-1.5 block">Reason for Rejection</Label>
              <Textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Provide a reason..."
                className="resize-none text-sm"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectReason.trim()}
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
