"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { counterparties, products, books } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface TradeCaptureProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TradeCapture({ open, onOpenChange }: TradeCaptureProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    counterparty: "",
    product: "",
    volume: "",
    price: "",
    tradeDate: "",
    deliveryStart: "",
    deliveryEnd: "",
    buySell: "Buy",
    book: "",
  });

  function setField(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.counterparty) errs.counterparty = "Required";
    if (!form.product) errs.product = "Required";
    if (!form.book) errs.book = "Required";
    if (!form.tradeDate) errs.tradeDate = "Required";
    if (!form.deliveryStart) errs.deliveryStart = "Required";
    if (!form.deliveryEnd) errs.deliveryEnd = "Required";
    if (!form.volume || Number(form.volume) <= 0) errs.volume = "Must be positive";
    if (!form.price || Number(form.price) <= 0) errs.price = "Must be positive";
    if (form.deliveryStart && form.deliveryEnd && form.deliveryEnd <= form.deliveryStart)
      errs.deliveryEnd = "Must be after delivery start";
    return errs;
  }

  function handleSave() {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    alert(`Trade captured!\n\n${JSON.stringify(form, null, 2)}`);
    onOpenChange(false);
  }

  const activeCounterparties = counterparties.filter((c) => c.status === "Active");
  const activeProducts = products.filter((p) => p.status === "Active");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Capture Trade</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-2">
          {/* Buy/Sell */}
          <div className="col-span-2">
            <Label className="text-xs font-medium mb-2 block">Direction</Label>
            <RadioGroup
              value={form.buySell}
              onValueChange={(v) => setField("buySell", v)}
              className="flex gap-4"
            >
              {["Buy", "Sell"].map((v) => (
                <div key={v} className="flex items-center gap-2">
                  <RadioGroupItem value={v} id={`bs-${v}`} />
                  <Label
                    htmlFor={`bs-${v}`}
                    className={cn(
                      "text-sm cursor-pointer font-semibold",
                      form.buySell === v
                        ? v === "Buy" ? "text-profit" : "text-loss"
                        : "text-muted-foreground"
                    )}
                  >
                    {v}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Counterparty */}
          <div className="col-span-2">
            <Label htmlFor="counterparty" className="text-xs font-medium mb-1.5 block">
              Counterparty <span className="text-loss">*</span>
            </Label>
            <Select value={form.counterparty} onValueChange={(v) => setField("counterparty", v)}>
              <SelectTrigger id="counterparty" className={cn(errors.counterparty && "border-loss")}>
                <SelectValue placeholder="Select counterparty..." />
              </SelectTrigger>
              <SelectContent>
                {activeCounterparties.map((c) => (
                  <SelectItem key={c.id} value={c.name}>{c.name} ({c.shortCode})</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.counterparty && <p className="text-[11px] text-loss mt-1">{errors.counterparty}</p>}
          </div>

          {/* Product */}
          <div>
            <Label htmlFor="product" className="text-xs font-medium mb-1.5 block">
              Product <span className="text-loss">*</span>
            </Label>
            <Select value={form.product} onValueChange={(v) => setField("product", v)}>
              <SelectTrigger id="product" className={cn(errors.product && "border-loss")}>
                <SelectValue placeholder="Select product..." />
              </SelectTrigger>
              <SelectContent>
                {activeProducts.map((p) => (
                  <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.product && <p className="text-[11px] text-loss mt-1">{errors.product}</p>}
          </div>

          {/* Book */}
          <div>
            <Label htmlFor="book" className="text-xs font-medium mb-1.5 block">
              Book <span className="text-loss">*</span>
            </Label>
            <Select value={form.book} onValueChange={(v) => setField("book", v)}>
              <SelectTrigger id="book" className={cn(errors.book && "border-loss")}>
                <SelectValue placeholder="Select book..." />
              </SelectTrigger>
              <SelectContent>
                {books.map((b) => (
                  <SelectItem key={b.id} value={b.name}>{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.book && <p className="text-[11px] text-loss mt-1">{errors.book}</p>}
          </div>

          {/* Volume */}
          <div>
            <Label htmlFor="volume" className="text-xs font-medium mb-1.5 block">
              Volume (MWh) <span className="text-loss">*</span>
            </Label>
            <Input
              id="volume"
              type="number"
              min="1"
              placeholder="e.g. 10000"
              value={form.volume}
              onChange={(e) => setField("volume", e.target.value)}
              className={cn("font-mono", errors.volume && "border-loss")}
            />
            {errors.volume && <p className="text-[11px] text-loss mt-1">{errors.volume}</p>}
          </div>

          {/* Price */}
          <div>
            <Label htmlFor="price" className="text-xs font-medium mb-1.5 block">
              Price (£/MWh) <span className="text-loss">*</span>
            </Label>
            <Input
              id="price"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="e.g. 72.50"
              value={form.price}
              onChange={(e) => setField("price", e.target.value)}
              className={cn("font-mono", errors.price && "border-loss")}
            />
            {errors.price && <p className="text-[11px] text-loss mt-1">{errors.price}</p>}
          </div>

          {/* Trade Date */}
          <div>
            <Label htmlFor="tradeDate" className="text-xs font-medium mb-1.5 block">
              Trade Date <span className="text-loss">*</span>
            </Label>
            <Input
              id="tradeDate"
              type="date"
              value={form.tradeDate}
              onChange={(e) => setField("tradeDate", e.target.value)}
              className={cn(errors.tradeDate && "border-loss")}
            />
            {errors.tradeDate && <p className="text-[11px] text-loss mt-1">{errors.tradeDate}</p>}
          </div>

          {/* Delivery Start */}
          <div>
            <Label htmlFor="deliveryStart" className="text-xs font-medium mb-1.5 block">
              Delivery Start <span className="text-loss">*</span>
            </Label>
            <Input
              id="deliveryStart"
              type="date"
              value={form.deliveryStart}
              onChange={(e) => setField("deliveryStart", e.target.value)}
              className={cn(errors.deliveryStart && "border-loss")}
            />
            {errors.deliveryStart && <p className="text-[11px] text-loss mt-1">{errors.deliveryStart}</p>}
          </div>

          {/* Delivery End */}
          <div className="col-span-2">
            <Label htmlFor="deliveryEnd" className="text-xs font-medium mb-1.5 block">
              Delivery End <span className="text-loss">*</span>
            </Label>
            <Input
              id="deliveryEnd"
              type="date"
              value={form.deliveryEnd}
              onChange={(e) => setField("deliveryEnd", e.target.value)}
              className={cn(errors.deliveryEnd && "border-loss")}
            />
            {errors.deliveryEnd && <p className="text-[11px] text-loss mt-1">{errors.deliveryEnd}</p>}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Trade</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
