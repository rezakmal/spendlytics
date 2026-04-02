"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { addTransaction } from "@/lib/action";

import { CATEGORIES } from "@/types";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export default function AddTransactionModal({ budgetId }: { budgetId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    amount: "", type:"expense" as "income" | "expense",
    category: "Food", note: "",
    date: new Date().toISOString().split("T") [0], 
  });
  
  async function handleSubmit() {
    setLoading(true); setError(null);
    try {
      await addTransaction({
        ...form, budget_id: budgetId,
        amount: parseFloat(form.amount)
      });
      setOpen(false);
    } catch (e: any) {
      setError(e.message);
    } finally { setLoading(false); }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-dark-primary hover:bg-indigo-500 text-white
          text-[12px] font-medium flex items-center gap-1.5">
          <Plus size={12} strokeWidth={2.5} />
          Add transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-surface border-dark-border text-dark-text">
        <DialogHeader>
          <DialogTitle className="text-dark-text">Add Transaction</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-[12px] text-dark-muted">Amount (Rp)</Label>
            <Input type="number" step="1000" value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              className="bg-base border-dark-border text-dark-text" />
          </div>
          <div>
            <Label className="text-[12px] text-dark-muted">Type</Label>
            <Select value={form.type}
              onValueChange={v => setForm(f => ({ ...f, type: v as any }))}>
              <SelectTrigger className="bg-base border-dark-border text-dark-text">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-surface border-dark-border text-dark-text">
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="income">Income</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-[12px] text-dark-muted">Category</Label>
            <Select value={form.category}
              onValueChange={v => setForm(f => ({ ...f, category: v }))}>
              <SelectTrigger className="bg-base border-dark-border text-dark-text">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-surface border-dark-border text-dark-text">
                {CATEGORIES.map(c =>
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-[12px] text-dark-muted">Date</Label>
            <Input type="date" value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              className="bg-base border-dark-border text-dark-text" />
          </div>
          <div>
            <Label className="text-[12px] text-dark-muted">Note (optional)</Label>
            <Input value={form.note}
              onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
              className="bg-base border-dark-border text-dark-text" />
          </div>
          {error && <p className="text-dark-red text-[12px]">{error}</p>}
          <Button onClick={handleSubmit} disabled={loading}
            className="w-full bg-dark-primary hover:bg-indigo-500 text-white">
            {loading ? "Saving..." : "Add Transaction"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}