export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://orion-nine-eta.vercel.app";

export function appUrl(path: string): string {
  return `${SITE_URL}${path}`;
}