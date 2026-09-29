// dataLayer helpers. GTM (web) forwards these to sGTM → Meta CAPI / GA4 / Google Ads.

type DataLayerEvent = { event: string } & Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[];
  }
}

export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}

export const trackCta = (location: string, extra: Record<string, unknown> = {}) =>
  track("cta_click", { location, ...extra });

export const trackCall = (location: string) => track("call_click", { location, contact_method: "call" });

export const trackWhatsApp = (location: string) =>
  track("whatsapp_click", { location, contact_method: "whatsapp" });

export function newEventId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  // RFC4122 v4 fallback for older browsers
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (Number(c) ^ (Math.random() * 16) >> (Number(c) / 4)).toString(16),
  );
}
