"use client";

import { Headphones, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEnquiryStore } from "@/store/useEnquiryStore";

export function GlobalEnquiryWidget() {
  const openModal = useEnquiryStore((s) => s.openModal);
  return (
    <>
      {/* Desktop: right side, vertically centered */}
      <div className="fixed right-4 top-1/2 z-50 hidden -translate-y-1/2 sm:block">
        <button
          type="button"
          onClick={openModal}
          className={cn(
            "flex h-16 w-16 items-center justify-center rounded-full",
            "border border-surface-200 bg-white px-3 shadow-float",
            "transition-transform duration-200 hover:scale-110"
          )}
          aria-label="Free Enquiry"
        >
          <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 text-brand-950 shadow-lg shadow-gold-500/30 animate-pulse">
            <span className="absolute inset-0 animate-ping rounded-full bg-gold-400/50" />
            <UserRound className="relative h-6 w-6" strokeWidth={1.8} />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-brand-950 text-gold-400">
              <Headphones className="h-2.5 w-2.5" strokeWidth={2.2} />
            </span>
          </div>
        </button>
        <div className="mt-2 text-center">
          <span className="block text-[10px] font-semibold tracking-wide text-surface-600">
            Free Enquiry
          </span>
        </div>
      </div>

      {/* Mobile: bottom-right corner */}
      <div className="fixed right-4 bottom-6 z-50 block sm:hidden">
        <button
          type="button"
          onClick={openModal}
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full",
            "border border-surface-200 bg-white px-3 shadow-float",
            "transition-transform duration-200 hover:scale-110"
          )}
          aria-label="Free Enquiry"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 text-brand-950 shadow-lg shadow-gold-500/30 animate-pulse">
            <span className="absolute inset-0 animate-ping rounded-full bg-gold-400/50" />
            <UserRound className="relative h-5 w-5" strokeWidth={1.8} />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-brand-950 text-gold-400">
              <Headphones className="h-2 w-2" strokeWidth={2.2} />
            </span>
          </div>
        </button>
        <span className="mt-1 block text-center text-[9px] font-semibold tracking-wide text-surface-600">
          Free Enquiry
        </span>
      </div>
    </>
  );
}
