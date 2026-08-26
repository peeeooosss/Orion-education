"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronDown, GraduationCap, LogOut, User, Headset, ShieldCheck, Trophy, Images, Info } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { useEnquiryStore } from "@/store/useEnquiryStore";
import { GlobalEnquiryModal } from "@/components/homepage/GlobalEnquiryModal";
import { useRouter } from "next/navigation";

const navLinks = [
  { label: "Colleges", href: "/#colleges" },
  { label: "How it works", href: "/journey" },
  { label: "Scholarships", href: "/scholarship" },
];

const aboutLinks = [
  { label: "About Us", href: "/about", desc: "Our story & mission", icon: Info },
  { label: "Achievements", href: "/achievements", desc: "Milestones & success stories", icon: Trophy },
  { label: "Gallery", href: "/gallery", desc: "Events & campus visits", icon: Images },
];

const PORTAL_LINKS: Record<string, { href: string; label: string; icon: typeof GraduationCap; links: { label: string; href: string }[] }> = {
  student: {
    href: "/student/dashboard",
    label: "Student Portal",
    icon: GraduationCap,
    links: [
      { label: "Student Portal", href: "/student/dashboard" },
      { label: "My Vouchers", href: "/student/vouchers" },
      { label: "My Applications", href: "/student/applications" },
      { label: "Saved Colleges", href: "/student/saved-colleges" },
    ],
  },
  agent: {
    href: "/agent/dashboard",
    label: "Agent Portal",
    icon: Headset,
    links: [
      { label: "Agent Portal", href: "/agent/dashboard" },
      { label: "Follow-ups", href: "/agent/follow-ups" },
      { label: "Imported Students", href: "/agent/raw-data" },
    ],
  },
  admin: {
    href: "/admin/dashboard",
    label: "Admin Panel",
    icon: ShieldCheck,
    links: [
      { label: "Admin Dashboard", href: "/admin/dashboard" },
      { label: "Agents", href: "/admin/agents" },
      { label: "Colleges", href: "/admin/colleges" },
      { label: "RAW DATA", href: "/admin/raw-data" },
    ],
  },
};

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
  const [aboutOpen, setAboutOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const authUser = useAppStore((s) => s.authUser);
  const signOut = useAppStore((s) => s.signOut);
  const enquiryOpen = useEnquiryStore((s) => s.open);
  const openEnquiry = useEnquiryStore((s) => s.openModal);
  const closeEnquiry = useEnquiryStore((s) => s.closeModal);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false); }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const portal = authUser ? PORTAL_LINKS[authUser.role] || PORTAL_LINKS.student : null;
  const PortalIcon = portal?.icon || GraduationCap;

  return (
    <header className="sticky top-0 z-40 border-b border-surface-200 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <div className="hidden lg:flex lg:items-center lg:gap-8">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} className="text-sm font-medium text-surface-600 transition-colors hover:text-gold-600">
              {link.label}
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 text-sm font-medium text-surface-600 transition-colors hover:text-gold-600 focus:outline-none">
                About Us
                <ChevronDown className="h-4 w-4 text-surface-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64 rounded-2xl p-2">
              {aboutLinks.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <Link href={link.href} className="flex cursor-pointer items-start gap-3 rounded-xl px-3 py-2.5">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold-50 text-gold-700">
                      <link.icon className="h-4 w-4" strokeWidth={1.75} />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-surface-900">{link.label}</span>
                      <span className="block text-xs text-surface-500">{link.desc}</span>
                    </span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="gold" size="sm" className="hidden uppercase tracking-wide sm:inline-flex" onClick={openEnquiry}>
            Enquire Now
          </Button>
          {!authUser ? (
            <Link href="/auth/sign-in">
              <Button variant="gold" size="sm">
                Sign In
              </Button>
            </Link>
          ) : (
            <div className="relative flex items-center gap-2" ref={menuRef}>
              <Link href={portal?.href || "/student/dashboard"} className="hidden sm:block">
                <Button variant="outline" size="sm" className="border-surface-300 text-surface-900 hover:border-gold-500 hover:text-gold-700">
                  <PortalIcon className="mr-1.5 h-3.5 w-3.5" />
                  {portal?.label || "Portal"}
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
                  {portal?.links.map((link) => (
                    <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-surface-700 hover:bg-gold-50">
                      <PortalIcon className="h-4 w-4 text-gold-600" /> {link.label}
                    </Link>
                  ))}
                  <div className="my-1 h-px bg-surface-200" />
                  <Link href="/auth/sign-in" onClick={async () => { await signOut(); setMenuOpen(false); }} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-surface-700 hover:bg-surface-100">
                    <User className="h-4 w-4 text-surface-400" /> Switch account
                  </Link>
                  <button onClick={async () => { await signOut(); setMenuOpen(false); router.push("/auth/sign-in"); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"><LogOut className="h-4 w-4" /> Sign Out</button>
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
          <button
            onClick={() => { setOpen(false); openEnquiry(); }}
            className="block w-full rounded-lg bg-brand-gradient px-3 py-2 text-left text-sm font-bold uppercase tracking-wide text-white"
          >
            Enquire Now
          </button>
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium text-surface-700 hover:bg-surface-100">
              {link.label}
            </Link>
          ))}
          <div>
            <button
              onClick={() => setAboutOpen((v) => !v)}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-surface-700 hover:bg-surface-100"
              aria-expanded={aboutOpen}
            >
              About Us
              <ChevronDown className={cn("h-4 w-4 text-surface-400 transition-transform", aboutOpen && "rotate-180")} />
            </button>
            {aboutOpen && (
              <div className="mt-1 space-y-1 pl-3">
                {aboutLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => { setOpen(false); setAboutOpen(false); }}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-surface-700 hover:bg-gold-50"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold-50 text-gold-700">
                      <link.icon className="h-4 w-4" strokeWidth={1.75} />
                    </span>
                    <span>
                      <span className="block leading-tight">{link.label}</span>
                      <span className="block text-xs font-normal text-surface-500">{link.desc}</span>
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
          {authUser ? (
            <>
              <Link href={portal?.href || "/student/dashboard"} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium text-surface-700 hover:bg-surface-100">{portal?.label || "Portal"}</Link>
              <Link href="/auth/sign-in" onClick={async () => { await signOut(); setOpen(false); }} className="block rounded-lg px-3 py-2 text-sm font-medium text-surface-700 hover:bg-surface-100">Switch account</Link>
              <button onClick={async () => { await signOut(); setOpen(false); router.push("/auth/sign-in"); }} className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50">Sign Out</button>
            </>
          ) : (
            <>
              <Link href="/auth/sign-in" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium text-surface-700 hover:bg-surface-100">Sign In</Link>
            </>
          )}
        </div>
      </div>

      <GlobalEnquiryModal open={enquiryOpen} onOpenChange={(o) => { if (!o) closeEnquiry(); }} />
    </header>
  );
}
