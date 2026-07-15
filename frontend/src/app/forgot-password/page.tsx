"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, Key, ShieldCheck, ArrowLeft } from "lucide-react";
import { fetchApi } from "@/lib/api";

export default function ForgotPasswordPage() {
  const router = useRouter();
  
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Calling auth directly, as it doesn't need Bearer token
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to request OTP");
      
      setSuccessMsg(data.message);
      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to reset password");
      
      setSuccessMsg("Password reset successfully! Redirecting...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#110e1b] px-4 relative overflow-hidden">
      {/* Abstract Background Elements matching the Landing Page Vibe */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[50%] rounded-full bg-pink-600/20 blur-[120px] pointer-events-none" />

      <Card className="w-full max-w-md relative z-10 shadow-2xl border-white/10 bg-[#1a1625] text-white">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold flex items-center gap-2 text-white">
            <ShieldCheck className="text-purple-400" /> Password Recovery
          </CardTitle>
          <CardDescription className="text-gray-400">
            {step === 1 ? "Enter your registered email address to receive a secure OTP." : "Enter the 6-digit OTP sent to your email and your new password."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="p-3 mb-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-md">{error}</div>}
          {successMsg && <div className="p-3 mb-4 text-sm text-green-400 bg-green-400/10 border border-green-400/20 rounded-md">{successMsg}</div>}

          {step === 1 && (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input 
                    id="email" 
                    type="email" 
                    required 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="pl-10 bg-black/20 border-white/10 focus-visible:ring-purple-500 text-white" 
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-none shadow-lg shadow-purple-500/25" disabled={loading}>
                {loading ? "Requesting OTP..." : "Send Verification OTP"}
              </Button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-gray-300">6-Digit OTP</Label>
                <Input 
                  id="otp" 
                  required 
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  className="bg-black/20 border-white/10 focus-visible:ring-purple-500 text-white text-center text-xl tracking-widest font-mono" 
                  placeholder="------"
                  maxLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-gray-300">New Password</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input 
                    id="newPassword" 
                    type="password" 
                    required 
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="pl-10 bg-black/20 border-white/10 focus-visible:ring-purple-500 text-white" 
                    placeholder="Enter new strong password"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white border-none shadow-lg shadow-green-500/25" disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter>
          <Link href="/login" className="w-full">
            <Button variant="ghost" className="w-full text-gray-400 hover:text-white hover:bg-white/10 gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
