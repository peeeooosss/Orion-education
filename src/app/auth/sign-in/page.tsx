"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Shield, Headphones, GraduationCap, ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";

const PORTALS = [
  {
    role: "admin",
    title: "Admin Portal",
    subtitle: "Manage agents, colleges, and platform settings",
    icon: <Shield className="h-8 w-8 text-white" />,
    gradient: "from-indigo-600 to-indigo-800",
    href: "/auth/sign-in/admin",
  },
  {
    role: "agent",
    title: "Agent Portal",
    subtitle: "Manage leads, calls, and student applications",
    icon: <Headphones className="h-8 w-8 text-white" />,
    gradient: "from-emerald-600 to-emerald-800",
    href: "/auth/sign-in/agent",
  },
  {
    role: "student",
    title: "Student Portal",
    subtitle: "Scholarships, college search, and applications",
    icon: <GraduationCap className="h-8 w-8 text-gold-500" />,
    gradient: "from-brand-600 to-brand-700",
    href: "/auth/sign-in/student",
  },
];

function SignInContent() {
  return (
    <>
      <SiteHeader />
      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-black text-surface-900">Sign In</h1>
            <p className="mt-2 text-sm text-surface-600">Choose your portal to continue</p>
          </div>

          <div className="space-y-4">
            {PORTALS.map((portal) => (
              <Link
                key={portal.role}
                href={portal.href}
                className="group flex items-center gap-4 rounded-2xl border border-surface-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-gold-300 transition-all"
              >
                <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${portal.gradient} shadow-lg`}>
                  {portal.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-heading text-lg font-bold text-surface-900">{portal.title}</h2>
                  <p className="text-sm text-surface-500 truncate">{portal.subtitle}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-surface-400 group-hover:text-gold-600 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function SignInPage() {
  return <Suspense fallback={null}><SignInContent /></Suspense>;
}
