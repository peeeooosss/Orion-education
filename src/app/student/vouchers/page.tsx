"use client";

import Link from "next/link";
import { Clock, GraduationCap, TicketPercent, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAppStore, formatINR } from "@/store/useAppStore";

function hoursLeft(issuedAt: string): number {
  const diff = new Date().getTime() - new Date(issuedAt).getTime();
  return Math.max(0, Math.round(48 - diff / 3600000));
}

export default function StudentVouchersPage() {
  const profile = useAppStore((s) => s.studentProfile);
  const vouchers = useAppStore((s) => s.vouchers).filter((voucher) => voucher.phone === profile.phone);
  const totalValue = vouchers.reduce((sum, voucher) => sum + voucher.amount, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-gold-700">Scholarship wallet</p>
          <h1 className="mt-1 font-display text-3xl font-black text-brand-950">My vouchers</h1>
          <p className="mt-2 text-sm text-surface-600">Your claimed and active Orion scholarship benefits in one place.</p>
        </div>
        <Link href="/scholarship" className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-950 px-4 py-2.5 text-sm font-semibold text-gold-400 transition-colors hover:bg-brand-800">
          <TicketPercent className="h-4 w-4" /> Check another scholarship
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total vouchers", value: String(vouchers.length), icon: TicketPercent },
          { label: "Scholarship value", value: formatINR(totalValue), icon: Wallet },
          { label: "Active benefits", value: String(vouchers.filter((voucher) => voucher.status === "Active").length), icon: GraduationCap },
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
          <p className="mt-3 text-sm font-medium text-surface-600">No vouchers yet.</p>
          <Link href="/scholarship" className="mt-2 inline-block text-sm font-semibold text-gold-700 hover:underline">Check your eligibility →</Link>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {vouchers.map((voucher) => {
            const left = hoursLeft(voucher.issuedAt);
            const claimed = voucher.status === "Claimed";
            return (
              <div key={voucher.id} className={`relative overflow-hidden rounded-3xl border p-6 ${claimed ? "border-surface-200 bg-surface-50" : "border-gold-200 bg-white shadow-card"}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${claimed ? "bg-surface-200 text-surface-500" : "bg-brand-gradient text-gold-500"}`}><GraduationCap className="h-6 w-6" /></div>
                    <div><p className="font-semibold text-surface-900">{voucher.college}</p><p className="text-xs text-surface-500">{voucher.program}</p></div>
                  </div>
                  <p className="font-display text-2xl font-black text-gold-700">{formatINR(voucher.amount)}</p>
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-surface-200 pt-4">
                  <p className="font-mono text-[11px] text-surface-400">#{voucher.code}</p>
                  {claimed ? <Badge variant="secondary">Claimed</Badge> : <Badge variant="gold" className="bg-gold-100 text-gold-700"><Clock className="mr-1 h-3 w-3" /> {left}h left</Badge>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
