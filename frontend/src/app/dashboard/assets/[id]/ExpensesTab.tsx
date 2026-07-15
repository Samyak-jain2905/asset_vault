"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, Plus } from "lucide-react";

export function ExpensesTab({ assetId, basePrice }: { assetId: string, basePrice: number }) {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ expenseDate: "", type: "", description: "", amount: "" });

  const loadExpenses = async () => {
    try {
      const data = await fetchApi(`/assets/${assetId}/expenses`);
      setExpenses(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, [assetId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetchApi(`/assets/${assetId}/expenses`, {
        method: "POST",
        body: JSON.stringify({ ...formData, amount: parseFloat(formData.amount) || 0 }),
      });
      setOpen(false);
      setFormData({ expenseDate: "", type: "", description: "", amount: "" });
      loadExpenses();
    } catch (e) {
      console.error("Failed to add expense");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const totalInvestment = (basePrice || 0) + totalExpenses;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-primary">Initial Purchase</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{basePrice || 0}</div>
          </CardContent>
        </Card>
        <Card className="bg-destructive/5 border-destructive/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-destructive">Total Investment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalInvestment}</div>
            <p className="text-xs text-muted-foreground">Includes ₹{totalExpenses} in additional expenses</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Expense Log</CardTitle>
            <CardDescription>Track accessories, modifications, and other costs.</CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button size="sm" className="gap-2" />}>
              <Plus className="h-4 w-4" /> Add Expense
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log Expense</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" required value={formData.expenseDate} onChange={e => setFormData({ ...formData, expenseDate: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Input required placeholder="e.g. Accessory, Modification" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input required placeholder="e.g. New tires" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Amount (₹)</Label>
                  <Input type="number" step="0.01" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} />
                </div>
                <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Expense"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-4">
          {expenses.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">No expenses logged.</div>
          ) : (
            expenses.map((e, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-muted text-muted-foreground rounded-full">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{e.description} ({e.type})</p>
                    <p className="text-sm text-muted-foreground">{e.expenseDate}</p>
                  </div>
                </div>
                <div className="font-bold text-lg">₹{e.amount}</div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
