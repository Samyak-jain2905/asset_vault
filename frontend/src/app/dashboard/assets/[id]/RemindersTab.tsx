"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { fetchApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Plus } from "lucide-react";

export function RemindersTab({ assetId }: { assetId: string }) {
  const [reminders, setReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  useEffect(() => {
    loadReminders();
  }, [assetId]);

  async function loadReminders() {
    try {
      const data = await fetchApi(`/assets/${assetId}/maintenance-tasks`);
      setReminders(data);
    } catch (e) {
      console.error("Failed to load reminders", e);
    } finally {
      setLoading(false);
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetchApi(`/assets/${assetId}/maintenance-tasks`, {
        method: "POST",
        body: JSON.stringify(formData)
      });
      setIsAdding(false);
      setFormData({ title: "", description: "", dueDate: "" });
      loadReminders();
    } catch (e: any) {
      alert("Failed to add reminder: " + e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-4 text-center text-muted-foreground">Loading reminders...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Maintenance Reminders</h3>
        <Button onClick={() => setIsAdding(!isAdding)} size="sm">
          <Plus className="h-4 w-4 mr-2" /> Add Reminder
        </Button>
      </div>

      {isAdding && (
        <Card className="border-primary/50 shadow-md">
          <CardHeader className="py-3 bg-muted/20">
            <CardTitle className="text-sm font-medium">New Reminder</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Service AC" />
                </div>
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input type="date" required value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Optional details..." />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Reminder"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {reminders.length === 0 ? (
        <div className="text-center py-10 bg-muted/20 rounded-lg border border-dashed">
          <Calendar className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
          <p className="text-muted-foreground">No reminders set for this asset.</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reminders.map((r, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="font-medium">{r.title}</div>
                    <div className="text-xs text-muted-foreground">{r.description}</div>
                  </TableCell>
                  <TableCell>{r.dueDate}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary">
                      Upcoming
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
