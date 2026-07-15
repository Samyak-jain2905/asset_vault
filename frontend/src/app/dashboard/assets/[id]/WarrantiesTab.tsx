"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Plus } from "lucide-react";

export function WarrantiesTab({ assetId }: { assetId: string }) {
  const [warranties, setWarranties] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ provider: "", type: "", startDate: "", endDate: "" });

  const loadWarranties = async () => {
    try {
      const data = await fetchApi(`/assets/${assetId}/warranties`);
      setWarranties(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadWarranties();
  }, [assetId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetchApi(`/assets/${assetId}/warranties`, {
        method: "POST",
        body: JSON.stringify(formData),
      });
      setOpen(false);
      setFormData({ provider: "", type: "", startDate: "", endDate: "" });
      loadWarranties();
    } catch (e) {
      console.error("Failed to add warranty");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Warranties</CardTitle>
          <CardDescription>Manage warranties and extended protection plans.</CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button size="sm" className="gap-2" />}>
            <Plus className="h-4 w-4" /> Add Warranty
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Warranty</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Provider</Label>
                <Input required placeholder="e.g. Apple Care, Manufacturer" value={formData.provider} onChange={e => setFormData({ ...formData, provider: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Input required placeholder="e.g. Extended, Limited" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input type="date" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input type="date" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} />
                </div>
              </div>
              <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Warranty"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4">
        {warranties.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">No warranties found.</div>
        ) : (
          warranties.map((w, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 text-primary rounded-full">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">{w.provider} ({w.type})</p>
                  <p className="text-sm text-muted-foreground">
                    {w.startDate} to {w.endDate}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
