"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShieldCheck, IndianRupee, Calendar, AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await fetchApi("/dashboard");
        setStats(data);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return <div className="text-center p-12 text-muted-foreground">Loading dashboard...</div>;
  }

  if (error || !stats) {
    return <div className="text-center p-12 text-destructive">Failed to load dashboard: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Dashboard</h1>
      </div>
      
      {/* Top Stats Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover-lift bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalAssets}</div>
            <p className="text-xs text-muted-foreground mt-1">Items managed in your vault</p>
          </CardContent>
        </Card>
        <Card className="hover-lift bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <IndianRupee className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{stats.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground mt-1">Initial purchase value</p>
          </CardContent>
        </Card>
        <Card className="hover-lift bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Warranties</CardTitle>
            <ShieldCheck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activeWarranties}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently protected assets</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Recent Assets */}
        <Card className="lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="grid gap-2">
              <CardTitle>Recent Assets</CardTitle>
              <CardDescription>
                Recently added to your vault.
              </CardDescription>
            </div>
            <Link href="/dashboard/assets">
              <Button variant="ghost" size="sm" className="gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {stats.recentAssets.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-10">
                You haven't added any assets yet.
              </div>
            ) : (
              <div className="space-y-4">
                {stats.recentAssets.map((asset: any) => (
                  <div key={asset.id} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors border">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-primary/10 text-primary flex items-center justify-center rounded-md font-semibold">
                        {asset.name.substring(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-none mb-1">{asset.name}</p>
                        <p className="text-xs text-muted-foreground">{asset.category?.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">₹{asset.purchasePrice}</p>
                      <Link href={`/dashboard/assets/${asset.id}`} className="text-xs text-primary hover:underline">
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Upcoming Expiries & Notifications */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" /> Action Items
            </CardTitle>
            <CardDescription>
              Expiring within the next 30 days.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.upcomingExpiries.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-10 flex flex-col items-center">
                <ShieldCheck className="h-10 w-10 text-green-500/50 mb-2" />
                <p>You're all caught up!</p>
                <p className="text-xs">No upcoming expiries.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.upcomingExpiries.map((expiry: any, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <div className="mt-0.5">
                      <Calendar className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-amber-900 dark:text-amber-400">
                        {expiry.assetName}
                      </p>
                      <p className="text-xs text-amber-700 dark:text-amber-500 mt-1">
                        {expiry.type} expires on {expiry.date}
                      </p>
                      <p className="text-xs font-semibold text-amber-600 mt-1">
                        In {expiry.daysLeft} days
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
