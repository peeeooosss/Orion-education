"use client";

import * as React from "react";
import { IndianRupee, Timer, Target, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { College } from "@/store/types";

const INTEREST_RATE = 0.10;

function emi(principal: number, tenureYears: number): number {
  const n = tenureYears * 12;
  const r = INTEREST_RATE / 12;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export function ROICalculator({ college }: { college: College }) {
  const [programIdx, setProgramIdx] = React.useState(0);
  const [loanPct, setLoanPct] = React.useState(80);
  const [tenure, setTenure] = React.useState(5);

  const program = college.programs[programIdx];
  const totalCost = program.annualFee * program.durationYears;
  const loanAmount = Math.round((totalCost * loanPct) / 100);
  const monthlyEmi = emi(loanAmount, tenure);
  const totalPayable = monthlyEmi * tenure * 12;
  const interest = totalPayable - loanAmount;
  const breakEvenYears = totalCost / program.avgPlacement;
  const salaryMultiple = program.avgPlacement / program.annualFee;

  return (
    <Card className="rounded-3xl border border-white/60 bg-white/60 p-8 shadow-glass backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-surface-800">
          <TrendingUp className="h-4 w-4 text-gold-700" strokeWidth={1.75} />
          ROI Calculator — Fee vs. Placement
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {college.programs.map((p, i) => (
            <button
              key={p.name}
              onClick={() => setProgramIdx(i)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                i === programIdx
                  ? "bg-brand-950 text-gold-500 shadow-md shadow-gold-500/30"
                  : "bg-surface-50 text-surface-600 hover:bg-surface-100"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-surface-50 p-4">
            <p className="flex items-center gap-1 text-xs text-surface-500">
              <IndianRupee className="h-3 w-3" strokeWidth={1.75} /> Annual fee
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-surface-900">
              ₹{(program.annualFee / 100000).toFixed(2)}L
            </p>
          </div>
          <div className="rounded-2xl bg-gold-50 p-4">
            <p className="flex items-center gap-1 text-xs text-gold-700">
              <Target className="h-3 w-3" strokeWidth={1.75} /> Avg placement
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-gold-700">
              ₹{(program.avgPlacement / 100000).toFixed(1)}L
            </p>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-surface-200 p-4">
          <div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-surface-700">Education loan</span>
              <span className="font-bold text-surface-900">{loanPct}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={loanPct}
              onChange={(e) => setLoanPct(Number(e.target.value))}
              className="mt-2 w-full accent-gold-600"
              aria-label="Loan percentage"
            />
          </div>
          <div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1 font-medium text-surface-700">
                <Timer className="h-4 w-4" strokeWidth={1.75} /> Repayment tenure
              </span>
              <span className="font-bold text-surface-900">{tenure} years</span>
            </div>
            <input
              type="range"
              min={3}
              max={10}
              step={1}
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              className="mt-2 w-full accent-gold-600"
              aria-label="Repayment tenure"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-brand-950 p-4 text-white">
            <p className="text-xs text-white/60">EMI / month</p>
            <p className="mt-1 font-display text-2xl font-bold text-gold-400">
              ₹{Math.round(monthlyEmi).toLocaleString("en-IN")}
            </p>
            <p className="mt-1 text-[10px] text-white/50">Total payable: ₹{Math.round(totalPayable).toLocaleString("en-IN")} · Interest: ₹{Math.round(interest).toLocaleString("en-IN")}</p>
          </div>
          <div className="rounded-2xl border border-gold-200 bg-gold-50/60 p-4">
            <p className="text-xs text-gold-700">Break-even</p>
            <p className="mt-1 font-display text-2xl font-bold text-gold-700">
              {breakEvenYears.toFixed(1)} yrs
            </p>
            <p className="mt-1 text-[10px] text-surface-600">Salary multiple: {salaryMultiple.toFixed(1)}×</p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-2xl bg-surface-50 p-4 text-xs text-surface-600">
          <Badge variant="gold" className="mt-0.5 shrink-0 bg-gold-100 text-gold-700">Orion take</Badge>
          <p>
            With an assured scholarship, your effective first-year cost drops by up to{" "}
            <span className="font-bold text-surface-900">₹60,000</span> and break-even improves by
            roughly {Math.round((breakEvenYears * 12) / 10)} months.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
