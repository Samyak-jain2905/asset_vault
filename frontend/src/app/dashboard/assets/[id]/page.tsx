"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Edit, FileText, Image as ImageIcon, Calendar, Trash2, Share2, TrendingDown } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WarrantiesTab } from "./WarrantiesTab";
import { RepairsTab } from "./RepairsTab";
import { ExpensesTab } from "./ExpensesTab";
import { RemindersTab } from "./RemindersTab";
import { Input } from "@/components/ui/input";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AssetDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [asset, setAsset] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [shareEmail, setShareEmail] = useState("");
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  useEffect(() => {
    async function loadAsset() {
      try {
        const data = await fetchApi(`/assets/${id}`);
        setAsset(data);
      } catch (e: any) {
        setError(e.message || "Failed to load asset");
      } finally {
        setLoading(false);
      }
    }
    loadAsset();
  }, [id]);

  const handleDelete = async () => {
    try {
      await fetchApi(`/assets/${id}`, { method: "DELETE" });
      router.push("/dashboard/assets");
    } catch (e: any) {
      alert("Failed to delete asset: " + e.message);
    }
  };

  const handleShare = async () => {
    if (!shareEmail) return;
    try {
      await fetchApi(`/assets/${id}/share`, {
        method: "POST",
        body: JSON.stringify({ email: shareEmail })
      });
      alert("Shared successfully!");
      setIsShareDialogOpen(false);
      setShareEmail("");
    } catch(e: any) {
      alert("Failed to share: " + e.message);
    }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading asset details...</div>;
  if (error || !asset) return <div className="p-8 text-center text-destructive">{error || "Asset not found"}</div>;

  const isVehicle = asset.category?.name?.toLowerCase().includes("car") || asset.category?.name?.toLowerCase().includes("bike") || asset.category?.name?.toLowerCase().includes("vehicle");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080";

  const getEstimatedValue = () => {
    if (!asset.purchasePrice || !asset.purchaseDate) return null;
    const price = parseFloat(asset.purchasePrice);
    const purchaseDate = new Date(asset.purchaseDate);
    const now = new Date();
    const yearsDiff = (now.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    
    // Assume 10 years for vehicles, 5 for others
    const lifeSpan = isVehicle ? 10 : 5;
    if (yearsDiff >= lifeSpan) return 0;
    
    const depreciationPerYear = price / lifeSpan;
    let currentValue = price - (depreciationPerYear * yearsDiff);
    return Math.max(0, currentValue).toFixed(2);
  };
  const estimatedValue = getEstimatedValue();

  return (
    <div className="space-y-6 max-w-5xl mx-auto w-full pb-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{asset.name}</h1>
            <p className="text-muted-foreground">{asset.category?.name} {asset.brand ? `• ${asset.brand}` : ""}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <AlertDialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
            <AlertDialogTrigger render={
              <Button variant="outline">
                <Share2 className="h-4 w-4 mr-2" /> Share
              </Button>
            } />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Share Asset</AlertDialogTitle>
                <AlertDialogDescription>
                  Enter the email address of the person you want to share this asset with.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="py-4">
                <Input placeholder="user@example.com" value={shareEmail} onChange={e => setShareEmail(e.target.value)} />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={(e) => { e.preventDefault(); handleShare(); }}>Share</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button variant="outline" onClick={() => router.push(`/dashboard/assets/${id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" /> Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger render={
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </Button>
            } />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete <b>{asset.name}</b> and remove all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete Asset</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Image & Quick Info */}
        <div className="space-y-6">
          <Card className="overflow-hidden shadow-sm">
            {asset.productImage ? (
              <img src={`${baseUrl}${asset.productImage}`} alt={asset.name} className="w-full h-64 object-cover" />
            ) : (
              <div className="w-full h-64 bg-muted flex flex-col items-center justify-center text-muted-foreground">
                <ImageIcon className="h-12 w-12 mb-2 opacity-20" />
                <span>No Image Available</span>
              </div>
            )}
            <CardContent className="p-4 grid gap-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Purchase Price</span>
                <span className="font-semibold text-lg">{asset.purchasePrice ? `₹${asset.purchasePrice.toLocaleString()}` : "N/A"}</span>
              </div>
              {estimatedValue !== null && (
                <div className="flex justify-between items-center py-2 border-t border-b">
                  <span className="text-muted-foreground text-sm flex items-center gap-1"><TrendingDown className="w-3 h-3"/> Current Value (Est)</span>
                  <span className="font-semibold text-lg text-primary">₹{Number(estimatedValue).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Purchase Date</span>
                <span className="font-medium flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {asset.purchaseDate || "Unknown"}
                </span>
              </div>
            </CardContent>
          </Card>

          {asset.invoiceDocument && (
            <Card className="shadow-sm">
              <CardHeader className="py-4 border-b bg-muted/20">
                <CardTitle className="text-md flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" /> Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="py-4 space-y-2">
                <a href={`${baseUrl}${asset.invoiceDocument}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors">
                  <span className="text-sm font-medium">Invoice Document</span>
                  <Button variant="secondary" size="sm">View</Button>
                </a>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Detailed Tabs */}
        <div className="md:col-span-2">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto p-1">
              <TabsTrigger value="details" className="py-2">Details</TabsTrigger>
              <TabsTrigger value="warranties" className="py-2">Warranties</TabsTrigger>
              <TabsTrigger value="history" className="py-2">History</TabsTrigger>
              <TabsTrigger value="expenses" className="py-2">Expenses</TabsTrigger>
              <TabsTrigger value="reminders" className="py-2">Reminders</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Hardware Specifications</CardTitle>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Brand</p>
                    <p className="font-medium">{asset.brand || "-"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Model Number</p>
                    <p className="font-medium">{asset.modelNumber || "-"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Serial Number</p>
                    <p className="font-medium">{asset.serialNumber || "-"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Seller / Store</p>
                    <p className="font-medium">{asset.sellerOrStore || "-"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Invoice Number</p>
                    <p className="font-medium">{asset.invoiceNumber || "-"}</p>
                  </div>
                </CardContent>
              </Card>

              {isVehicle && (
                <Card>
                  <CardHeader>
                    <CardTitle>Vehicle Details</CardTitle>
                  </CardHeader>
                  <CardContent className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Registration No.</p>
                      <p className="font-medium">{asset.registrationNumber || "-"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Engine No.</p>
                      <p className="font-medium">{asset.engineNumber || "-"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Chassis No.</p>
                      <p className="font-medium">{asset.chassisNumber || "-"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Insurance Expiry</p>
                      <p className="font-medium">{asset.insuranceExpiry || "-"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">PUC Expiry</p>
                      <p className="font-medium">{asset.pucExpiry || "-"}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="warranties" className="mt-4">
              <WarrantiesTab assetId={asset.id} />
            </TabsContent>

            <TabsContent value="history" className="mt-4">
              <RepairsTab assetId={asset.id} />
            </TabsContent>

            <TabsContent value="expenses" className="mt-4">
              <ExpensesTab assetId={asset.id} basePrice={asset.purchasePrice} />
            </TabsContent>

            <TabsContent value="reminders" className="mt-4">
              <RemindersTab assetId={asset.id} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
