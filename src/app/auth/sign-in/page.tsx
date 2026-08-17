"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { GraduationCap, LogIn, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { useAppStore } from "@/store/useAppStore";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const signIn = useAppStore((s) => s.signIn);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) { setError("Please enter email and password"); return; }
    const user = signIn({ email: email.trim(), password });
    if (!user) { setError("Invalid credentials. Use demo email demo.student@orion.education with password Demo@1234 or create a new account."); return; }
    const returnTo = searchParams.get("returnTo") ?? "/student/dashboard";
    router.push(returnTo);
  }

  function handleDemoSignIn() {
    signIn({ email: "demo.student@orion.education", password: "Demo@1234" });
    router.push("/student/dashboard");
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
            <p className="mt-2 text-sm text-surface-600">Sign in to your Orion student account</p>
          </div>

          <form className="mt-8 space-y-4 rounded-3xl border border-surface-200 bg-white p-6 shadow-card" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="signin-email">Email or mobile number</Label>
              <Input id="signin-email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="demo.student@orion.education" className="h-12 rounded-2xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signin-pass">Password</Label>
              <Input id="signin-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Demo@1234" className="h-12 rounded-2xl" />
            </div>
            {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
            <Button variant="gold" className="h-12 w-full" type="submit"><LogIn className="h-4 w-4" /> Sign In</Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-surface-500">Don&apos;t have an account?{" "}<Link href="/auth/sign-up" className="font-semibold text-gold-700 hover:underline">Sign Up</Link></p>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-surface-200" /></div>
            <div className="relative flex justify-center"><span className="bg-surface-50 px-3 text-xs font-medium text-surface-400">or use demo account to test</span></div>
          </div>

          <Button variant="brandGradient" className="h-12 w-full" onClick={handleDemoSignIn}>
            <Sparkles className="h-4 w-4" /> Use Demo Student Account
          </Button>
          <p className="mt-3 text-center text-xs text-surface-400">Starts with an empty profile — perfect to test the full sign-in to scholarship flow.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function SignInPage() {
  return <Suspense fallback={null}><SignInForm /></Suspense>;
}
