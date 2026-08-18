"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { GraduationCap, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) { setError("Please enter email and password"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Invalid credentials"); setLoading(false); return; }
      const returnTo = searchParams.get("returnTo");
      if (data.role === "agent" || data.role === "admin") {
        router.push(returnTo || "/agent/dashboard");
      } else {
        router.push(returnTo || "/student/dashboard");
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient shadow-lg">
              <GraduationCap className="h-7 w-7 text-gold-500" />
            </div>
            <h1 className="mt-5 font-display text-3xl font-black text-surface-900">Welcome back</h1>
            <p className="mt-2 text-sm text-surface-600">Sign in to your Orion account</p>
          </div>

          <form className="mt-8 space-y-4 rounded-3xl border border-surface-200 bg-white p-6 shadow-card" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="signin-email">Email</Label>
              <Input id="signin-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="h-12 rounded-2xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signin-pass">Password</Label>
              <Input id="signin-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" className="h-12 rounded-2xl" />
            </div>
            {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
            <Button variant="gold" className="h-12 w-full" type="submit" disabled={loading}>
              <LogIn className="h-4 w-4" /> {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-surface-500">Don&apos;t have an account?{" "}<Link href="/auth/sign-up" className="font-semibold text-gold-700 hover:underline">Sign Up</Link></p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function SignInPage() {
  return <Suspense fallback={null}><SignInForm /></Suspense>;
}
