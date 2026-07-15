"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Lock, Bell, Palette } from "lucide-react";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto w-full pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account settings and preferences.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-4 justify-start mb-6 h-auto p-1">
          <TabsTrigger value="profile" className="flex gap-2 py-2"><User className="h-4 w-4 hidden sm:block" /> Profile</TabsTrigger>
          <TabsTrigger value="appearance" className="flex gap-2 py-2"><Palette className="h-4 w-4 hidden sm:block" /> Appearance</TabsTrigger>
          <TabsTrigger value="notifications" className="flex gap-2 py-2"><Bell className="h-4 w-4 hidden sm:block" /> Alerts</TabsTrigger>
          <TabsTrigger value="security" className="flex gap-2 py-2"><Lock className="h-4 w-4 hidden sm:block" /> Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your personal details and account role.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input defaultValue={user.username} readOnly className="bg-muted/50 cursor-not-allowed" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input defaultValue={user.email} readOnly className="bg-muted/50 cursor-not-allowed" />
                </div>
              </div>
              <div className="space-y-2 mt-2">
                <Label>Account Role</Label>
                <div className="flex gap-2 mt-1">
                  {user.roles?.map((role: string) => (
                    <span key={role} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary">
                      {role.replace('ROLE_', '')}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button disabled variant="secondary">Contact admin to change details</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the look and feel of your dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <select 
                  value={mounted ? theme : "system"}
                  onChange={(e) => setTheme(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 max-w-xs"
                >
                  <option value="system">System Default</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Currency Preference</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 max-w-xs">
                  <option value="INR">Indian Rupee (₹)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                  <option value="GBP">British Pound (£)</option>
                </select>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose what alerts you want to receive.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
                <div className="space-y-0.5">
                  <Label>Warranty Expiration Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified when an asset's warranty is about to expire.</p>
                </div>
                <input type="checkbox" className="h-4 w-4 accent-primary" defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
                <div className="space-y-0.5">
                  <Label>Insurance Renewal Reminders</Label>
                  <p className="text-sm text-muted-foreground">Receive reminders 30 days before insurance expires.</p>
                </div>
                <input type="checkbox" className="h-4 w-4 accent-primary" defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
                <div className="space-y-0.5">
                  <Label>Monthly Summary Emails</Label>
                  <p className="text-sm text-muted-foreground">Receive a summary of your assets and expenses every month.</p>
                </div>
                <input type="checkbox" className="h-4 w-4 accent-primary" />
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button>Update Alerts</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your password and account security.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 max-w-md">
                <Label>Current Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2 max-w-md">
                <Label>New Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2 max-w-md">
                <Label>Confirm New Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button>Update Password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
