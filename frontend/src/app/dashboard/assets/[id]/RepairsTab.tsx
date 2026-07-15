"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wrench, Plus } from "lucide-react";

export function RepairsTab({ assetId }: { assetId: string }) {
  const [repairs, setRepairs] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ repairDate: "", issueDescription: "", cost: "", serviceCenter: "" });

  const loadRepairs = async () => {
    try {
      const data = await fetchApi(`/assets/${assetId}/repairs`);
      setRepairs(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadRepairs();
  }, [assetId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetchApi(`/assets/${assetId}/repairs`, {
        method: "POST",
        body: JSON.stringify({ ...formData, cost: parseFloat(formData.cost) || 0 }),
      });
      setOpen(false);
      setFormData({ repairDate: "", issueDescription: "", cost: "", serviceCenter: "" });
      loadRepairs();
    } catch (e) {
      console.error("Failed to add repair");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Service & Repair History</CardTitle>
          <CardDescription>Track maintenance and repairs.</CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button size="sm" className="gap-2" />}>
            <Plus className="h-4 w-4" /> Add Repair
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log Repair/Service</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Repair Date</Label>
                <Input type="date" required value={formData.repairDate} onChange={e => setFormData({ ...formData, repairDate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Issue Description</Label>
                <Input required placeholder="e.g. Screen replacement" value={formData.issueDescription} onChange={e => setFormData({ ...formData, issueDescription: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cost (₹)</Label>
                  <Input type="number" step="0.01" value={formData.cost} onChange={e => setFormData({ ...formData, cost: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Service Center</Label>
                  <Input placeholder="e.g. Genius Bar" value={formData.serviceCenter} onChange={e => setFormData({ ...formData, serviceCenter: e.target.value })} />
                </div>
              </div>
              <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Record"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4">
        {repairs.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">No repair history found.</div>
        ) : (
          repairs.map((r, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-destructive/10 text-destructive rounded-full">
                  <Wrench className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">{r.issueDescription}</p>
                  <p className="text-sm text-muted-foreground">
                    {r.repairDate} • {r.serviceCenter}
                  </p>
                </div>
              </div>
              <div className="font-bold text-lg">₹{r.cost}</div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
