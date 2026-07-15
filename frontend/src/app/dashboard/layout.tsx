"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, LayoutDashboard, Package, Settings, Search, ShieldAlert, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (!token || !userData) {
      router.push("/login");
    } else {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!user) return null;

  const NavLinks = ({ mobile }: { mobile?: boolean }) => (
    <nav className={`grid items-start px-2 text-sm font-medium lg:px-4 ${mobile ? "space-y-1" : ""}`}>
      <Link
        href="/dashboard"
        onClick={() => mobile && setMobileMenuOpen(false)}
        className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
      >
        <LayoutDashboard className="h-4 w-4" />
        Dashboard
      </Link>
      <Link
        href="/dashboard/assets"
        onClick={() => mobile && setMobileMenuOpen(false)}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
      >
        <Package className="h-4 w-4" />
        My Assets
      </Link>
      <Link
        href="/dashboard/settings"
        onClick={() => mobile && setMobileMenuOpen(false)}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
      >
        <Settings className="h-4 w-4" />
        Settings
      </Link>
      
      {user.roles?.includes("ROLE_ADMIN") && (
        <Link
          href="/dashboard/admin"
          onClick={() => mobile && setMobileMenuOpen(false)}
          className="flex items-center gap-3 rounded-lg mt-4 bg-red-500/10 px-3 py-2 text-red-600 transition-all hover:bg-red-500/20"
        >
          <ShieldAlert className="h-4 w-4" />
          Admin Panel
        </Link>
      )}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-background md:flex">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-primary text-xl tracking-tight">
            AssetVault
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <NavLinks />
        </div>
        <div className="mt-auto p-4 border-t">
          <Button variant="outline" className="w-full justify-start gap-2" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>
      <div className="flex flex-col w-full min-w-0">
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
          <Button variant="ghost" size="icon" className="md:hidden shrink-0" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search assets, categories..."
                  className="w-full appearance-none bg-background pl-8 shadow-none border rounded-md h-9 md:w-2/3 lg:w-1/3 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </form>
          </div>
          <div className="flex items-center gap-2 font-medium text-sm">
            <span>Welcome, {user.username}</span>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>

      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-background/80 backdrop-blur-sm">
          <div className="w-64 bg-background h-full border-r flex flex-col">
            <div className="flex h-14 items-center justify-between border-b px-4">
              <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-primary text-xl tracking-tight" onClick={() => setMobileMenuOpen(false)}>
                AssetVault
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-auto py-4">
              <NavLinks mobile />
            </div>
            <div className="mt-auto p-4 border-t">
              <Button variant="outline" className="w-full justify-start gap-2" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
