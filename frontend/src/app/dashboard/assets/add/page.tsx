"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { fetchApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud } from "lucide-react";

const assetSchema = z.object({
  name: z.string().min(1, "Name is required"),
  categoryName: z.string().min(1, "Category is required"),
  brand: z.string().optional(),
  modelNumber: z.string().optional(),
  serialNumber: z.string().optional(),
  purchasePrice: z.coerce.number().optional(),
  purchaseDate: z.string().optional(),
  registrationNumber: z.string().optional(),
  engineNumber: z.string().optional(),
  chassisNumber: z.string().optional(),
  insuranceExpiry: z.string().optional(),
  pucExpiry: z.string().optional(),
  tags: z.string().optional(),
});

export default function AddAssetPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(assetSchema),
  });

  const selectedCategory = watch("categoryName");
  const isVehicle = selectedCategory?.toLowerCase().includes("car") || selectedCategory?.toLowerCase().includes("bike") || selectedCategory?.toLowerCase().includes("vehicle");

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    
    // We don't use fetchApi because of FormData content-type overriding issue
    const token = localStorage.getItem("token");
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"}/assets/upload`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: formData,
    });
    
    if (!response.ok) throw new Error("Upload failed");
    const data = await response.json();
    return data.url;
  };

  const onSubmit = async (data: z.infer<typeof assetSchema>) => {
    setLoading(true);
    setError(null);
    try {
      let imageUrl = null;
      let invoiceUrl = null;

      if (imageFile) imageUrl = await handleFileUpload(imageFile);
      if (invoiceFile) invoiceUrl = await handleFileUpload(invoiceFile);

      const parseDate = (d: string | undefined | null) => {
        if (!d || d.trim() === "") return null;
        return new Date(d).toISOString().split("T")[0];
      };

      const apiData = {
        name: data.name,
        category: { name: data.categoryName },
        brand: data.brand,
        modelNumber: data.modelNumber,
        serialNumber: data.serialNumber,
        purchasePrice: data.purchasePrice,
        productImage: imageUrl,
        invoiceDocument: invoiceUrl,
        purchaseDate: parseDate(data.purchaseDate as any),
        ...(isVehicle && {
          registrationNumber: data.registrationNumber,
          engineNumber: data.engineNumber,
          chassisNumber: data.chassisNumber,
          insuranceExpiry: parseDate(data.insuranceExpiry),
          pucExpiry: parseDate(data.pucExpiry),
        }),
        tags: data.tags ? data.tags.split(",").map((t: string) => ({ name: t.trim() })).filter((t: any) => t.name !== "") : []
      };

      await fetchApi("/assets", {
        method: "POST",
        body: JSON.stringify(apiData),
      });

      router.push("/dashboard/assets");
    } catch (e: any) {
      setError(e.message || "Failed to add asset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full pb-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Register New Asset</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Basic Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Asset Name *</Label>
                  <Input placeholder="e.g. MacBook Pro, Honda City" {...register("name")} />
                  {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Input placeholder="e.g. Laptops, Cars, Mobile Phones" {...register("categoryName")} />
                  {errors.categoryName && <p className="text-sm text-destructive">{errors.categoryName.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Brand</Label>
                  <Input placeholder="Apple" {...register("brand")} />
                </div>
                <div className="space-y-2">
                  <Label>Model Number</Label>
                  <Input placeholder="A2338" {...register("modelNumber")} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Serial Number</Label>
                  <Input placeholder="C02XXXXXXXXX" {...register("serialNumber")} />
                </div>
                <div className="space-y-2">
                  <Label>Purchase Price (₹)</Label>
                  <Input type="number" step="0.01" placeholder="1299.99" {...register("purchasePrice")} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Purchase Date</Label>
                  <Input type="date" {...register("purchaseDate")} />
                </div>
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <Input placeholder="office, electronics, shared (comma separated)" {...register("tags")} />
                </div>
              </div>
            </div>

            {/* Conditional Vehicle Info */}
            {isVehicle && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
                <h3 className="text-lg font-medium border-b pb-2">Vehicle Specifics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Registration Number</Label>
                    <Input placeholder="MH 04 AB 1234" {...register("registrationNumber")} />
                  </div>
                  <div className="space-y-2">
                    <Label>Engine Number</Label>
                    <Input placeholder="XXXXX" {...register("engineNumber")} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Chassis Number</Label>
                    <Input placeholder="XXXXX" {...register("chassisNumber")} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Insurance Expiry Date</Label>
                    <Input type="date" {...register("insuranceExpiry")} />
                  </div>
                  <div className="space-y-2">
                    <Label>PUC Expiry Date</Label>
                    <Input type="date" {...register("pucExpiry")} />
                  </div>
                </div>
              </div>
            )}

            {/* File Uploads */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Documents & Media</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Product Photo</Label>
                  <div className="flex flex-col gap-1">
                    <Input 
                      type="file" 
                      accept="image/*" 
                      className="file:bg-primary file:text-primary-foreground file:border file:border-solid file:border-primary file:rounded-md file:px-3 file:py-1 file:mr-3 hover:file:bg-primary/90 cursor-pointer h-auto py-1.5"
                      onChange={(e) => e.target.files && setImageFile(e.target.files[0])} 
                    />
                    <p className="text-xs text-muted-foreground">Max size: 5MB</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Invoice Document</Label>
                  <div className="flex flex-col gap-1">
                    <Input 
                      type="file" 
                      accept="application/pdf,image/*" 
                      className="file:bg-primary file:text-primary-foreground file:border file:border-solid file:border-primary file:rounded-md file:px-3 file:py-1 file:mr-3 hover:file:bg-primary/90 cursor-pointer h-auto py-1.5"
                      onChange={(e) => e.target.files && setInvoiceFile(e.target.files[0])} 
                    />
                    <p className="text-xs text-muted-foreground">Max size: 5MB</p>
                  </div>
                </div>
              </div>
            </div>

            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
            
            <div className="flex justify-end gap-4 mt-6">
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving Asset & Uploading..." : "Save Asset"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
