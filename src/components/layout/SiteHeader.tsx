"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronDown, GraduationCap, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";

const navLinks = [
  { label: "Colleges", href: "#colleges" },
  { label: "How it works", href: "/journey" },
  { label: "Scholarships", href: "/scholarship" },
  { label: "Fees & Placements", href: "#colleges" },
];

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="Orion Education Home">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient shadow-lg shadow-brand-950/20 ring-1 ring-white/10">
        <svg className="h-5 w-5 text-gold-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M21 2a3 3 0 0 0-3.1 3.5l-4 4a2 2 0 0 0-2.1 1l-4.7 4.7a2 2 0 1 0 1.4 1.4l4.7-4.7a2 2 0 0 0 1-2.1l4-4A3 3 0 0 0 21 2Z" />
          <path d="M3 15l3 2 1-3 2-1-2 1 1 3 3 1-3-2-1 3-2-1 1-3-2 1-1-3Z" opacity="0.7" />
        </svg>
      </div>
      <span className="font-display text-2xl font-bold tracking-tight text-surface-900">
        Orion<span className="text-gold-600"> Education</span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const authUser = useAppStore((s) => s.authUser);
  const signOut = useAppStore((s) => s.signOut);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false); }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-surface-200 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <div className="hidden lg:flex lg:items-center lg:gap-8">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="text-sm font-medium text-surface-600 transition-colors hover:text-gold-600">
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {!authUser ? (
            <>
              <Link href="/auth/sign-in">
                <Button variant="gold" size="sm">
                  Student Sign In
                </Button>
              </Link>
            </>
          ) : (
            <div className="relative flex items-center gap-2" ref={menuRef}>
              <Link href="/student/dashboard" className="hidden sm:block">
                <Button variant="outline" size="sm" className="border-surface-300 text-surface-900 hover:border-gold-500 hover:text-gold-700">
                  Student Portal
                </Button>
              </Link>
              <button
                className="flex items-center gap-1.5 rounded-full border border-surface-200 bg-white px-3 py-1.5 text-sm font-semibold text-surface-900 shadow-sm hover:bg-surface-50"
                onClick={() => setMenuOpen((v) => !v)}
              >
                <User className="h-4 w-4 text-gold-600" />
                <span className="max-w-[120px] truncate">{authUser.name.split(" ")[0]}</span>
                <ChevronDown className={cn("h-4 w-4 text-surface-400 transition-transform", menuOpen && "rotate-180")} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-2xl border border-surface-200 bg-white p-2 shadow-float">
                  <Link href="/student/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-surface-700 hover:bg-gold-50"><GraduationCap className="h-4 w-4 text-gold-600" /> Student Portal</Link>
                  <Link href="/student/vouchers" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-surface-700 hover:bg-gold-50"><GraduationCap className="h-4 w-4 text-gold-600" /> My Vouchers</Link>
                  <Link href="/student/applications" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-surface-700 hover:bg-gold-50"><GraduationCap className="h-4 w-4 text-gold-600" /> My Applications</Link>
                  <Link href="/student/saved-colleges" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-surface-700 hover:bg-gold-50"><GraduationCap className="h-4 w-4 text-gold-600" /> Saved Colleges</Link>
                  <div className="my-1 h-px bg-surface-200" />
                  <button onClick={() => { signOut(); setMenuOpen(false); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"><LogOut className="h-4 w-4" /> Sign Out</button>
                </div>
              )}
            </div>
          )}
          <button
            className="lg:hidden rounded-lg p-2 text-surface-700 transition-colors hover:bg-surface-100"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <div className={cn("lg:hidden border-t border-surface-200 bg-white", open ? "block" : "hidden")}>
        <div className="space-y-1 px-4 py-3">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium text-surface-700 hover:bg-surface-100">
              {link.label}
            </a>
          ))}
          {authUser ? (
            <>
              <Link href="/student/dashboard" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium text-surface-700 hover:bg-surface-100">Student Portal</Link>
              <button onClick={() => { signOut(); setOpen(false); }} className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50">Sign Out</button>
            </>
          ) : (
            <>
              <Link href="/auth/sign-in" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium text-surface-700 hover:bg-surface-100">Student Sign In</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
