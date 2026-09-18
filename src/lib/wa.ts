export function waLink(phone: string, text: string): string {
  const clean = phone.replace(/[^0-9]/g, "").replace(/^91/, "");
  return `https://wa.me/${clean}?text=${encodeURIComponent(text)}`;
}

export function telLink(phone: string): string {
  return `tel:${phone.replace(/[^0-9+]/g, "")}`;
}

export const WHATSAPP_NUMBER = "917205000310";
export const WHATSAPP_GREETING =
  "Hello Orion Education! I'd like to know more about MBA/PGDM admissions and scholarships.";

export function publicWaLink(text: string = WHATSAPP_GREETING): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}