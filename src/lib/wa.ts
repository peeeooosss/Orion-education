export function waLink(phone: string, text: string): string {
  const clean = phone.replace(/[^0-9]/g, "").replace(/^91/, "");
  return `https://wa.me/${clean}?text=${encodeURIComponent(text)}`;
}

export function telLink(phone: string): string {
  return `tel:${phone.replace(/[^0-9+]/g, "")}`;
}
