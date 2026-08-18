"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, GraduationCap, Headset, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ROLE_CONFIG = {
  student: {
    icon: GraduationCap,
    title: "Student Sign In",
    subtitle: "Sign in to your Orion student account",
    accent: "from-brand-600 to-brand-700",
    iconColor: "text-gold-500",
    btnVariant: "gold" as const,
    homeHref: "/student/dashboard",
  },
  agent: {
    icon: Headset,
    title: "Agent Sign In",
    subtitle: "Sign in to your Orion CRM account",
    accent: "from-brand-700 to-brand-900",
    iconColor: "text-gold-400",
    btnVariant: "gold" as const,
    homeHref: "/agent/dashboard",
  },
  admin: {
    icon: ShieldCheck,
    title: "Admin Sign In",
    subtitle: "Sign in to the Orion Admin panel",
    accent: "from-brand-800 to-brand-950",
    iconColor: "text-gold-400",
    btnVariant: "gold" as const,
    homeHref: "/admin/dashboard",
  },
} as const;

interface RoleLoginFormProps {
  role: "student" | "agent" | "admin";
}

export function RoleLoginForm({ role }: RoleLoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const config = ROLE_CONFIG[role];
  const Icon = config.icon;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid credentials");
        setLoading(false);
        return;
      }
      const userRole = data.user?.role ?? data.role;
      if (userRole !== role) {
        const correctPage = userRole === "agent" ? "/auth/agent" : userRole === "admin" ? "/auth/admin" : "/auth/sign-in";
        setError(`This account is for ${userRole}s. Redirecting...`);
        setTimeout(() => router.push(correctPage), 1000);
        setLoading(false);
        return;
      }
      const returnTo = searchParams.get("returnTo");
      router.push(returnTo || config.homeHref);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center">
        <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${config.accent} shadow-lg`}>
          <Icon className={`h-7 w-7 ${config.iconColor}`} />
        </div>
        <h1 className="mt-5 font-display text-3xl font-black text-surface-900">{config.title}</h1>
        <p className="mt-2 text-sm text-surface-600">{config.subtitle}</p>
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
        <Button variant={config.btnVariant} className="h-12 w-full" type="submit" disabled={loading}>
          <LogIn className="h-4 w-4" /> {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="mt-4 flex flex-col items-center gap-2 text-center">
        {role === "student" && (
          <>
            <Link href="/auth/agent" className="text-sm text-surface-500 hover:text-gold-700">Agent Login →</Link>
            <Link href="/auth/admin" className="text-sm text-surface-500 hover:text-gold-700">Admin Login →</Link>
            <p className="mt-1 text-sm text-surface-500">
              Don&apos;t have an account?{" "}
              <Link href="/auth/sign-up" className="font-semibold text-gold-700 hover:underline">Sign Up</Link>
            </p>
          </>
        )}
        {role === "agent" && (
          <>
            <Link href="/auth/sign-in" className="text-sm text-surface-500 hover:text-gold-700">← Student Login</Link>
            <Link href="/auth/admin" className="text-sm text-surface-500 hover:text-gold-700">Admin Login →</Link>
          </>
        )}
        {role === "admin" && (
          <>
            <Link href="/auth/sign-in" className="text-sm text-surface-500 hover:text-gold-700">← Student Login</Link>
            <Link href="/auth/agent" className="text-sm text-surface-500 hover:text-gold-700">← Agent Login</Link>
          </>
        )}
      </div>
    </div>
  );
}
