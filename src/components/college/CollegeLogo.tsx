"use client";

import { PartnerProfileImage } from "@/data/partner-profiles";

export function CollegeLogo({ logo, className }: { logo: PartnerProfileImage; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logo.url}
      alt={logo.alt}
      loading="lazy"
      onError={(event) => {
        event.currentTarget.style.display = "none";
      }}
      className={className}
    />
  );
}
