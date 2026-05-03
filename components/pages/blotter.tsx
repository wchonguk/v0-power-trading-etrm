"use client";

import { useState, useMemo } from "react";
import { Plus, Search, ChevronUp, ChevronDown, ChevronsUpDown, Trash2, Pencil, Eye } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { TradeCapture } from "@/components/modals/trade-capture";
import { trades as initialTrades, counterparties, products, type Trade } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type SortDir = "asc" | "desc";
type SortKey = keyof Trade;

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ChevronsUpDown className="h-3 w-3 text-muted-foreground/40" />;
  return dir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />;
}

export function BlotterPage() {
  const [captureOpen, setCaptureOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [cpFilter, setCpFilter] = useState("all");
  const [productFilter, setProductFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("tradeDate");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const filtered = useMemo(() => {
    let result = [...initialTrades];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.id.toLowerCase().includes(q) ||
          t.counterparty.toLowerCase().includes(q) ||
          t.product.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") result = result.filter((t) => t.status === statusFilter);
    if (cpFilter !== "all") result = result.filter((t) => t.counterparty === cpFilter);
    if (productFilter !== "all") result = result.filter((t) => t.product === productFilter);
    result.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
    return result;
  }, [search, statusFilter, cpFilter, productFilter, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  }

  const columns: { key: SortKey; label: string }[] = [
    { key: "id", label: "Trade ID" },
    { key: "tradeDate", label: "Trade Date" },
    { key: "counterparty", label: "Counterparty" },
    { key: "product", label: "Product" },
    { key: "deliveryStart", label: "Delivery Period" },
    { key: "volume", label: "Volume (MWh)" },
    { key: "price", label: "Price (£)" },
    { key: "buySell", label: "B/S" },
    { key: "book", label: "Book" },
    { key: "status", label: "Status" },
  ];

  const statuses = ["Pending Validation", "Approved", "Confirmed", "Settled", "Rejected"];

  return (
    <div className="space-y-4">
      {/* Filters Row */}
      <Card>
        <CardContent className="py-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative min-w-48 flex-1">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search trade ID, counterparty..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-8 text-sm"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 w-44 text-sm">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>

            {/* Counterparty Filter */}
            <Select value={cpFilter} onValueChange={setCpFilter}>
              <SelectTrigger className="h-8 w-44 text-sm">
                <SelectValue placeholder="All Counterparties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Counterparties</SelectItem>
                {counterparties.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>

            {/* Product Filter */}
            <Select value={productFilter} onValueChange={setProductFilter}>
              <SelectTrigger className="h-8 w-44 text-sm">
                <SelectValue placeholder="All Products" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                {products.map((p) => <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>

            <div className="ml-auto">
              <Button size="sm" className="h-8 gap-1.5 text-xs" onClick={() => setCaptureOpen(true)}>
                <Plus className="h-3.5 w-3.5" />
                Capture Trade
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader className="py-3 px-4 border-b border-border flex flex-row items-center justify-between">
          <p className="text-xs text-muted-foreground">{filtered.length} trades</p>
        </CardHeader>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <p className="text-sm font-medium">No trades found</p>
              <p className="text-xs mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    {columns.map(({ key, label }) => (
                      <th
                        key={key}
                        className="whitespace-nowrap px-4 py-2.5 text-left text-xs font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors"
                        onClick={() => handleSort(key)}
                      >
                        <div className="flex items-center gap-1">
                          {label}
                          <SortIcon active={sortKey === key} dir={sortDir} />
                        </div>
                      </th>
                    ))}
                    <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t, i) => (
                    <tr
                      key={t.id}
                      className={cn(
                        "border-b border-border/40 hover:bg-muted/30 transition-colors",
                        i % 2 !== 0 ? "bg-muted/10" : ""
                      )}
                    >
                      <td className="px-4 py-2.5 text-xs font-mono font-medium text-primary">{t.id}</td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground">{t.tradeDate}</td>
                      <td className="px-4 py-2.5 text-xs font-medium">{t.counterparty}</td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground max-w-36 truncate">{t.product}</td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                        {t.deliveryStart} — {t.deliveryEnd}
                      </td>
                      <td className={cn("px-4 py-2.5 text-xs font-mono font-semibold", t.buySell === "Buy" ? "text-profit" : "text-loss")}>
                        {t.buySell === "Buy" ? "+" : "-"}{t.volume.toLocaleString()}
                      </td>
                      <td className="px-4 py-2.5 text-xs font-mono">{t.price.toFixed(2)}</td>
                      <td className="px-4 py-2.5">
                        <span className={cn("text-xs font-semibold", t.buySell === "Buy" ? "text-profit" : "text-loss")}>
                          {t.buySell}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground">{t.book}</td>
                      <td className="px-4 py-2.5"><StatusBadge status={t.status} /></td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive">
                            <Trash2 className="h-3.5 w-3.5" />
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

      <TradeCapture open={captureOpen} onOpenChange={setCaptureOpen} />
    </div>
  );
}
