"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { fetchApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Filter, Download, FileText } from "lucide-react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

export default function AssetsPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    async function loadAssets() {
      try {
        const data = await fetchApi("/assets");
        setAssets(data);
      } catch (e) {
        console.error("Failed to load assets", e);
      } finally {
        setLoading(false);
      }
    }
    loadAssets();
  }, []);

  const handleExportCSV = () => {
    const headers = ["Asset Name,Category,Brand,Model,Serial,Purchase Date,Price,Store"];
    const rows = filteredAssets.map(asset => 
      `"${asset.name}","${asset.category?.name || ""}","${asset.brand || ""}","${asset.modelNumber || ""}","${asset.serialNumber || ""}","${asset.purchaseDate || ""}","${asset.purchasePrice || ""}","${asset.sellerOrStore || ""}"`
    );
    const csv = headers.concat(rows).join("\n");
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "assets_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    import("jspdf").then((jsPDF) => {
      import("jspdf-autotable").then((autoTable) => {
        const doc = new jsPDF.default();
        doc.text("AssetVault Inventory", 14, 15);
        
        const tableColumn = ["Asset Name", "Category", "Brand", "Purchase Date", "Price"];
        const tableRows = filteredAssets.map(asset => [
          asset.name,
          asset.category?.name || "Uncategorized",
          asset.brand || "-",
          asset.purchaseDate || "N/A",
          asset.purchasePrice ? `Rs. ${asset.purchasePrice}` : "N/A"
        ]);

        autoTable.default(doc, {
          head: [tableColumn],
          body: tableRows,
          startY: 20,
        });

        doc.save("assets_export.pdf");
      });
    });
  };

  // Extract unique categories for the filter dropdown
  const categories = ["All", ...Array.from(new Set(assets.map(a => a.category?.name || "Uncategorized")))];

  // Apply filters
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (asset.brand && asset.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (asset.tags && asset.tags.some((t: any) => t.name.toLowerCase().includes(searchQuery.toLowerCase())));
    const assetCategory = asset.category?.name || "Uncategorized";
    const matchesCategory = selectedCategory === "All" || assetCategory === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-primary">My Assets</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 shadow-sm" onClick={handleExportCSV}>
            <FileText className="h-4 w-4" /> Export CSV
          </Button>
          <Button variant="outline" className="gap-2 shadow-sm" onClick={handleExportPDF}>
            <Download className="h-4 w-4" /> Export PDF
          </Button>
          <Link href="/dashboard/assets/add">
            <Button className="gap-2 shadow-md">
              <Plus className="h-4 w-4" /> Add New Asset
            </Button>
          </Link>
        </div>
      </div>

      <Card className="border-t-4 border-t-primary shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle>Asset Directory</CardTitle>
        </CardHeader>
        <CardContent>
          
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-muted/30 rounded-lg border">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name or brand..." 
                className="pl-9 bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 sm:w-1/3">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat as string}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground animate-pulse">Loading directory...</div>
          ) : filteredAssets.length === 0 ? (
            <div className="text-center py-16 bg-muted/20 rounded-lg border border-dashed">
              <p className="text-muted-foreground mb-4">No assets found matching your criteria.</p>
              {assets.length === 0 && (
                <Link href="/dashboard/assets/add">
                  <Button variant="outline">Register your first asset</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Asset Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Purchase Date</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssets.map((asset) => (
                    <TableRow key={asset.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          {asset.productImage ? (
                            <img src={`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080"}${asset.productImage}`} alt={asset.name} className="w-8 h-8 rounded object-cover" />
                          ) : (
                            <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                              {asset.name.substring(0, 1).toUpperCase()}
                            </div>
                          )}
                          {asset.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                          {asset.category?.name || "Uncategorized"}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{asset.brand || "-"}</TableCell>
                      <TableCell className="text-muted-foreground">{asset.purchaseDate || "N/A"}</TableCell>
                      <TableCell className="text-right font-medium">
                        {asset.purchasePrice ? `₹${asset.purchasePrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : "N/A"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-[150px]">
                          {asset.tags && asset.tags.map((t: any) => (
                            <span key={t.id} className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground">
                              {t.name}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Link href={`/dashboard/assets/${asset.id}`}>
                          <Button variant="secondary" size="sm" className="hover:bg-primary hover:text-primary-foreground transition-colors">View Details</Button>
                        </Link>
                        <Link href={`/dashboard/assets/${asset.id}/edit`}>
                          <Button variant="outline" size="sm" className="hover:bg-primary hover:text-primary-foreground transition-colors">Edit</Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
