"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShieldAlert, Users, Package } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Basic frontend check
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.roles?.includes("ROLE_ADMIN")) {
      router.push("/dashboard");
      return;
    }

    async function loadAdminData() {
      try {
        const [usersData, assetsData] = await Promise.all([
          fetchApi("/admin/users"),
          fetchApi("/admin/assets")
        ]);
        setUsers(usersData);
        setAssets(assetsData);
      } catch (e: any) {
        setError(e.message || "Failed to load admin data");
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, [router]);

  if (loading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading Admin Dashboard...</div>;
  if (error) return <div className="p-8 text-center text-red-500 font-semibold">{error}</div>;

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-red-500/10 rounded-lg">
          <ShieldAlert className="h-6 w-6 text-red-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-red-600">Admin Control Panel</h1>
          <p className="text-muted-foreground">Manage users and oversee global platform activity.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Platform Assets</CardTitle>
            <Package className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{assets.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="users">User Directory</TabsTrigger>
          <TabsTrigger value="assets">Global Assets</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Registered Users</CardTitle>
              <CardDescription>View all active users on the platform.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead className="text-right">Assets Logged</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.id}</TableCell>
                      <TableCell>{u.username}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {u.roles.map((r: string) => (
                            <span key={r} className={`px-2 py-1 rounded-full text-xs font-semibold ${r === 'ROLE_ADMIN' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                              {r.replace('ROLE_', '')}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-bold text-primary">{u.assetCount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assets" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Global Asset Log</CardTitle>
              <CardDescription>View all assets stored across all users.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Asset Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assets.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium text-xs text-muted-foreground">{a.id}</TableCell>
                      <TableCell className="font-semibold">{a.name}</TableCell>
                      <TableCell>{a.category?.name || "Uncategorized"}</TableCell>
                      <TableCell className="font-medium text-blue-600">{a.user?.username || "Unknown"}</TableCell>
                      <TableCell className="text-right font-medium">
                        {a.purchasePrice ? `$${a.purchasePrice.toLocaleString()}` : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
