"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";

export default function StudentSignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !password) { setError("Complete all required fields."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), phone: phone.trim(), password, role: "student" }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to create account"); setLoading(false); return; }
      router.push("/student/dashboard");
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
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 shadow-lg">
              <GraduationCap className="h-7 w-7 text-gold-500" />
            </div>
            <h1 className="mt-5 font-display text-3xl font-black text-surface-900">Student Sign Up</h1>
            <p className="mt-2 text-sm text-surface-600">Create your account for scholarships, counselling and admissions.</p>
          </div>

          <form className="mt-8 space-y-4 rounded-3xl border border-surface-200 bg-white p-6 shadow-card" onSubmit={handleSubmit}>
            <div className="space-y-2"><Label htmlFor="sup-name">Full name</Label><Input id="sup-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Rohan Desai" className="h-12 rounded-2xl" /></div>
            <div className="space-y-2"><Label htmlFor="sup-email">Email</Label><Input id="sup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="rohan@example.com" className="h-12 rounded-2xl" /></div>
            <div className="space-y-2"><Label htmlFor="sup-phone">Mobile number</Label><Input id="sup-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" className="h-12 rounded-2xl" /></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label htmlFor="sup-pass">Password</Label><Input id="sup-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" className="h-12 rounded-2xl" /></div>
              <div className="space-y-2"><Label htmlFor="sup-confirm">Confirm</Label><Input id="sup-confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm password" className="h-12 rounded-2xl" /></div>
            </div>
            {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
            <p className="text-xs text-surface-500">By creating an account you agree to receive counselling updates.</p>
            <Button variant="gold" className="h-12 w-full" type="submit" disabled={loading}><UserPlus className="h-4 w-4" /> {loading ? "Creating..." : "Create account"}</Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-surface-500">Already have an account?{" "}<Link href="/auth/sign-in" className="font-semibold text-gold-700 hover:underline">Sign In</Link></p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
