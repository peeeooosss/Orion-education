"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ROLE_HREF: Record<string, string> = {
  student: "/student/dashboard",
  agent: "/agent/dashboard",
  admin: "/admin/dashboard",
};

interface Branding {
  title: string;
  subtitle: string;
  gradient: string;
  icon: React.ReactNode;
}

const NEUTRAL_BRANDING: Branding = {
  title: "Welcome back",
  subtitle: "Sign in to your Orion account",
  gradient: "from-brand-600 to-brand-700",
  icon: <GraduationCap className="h-7 w-7 text-gold-500" />,
};

interface RoleLoginFormProps {
  branding?: Branding;
}

export function RoleLoginForm({ branding }: RoleLoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const b = branding || NEUTRAL_BRANDING;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password");
      return;
    }
    setLoading(true);
    setError("");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      let data: Record<string, unknown>;
      try {
        data = await res.json();
      } catch {
        setError("Server returned an invalid response. Please try again.");
        setLoading(false);
        return;
      }
      if (!res.ok) {
        setError((data.error as string) || "Invalid credentials");
        setLoading(false);
        return;
      }
      const user = data.user as Record<string, string> | undefined;
      const userRole = user?.role as string | undefined;
      const returnTo = searchParams.get("returnTo");
      router.replace(returnTo || ROLE_HREF[userRole || "student"] || "/student/dashboard");
    } catch (err: unknown) {
      clearTimeout(timeout);
      if (err instanceof DOMException && err.name === "AbortError") {
        setError("Server timed out — please try again.");
      } else {
        setError("Network error — please check your connection.");
      }
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center">
        <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${b.gradient} shadow-lg`}>
          {b.icon}
        </div>
        <h1 className="mt-5 font-display text-3xl font-black text-surface-900">{b.title}</h1>
        <p className="mt-2 text-sm text-surface-600">{b.subtitle}</p>
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

      <div className="mt-4 flex flex-col items-center gap-2 text-center">
        <p className="text-sm text-surface-500">
          Don&apos;t have an account?{" "}
          <Link href="/auth/sign-up/student" className="font-semibold text-gold-700 hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
