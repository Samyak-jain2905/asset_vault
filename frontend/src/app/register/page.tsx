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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Lock, Mail, User as UserIcon, Package } from "lucide-react";
import { motion } from "framer-motion";

const schema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(20),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").max(40),
});

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setLoading(true);
    setError(null);
    try {
      await fetchApi("/auth/signup", {
        method: "POST",
        body: JSON.stringify({ ...data, role: ["user"] }),
      });
      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message || "Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 bg-[#0a0a0f] text-foreground overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[50%] rounded-full bg-blue-600/10 blur-[120px] mix-blend-screen" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <Link href="/" className="flex items-center justify-center gap-2 mb-8 group">
          <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
            <Package className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-white group-hover:text-purple-400 transition-colors">AssetVault</span>
        </Link>

        <Card className="border-white/10 bg-[#110e1b]/80 backdrop-blur-xl shadow-2xl shadow-purple-900/20">
          <CardHeader className="space-y-2 text-center pb-6">
            <CardTitle className="text-3xl font-bold tracking-tight text-white">Create an Account</CardTitle>
            <CardDescription className="text-gray-400 text-base">
              Join AssetVault to start managing your assets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" suppressHydrationWarning>
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-300">Username</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input id="username" placeholder="johndoe" className="pl-10 bg-black/40 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-purple-500 h-11" {...register("username")} />
                </div>
                {errors.username && <p className="text-sm text-red-400">{errors.username.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input id="email" type="email" placeholder="john@example.com" className="pl-10 bg-black/40 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-purple-500 h-11" {...register("email")} />
                </div>
                {errors.email && <p className="text-sm text-red-400">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input id="password" type="password" className="pl-10 bg-black/40 border-white/10 text-white focus-visible:ring-purple-500 h-11" {...register("password")} />
                </div>
                {errors.password && <p className="text-sm text-red-400">{errors.password.message}</p>}
              </div>
              {error && <p className="text-sm font-medium text-red-400 bg-red-900/20 p-3 rounded-lg border border-red-900/50">{error}</p>}
              
              <Button className="w-full h-11 mt-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 border-none text-white shadow-lg shadow-purple-600/20 hover:shadow-purple-600/40 transition-all font-medium text-base" type="submit" disabled={loading}>
                {loading ? "Creating account..." : "Sign Up"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 text-center text-sm text-gray-400 pt-2 pb-8">
            <div className="text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-purple-400 hover:text-purple-300 hover:underline font-medium transition-colors">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
