"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlobalEnquiryModal } from "./GlobalEnquiryModal";

export function GlobalEnquiryWidget() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="pointer-events-none fixed inset-y-0 right-0 top-0 flex items-center">
        <div
          className={cn(
            "pointer-events-auto mr-3 flex -translate-y-1/2 flex-col items-center justify-center gap-2 rounded-2xl border border-surface-200 bg-white px-3 py-4 shadow-float transition-all duration-300 hover:translate-y-0 hover:scale-105"
          )}
        >
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex flex-col items-center justify-center gap-1 text-center"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-gold-500 to-gold-600 text-brand-950 shadow-lg shadow-gold-500/30">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="block text-xs font-semibold uppercase tracking-wider text-surface-600">
              Free Enquiry
            </span>
          </button>
        </div>
      </div>
      <div className="fixed inset-0 z-50" />
      <div className="fixed right-4 top-20 z-50 hidden sm:block w-80">
        <div className="flex flex-col items-center gap-1 rounded-2xl border border-surface-200 bg-white px-3 py-3 shadow-float text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gold-500 to-gold-600 text-brand-950">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-surface-600">
            Free Enquiry
          </span>
        </div>
      </div>

      <div className="fixed right-4 top-20 z-50 sm:hidden">
        <div className="flex items-center gap-2 rounded-full border border-surface-200 bg-white px-3 py-2 shadow-float">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-gold-500 to-gold-600 text-brand-950">
            <Sparkles className="h-3 w-3" />
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="text-xs font-semibold uppercase tracking-wider text-surface-700"
          >
            Free Enquiry
          </button>
        </div>
      </div>
      <GlobalEnquiryModal open={open} onOpenChange={setOpen} />
    </>
  );
}
