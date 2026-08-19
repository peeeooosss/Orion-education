"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlobalEnquiryModal } from "./GlobalEnquiryModal";

export function GlobalEnquiryWidget() {
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* Desktop: right side, vertically centered */}
      <div className="fixed right-4 top-1/2 z-50 hidden -translate-y-1/2 sm:block">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            "flex h-16 w-16 items-center justify-center rounded-full",
            "border border-surface-200 bg-white px-3 shadow-float",
            "transition-transform duration-200 hover:scale-110"
          )}
          aria-label="Free Enquiry"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-gold-500 to-gold-600 text-brand-950 shadow-lg shadow-gold-500/30">
            <Sparkles className="h-5 w-5" />
          </div>
        </button>
        <div className="mt-2 text-center">
          <span className="block text-xs font-semibold uppercase tracking-wider text-surface-600">
            Free Enquiry
          </span>
        </div>
      </div>

      {/* Mobile: bottom-right corner */}
      <div className="fixed right-4 bottom-6 z-50 block sm:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full",
            "border border-surface-200 bg-white px-3 shadow-float",
            "transition-transform duration-200 hover:scale-110"
          )}
          aria-label="Free Enquiry"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gold-500 to-gold-600 text-brand-950 shadow-lg shadow-gold-500/30">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="sr-only">Free Enquiry</span>
        </button>
      </div>

      <GlobalEnquiryModal open={open} onOpenChange={setOpen} />
    </>
  );
}
