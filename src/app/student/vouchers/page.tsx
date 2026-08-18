"use client";

import Link from "next/link";
import { CalendarDays, GraduationCap, ShieldCheck, TicketPercent, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAppStore, formatINR } from "@/store/useAppStore";

function daysUntilExpiry(expiresAt: string): number {
  const diff = new Date(expiresAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86400000));
}

export default function StudentVouchersPage() {
  const profile = useAppStore((s) => s.studentProfile);
  const authUser = useAppStore((s) => s.authUser);
  const vouchers = useAppStore((s) => s.vouchers).filter((voucher) => voucher.phone === (authUser?.phone ?? profile.phone));
  const totalValue = vouchers.reduce((sum, voucher) => sum + voucher.amount, 0);
  const activeVouchers = vouchers.filter((v) => v.status === "Active" && v.expiresAt && new Date(v.expiresAt) > new Date());

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-gold-700">Scholarship wallet</p>
          <h1 className="mt-1 font-display text-3xl font-black text-brand-950">My certificates</h1>
          <p className="mt-2 text-sm text-surface-600">Your Orion scholarship certificates — valid at all partner colleges for 6 months.</p>
        </div>
        <Link href="/scholarship" className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-950 px-4 py-2.5 text-sm font-semibold text-gold-400 transition-colors hover:bg-brand-800">
          <TicketPercent className="h-4 w-4" /> Check another scholarship
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total certificates", value: String(vouchers.length), icon: TicketPercent },
          { label: "Scholarship value", value: formatINR(totalValue), icon: Wallet },
          { label: "Active certificates", value: String(activeVouchers.length), icon: GraduationCap },
        ].map((stat) => (
          <div key={stat.label} className="flex items-center gap-4 rounded-2xl border border-surface-200 bg-white p-5 shadow-card">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-100 text-gold-700"><stat.icon className="h-5 w-5" /></div>
            <div><p className="font-display text-xl font-bold text-brand-950">{stat.value}</p><p className="text-xs text-surface-500">{stat.label}</p></div>
          </div>
        ))}
      </div>

      {vouchers.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-surface-300 bg-white p-12 text-center">
          <TicketPercent className="mx-auto h-10 w-10 text-surface-300" />
          <p className="mt-3 text-sm font-medium text-surface-600">No scholarship certificates yet.</p>
          <Link href="/scholarship" className="mt-2 inline-block text-sm font-semibold text-gold-700 hover:underline">Check your eligibility →</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {vouchers.map((voucher) => {
            const daysLeft = daysUntilExpiry(voucher.expiresAt);
            const isExpired = daysLeft === 0;
            const isClaimed = voucher.status === "Claimed";
            return (
              <div key={voucher.id} className={`relative overflow-hidden rounded-3xl border ${isClaimed || isExpired ? "border-surface-200 bg-surface-50" : "border-gold-200 bg-white shadow-lg shadow-gold-500/10"}`}>
                {/* Header */}
                <div className={`px-6 py-4 ${isClaimed || isExpired ? "bg-surface-100" : "bg-brand-gradient"} text-white`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-gold-400" />
                      <span className="text-xs font-semibold uppercase tracking-widest text-gold-300">Scholarship Certificate</span>
                    </div>
                    <span className="font-mono text-[11px] text-white/50">#{voucher.code}</span>
                  </div>
                  <p className="mt-2 text-sm text-white/60">Awarded to {voucher.studentName}</p>
                </div>

                {/* Amount */}
                <div className="px-6 py-6 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-surface-400">Assured scholarship</p>
                  <p className="mt-2 font-display text-4xl font-black text-gold-600">{formatINR(voucher.amount)}</p>
                  <div className="mt-2 flex items-center justify-center gap-2 text-sm text-surface-500">
                    <CalendarDays className="h-4 w-4" />
                    <span>Valid until {new Date(voucher.expiresAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</span>
                    <span className="text-surface-300">·</span>
                    {isExpired ? (
                      <Badge className="bg-red-100 text-red-700">Expired</Badge>
                    ) : isClaimed ? (
                      <Badge variant="secondary">Claimed</Badge>
                    ) : daysLeft <= 30 ? (
                      <Badge className="bg-red-100 text-red-700">{daysLeft} days left</Badge>
                    ) : (
                      <Badge variant="gold" className="bg-gold-100 text-gold-700">{daysLeft} days left</Badge>
                    )}
                  </div>
                </div>

                {/* Per-college breakdown */}
                {voucher.perCollegeBreakdown.length > 0 && (
                  <div className="border-t border-surface-100 px-6 py-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-surface-400">Valid at all partner colleges</p>
                    <div className="mt-3 grid gap-1.5">
                      {voucher.perCollegeBreakdown.map((c) => {
                        const isPrimary = c.collegeName === voucher.primaryCollege;
                        return (
                          <div key={c.collegeId} className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm ${isPrimary ? "bg-gold-50 ring-1 ring-gold-200" : ""}`}>
                            <div className="flex items-center gap-2">
                              {isPrimary && <span className="text-[10px] font-bold text-gold-600 uppercase">Your #1</span>}
                              <span className={isPrimary ? "font-semibold text-surface-900" : "text-surface-600"}>{c.collegeName}</span>
                            </div>
                            <span className="font-semibold text-gold-700">{formatINR(c.amount)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="border-t border-surface-100 bg-surface-50/50 px-6 py-3 flex items-center justify-between">
                  <span className="text-xs text-surface-400">{voucher.stream || voucher.program} · Orion Education</span>
                  <Link href="/scholarship" className="text-xs font-semibold text-gold-700 hover:underline">Check another scholarship →</Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
