"use client";

import Link from "next/link";
import { ArrowLeft, BadgeCheck, ExternalLink, MapPin, PhoneCall, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CollegeLogo } from "@/components/college/CollegeLogo";

export interface CollegeCoverProps {
  name: string;
  location: string;
  region?: string;
  type?: string;
  rating?: number;
  established?: number;
  tags?: string[];
  accreditation?: string;
  isPartner: boolean;
  heroPhoto?: string | null;
  logo?: CollegeCoverLogo;
  tagline?: string;
  sourceWebsite?: string;
  onVisitWebsite?: () => void;
  onEnquire?: () => void;
  backHref?: string;
  backLabel?: string;
}

export interface CollegeCoverLogo {
  url: string;
  alt: string;
  onDark?: boolean;
}

export function CollegeCover({
  name,
  location,
  region,
  type,
  rating,
  established,
  tags,
  accreditation,
  isPartner,
  heroPhoto,
  logo,
  tagline,
  sourceWebsite,
  onVisitWebsite,
  onEnquire,
  backHref = "/#colleges",
  backLabel = "All colleges",
}: CollegeCoverProps) {
  return (
    <div className="space-y-5">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-surface-500 transition-colors hover:text-brand-700"
      >
        <ArrowLeft className="h-4 w-4" /> {backLabel}
      </Link>

      <div className="relative overflow-hidden rounded-3xl">
        {heroPhoto ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroPhoto}
              alt={`${name} campus`}
              className="w-full object-cover"
              style={{ aspectRatio: "5/1", minHeight: "120px" }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = "flex";
              }}
            />
            <div
              className="hidden w-full items-center justify-center rounded-3xl bg-gradient-to-br from-brand-800 via-brand-700 to-indigo-800"
              style={{ aspectRatio: "5/1", minHeight: "120px" }}
            >
              <p className="text-lg font-bold text-white/60">{name}</p>
            </div>
          </>
        ) : (
          <div
            className={`flex w-full items-center justify-center rounded-3xl ${isPartner ? "bg-gradient-to-br from-blue-800 via-blue-700 to-indigo-800" : "bg-gradient-to-br from-brand-800 via-brand-700 to-indigo-800"}`}
            style={{ aspectRatio: "5/1", minHeight: "120px" }}
          >
            <p className="text-lg font-bold text-white/60">{name}</p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        {logo && (
          <div className="shrink-0">
            {logo.onDark ? (
              <CollegeLogo logo={logo} className="h-16 w-16 rounded-2xl object-contain shadow-md sm:h-20 sm:w-20" />
            ) : (
              <div className="rounded-2xl bg-white p-2 shadow-md">
                <CollegeLogo logo={logo} className="h-14 w-14 object-contain sm:h-16 sm:w-16" />
              </div>
            )}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {isPartner && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-200">
                <BadgeCheck className="h-3.5 w-3.5" /> Orion Partner
              </span>
            )}
            {region && (
              <span className="rounded-full bg-surface-100 px-3 py-1 text-xs font-semibold text-surface-600">{region}</span>
            )}
          </div>

          <h1 className="mt-2 font-display text-2xl font-black tracking-tight text-brand-950 sm:text-3xl lg:text-4xl">
            {name}
          </h1>

          <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-surface-600">
            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-surface-400" /> {location}</span>
            {rating != null && rating > 0 && (
              <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-gold-400 text-gold-500" /> {rating.toFixed(1)}</span>
            )}
            {type && <span>{type}</span>}
            {established && <span>Est. {established}</span>}
            {accreditation && <span className="text-surface-500">{accreditation}</span>}
          </p>

          {tags && tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span key={tag} className="rounded-full border border-surface-200 bg-surface-50 px-2.5 py-1 text-[11px] font-semibold text-surface-600">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {tagline && (
            <p className="mt-3 flex items-start gap-2 max-w-2xl text-sm font-semibold text-gold-700">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {tagline}
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {sourceWebsite && onVisitWebsite && (
              <Button variant="outline" size="sm" className="!h-9 !px-4 !text-xs" onClick={onVisitWebsite}>
                <ExternalLink className="h-3.5 w-3.5" /> Visit Website
              </Button>
            )}
            {onEnquire && (
              <Button variant="gold" size="sm" className="!h-9 !px-4 !text-xs" onClick={onEnquire}>
                <PhoneCall className="h-3.5 w-3.5" /> Enquire Now
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
