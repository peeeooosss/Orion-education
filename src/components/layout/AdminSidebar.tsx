"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ArrowLeft, LayoutDashboard, ShieldCheck, TrendingUp, Wallet, Users2, BarChart3, FileStack, Upload, IndianRupee, ChevronLeft, ChevronRight, MousePointerClick, Building2, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "next/navigation";


const navItems = [
  { title: "Master Overview", href: "/admin/dashboard", icon: LayoutDashboard, section: null },
  { title: "Enquiries & Conversions", href: "/admin/dashboard?section=analytics", icon: BarChart3, section: "analytics" },
  { title: "Scholarship Budgets", href: "/admin/budgets", icon: Wallet, section: null },
  { title: "Colleges", href: "/admin/colleges", icon: Building2, section: null },
  { title: "Agents", href: "/admin/agents", icon: Users2, section: null },
  { title: "Student RAW DATA", href: "/admin/raw-data", icon: Upload, section: null },
  { title: "Payments", href: "/admin/payments", icon: IndianRupee, section: null },
  { title: "Website Leads", href: "/admin/website-leads", icon: MousePointerClick, section: null },
  { title: "Applications Pipeline", href: "/admin/dashboard?section=applications", icon: FileStack, section: "applications" },
];

interface AdminSidebarProps {
  open: boolean;
  onToggle: () => void;
}

export function AdminSidebar({ open, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const section = searchParams.get("section");
  const signOut = useAppStore((s) => s.signOut);
  const router = useRouter();
  return (
    <aside
      className="fixed left-0 top-0 z-40 flex h-screen flex-col overflow-hidden bg-brand-950 text-white transition-[width] duration-300 ease-in-out"
      style={{ width: open ? 256 : 88 }}
    >
      <div className="flex h-[74px] shrink-0 items-center border-b border-white/10 px-4">
        <div className={cn("flex items-center gap-2", !open && "w-full justify-center")}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gold-500 to-gold-600">
            <ShieldCheck className="h-5 w-5 text-brand-950" />
          </div>
          {open && (
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-bold">Orion <span className="text-gold-400">Admin</span></p>
              <p className="flex items-center gap-1 text-[10px] text-white/50">
                <TrendingUp className="h-3 w-3 text-gold-400" /> Master Overview
              </p>
            </div>
          )}
        </div>
        <button
          onClick={onToggle}
          className="ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
        >
          {open ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      </div>

      <nav className={cn("flex-1 space-y-1 overflow-y-auto py-4", open ? "px-3" : "px-2")}>
        {navItems.map((item) => {
          const active = item.section === null ? pathname === item.href && !section : section === item.section;
          return (
            <Link
              key={item.title}
              href={item.href}
              title={item.title}
              className={cn(
                "flex items-center gap-3 rounded-md py-2.5 text-sm font-medium transition-colors",
                open ? "px-3" : "justify-center px-0",
                active ? "bg-gold-500 text-brand-950 shadow-md shadow-gold-500/20" : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", active ? "text-brand-950" : "text-gold-400")} />
              {open && item.title}
            </Link>
          );
        })}
        <div className="my-4 h-px bg-white/10" />
        <Link
          href="/"
          title="Back to Student Site"
          className={cn(
            "flex w-full items-center gap-3 rounded-md py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white",
            open ? "px-3" : "justify-center px-0"
          )}
        >
          <ArrowLeft className="h-5 w-5 shrink-0 text-gold-400" />
          {open && "Back to Student Site"}
        </Link>
      </nav>

      <div className="shrink-0 border-t border-white/10 p-4">
        <div className={cn("flex items-center gap-3", !open && "justify-center")}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold-500 to-gold-600 text-sm font-bold text-brand-950">
            S
          </div>
          {open && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">Superadmin</p>
              <p className="text-xs text-gold-400">Orion HQ</p>
            </div>
          )}
          <button
            onClick={async () => { await signOut(); router.push("/auth/sign-in"); }}
            className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/50 transition-colors hover:bg-red-500/20 hover:text-red-400", !open && "mt-2")}
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
