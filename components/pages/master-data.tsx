"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { counterparties as initCPs, books as initBooks, products as initProducts } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function MasterDataPage() {
  const [cps, setCps] = useState(initCPs);
  const [books, setBooks] = useState(initBooks);
  const [prods, setProds] = useState(initProducts);

  const [cpModal, setCpModal] = useState(false);
  const [bookModal, setBookModal] = useState(false);
  const [prodModal, setProdModal] = useState(false);

  // Counterparty form
  const [cpForm, setCpForm] = useState({ name: "", shortCode: "", status: "Active" as "Active" | "Inactive" });
  function addCP() {
    setCps((prev) => [...prev, { id: `CP${String(prev.length + 1).padStart(3, "0")}`, ...cpForm }]);
    setCpModal(false);
    setCpForm({ name: "", shortCode: "", status: "Active" });
  }

  // Book form
  const [bookForm, setBookForm] = useState({ name: "", description: "" });
  function addBook() {
    setBooks((prev) => [...prev, { id: `BK${String(prev.length + 1).padStart(3, "0")}`, ...bookForm }]);
    setBookModal(false);
    setBookForm({ name: "", description: "" });
  }

  // Product form
  const [prodForm, setProdForm] = useState({ name: "", unit: "MWh", status: "Active" as "Active" | "Inactive" });
  function addProd() {
    setProds((prev) => [...prev, { id: `PR${String(prev.length + 1).padStart(3, "0")}`, ...prodForm }]);
    setProdModal(false);
    setProdForm({ name: "", unit: "MWh", status: "Active" });
  }

  return (
    <div className="space-y-4">
      <Card>
        <Tabs defaultValue="counterparties">
          <div className="flex items-center justify-between border-b border-border px-4">
            <TabsList className="h-11 bg-transparent gap-0 p-0">
              {["counterparties", "books", "products"].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="h-11 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-sm capitalize"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="counterparties" className="m-0 !mt-0 border-0 p-0">
              <Button size="sm" className="h-7 gap-1.5 text-xs" onClick={() => setCpModal(true)}>
                <Plus className="h-3.5 w-3.5" /> Add Counterparty
              </Button>
            </TabsContent>
            <TabsContent value="books" className="m-0 !mt-0 border-0 p-0">
              <Button size="sm" className="h-7 gap-1.5 text-xs" onClick={() => setBookModal(true)}>
                <Plus className="h-3.5 w-3.5" /> Add Book
              </Button>
            </TabsContent>
            <TabsContent value="products" className="m-0 !mt-0 border-0 p-0">
              <Button size="sm" className="h-7 gap-1.5 text-xs" onClick={() => setProdModal(true)}>
                <Plus className="h-3.5 w-3.5" /> Add Product
              </Button>
            </TabsContent>
          </div>

          {/* Counterparties */}
          <TabsContent value="counterparties" className="m-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {["ID", "Name", "Short Code", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cps.map((c, i) => (
                  <tr key={c.id} className={cn("border-b border-border/40 hover:bg-muted/20 transition-colors", i % 2 !== 0 ? "bg-muted/10" : "")}>
                    <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{c.id}</td>
                    <td className="px-4 py-3 text-sm font-medium">{c.name}</td>
                    <td className="px-4 py-3 text-xs font-mono font-semibold">{c.shortCode}</td>
                    <td className="px-4 py-3">
                      <span className={cn("text-xs font-medium", c.status === "Active" ? "text-profit" : "text-muted-foreground")}>{c.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6"><Pencil className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive"
                          onClick={() => setCps((prev) => prev.filter((x) => x.id !== c.id))}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TabsContent>

          {/* Books */}
          <TabsContent value="books" className="m-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {["Book ID", "Book Name", "Description", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {books.map((b, i) => (
                  <tr key={b.id} className={cn("border-b border-border/40 hover:bg-muted/20 transition-colors", i % 2 !== 0 ? "bg-muted/10" : "")}>
                    <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{b.id}</td>
                    <td className="px-4 py-3 text-sm font-medium">{b.name}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{b.description}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6"><Pencil className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive"
                          onClick={() => setBooks((prev) => prev.filter((x) => x.id !== b.id))}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TabsContent>

          {/* Products */}
          <TabsContent value="products" className="m-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {["Product ID", "Product Name", "Unit", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {prods.map((p, i) => (
                  <tr key={p.id} className={cn("border-b border-border/40 hover:bg-muted/20 transition-colors", i % 2 !== 0 ? "bg-muted/10" : "")}>
                    <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{p.id}</td>
                    <td className="px-4 py-3 text-sm font-medium">{p.name}</td>
                    <td className="px-4 py-3 text-xs font-mono">{p.unit}</td>
                    <td className="px-4 py-3">
                      <span className={cn("text-xs font-medium", p.status === "Active" ? "text-profit" : "text-muted-foreground")}>{p.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6"><Pencil className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive"
                          onClick={() => setProds((prev) => prev.filter((x) => x.id !== p.id))}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Add Counterparty Modal */}
      <Dialog open={cpModal} onOpenChange={setCpModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Add Counterparty</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label className="text-xs font-medium mb-1.5 block">Name</Label>
              <Input value={cpForm.name} onChange={(e) => setCpForm((f) => ({ ...f, name: e.target.value }))} placeholder="Counterparty name" />
            </div>
            <div>
              <Label className="text-xs font-medium mb-1.5 block">Short Code</Label>
              <Input value={cpForm.shortCode} onChange={(e) => setCpForm((f) => ({ ...f, shortCode: e.target.value.toUpperCase() }))} placeholder="e.g. VIT" maxLength={5} className="font-mono" />
            </div>
            <div>
              <Label className="text-xs font-medium mb-1.5 block">Status</Label>
              <Select value={cpForm.status} onValueChange={(v) => setCpForm((f) => ({ ...f, status: v as "Active" | "Inactive" }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCpModal(false)}>Cancel</Button>
            <Button onClick={addCP} disabled={!cpForm.name || !cpForm.shortCode}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Book Modal */}
      <Dialog open={bookModal} onOpenChange={setBookModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Add Book</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label className="text-xs font-medium mb-1.5 block">Book Name</Label>
              <Input value={bookForm.name} onChange={(e) => setBookForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Power NL" />
            </div>
            <div>
              <Label className="text-xs font-medium mb-1.5 block">Description</Label>
              <Input value={bookForm.description} onChange={(e) => setBookForm((f) => ({ ...f, description: e.target.value }))} placeholder="Book description" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBookModal(false)}>Cancel</Button>
            <Button onClick={addBook} disabled={!bookForm.name}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Product Modal */}
      <Dialog open={prodModal} onOpenChange={setProdModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Add Product</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label className="text-xs font-medium mb-1.5 block">Product Name</Label>
              <Input value={prodForm.name} onChange={(e) => setProdForm((f) => ({ ...f, name: e.target.value }))} placeholder="Product name" />
            </div>
            <div>
              <Label className="text-xs font-medium mb-1.5 block">Unit</Label>
              <Select value={prodForm.unit} onValueChange={(v) => setProdForm((f) => ({ ...f, unit: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="MWh">MWh</SelectItem>
                  <SelectItem value="tCO2">tCO2</SelectItem>
                  <SelectItem value="GBp/therm">GBp/therm</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-medium mb-1.5 block">Status</Label>
              <Select value={prodForm.status} onValueChange={(v) => setProdForm((f) => ({ ...f, status: v as "Active" | "Inactive" }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProdModal(false)}>Cancel</Button>
            <Button onClick={addProd} disabled={!prodForm.name}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
