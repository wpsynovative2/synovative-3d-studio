// Studio-wide contact details. Phone / WhatsApp come from env so every ad variant shares one source.
export const site = {
  name: "Synovative 3D Studio",
  domain: "synovative3dstudio.in",
  url: "https://synovative3dstudio.in",
  mainSiteUrl: "https://synovative.in",
  tagline: "Film that sells the space, not the camera.",
  description:
    "Photoreal 3D walkthrough films for residential, commercial, industrial and villa projects in Mumbai and MMR — delivered in weeks, built for launch campaigns.",
  phone: process.env.NEXT_PUBLIC_PHONE_NUMBER || "",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
  email: "",
  address: "Vasai - Andheri, Mumbai, Maharashtra",
  hours: "Mon – Fri, 10:00 am – 7:00 pm",
  whatsappMessage:
    "Hi Synovative 3D Studio, I'd like a quote for a 3D walkthrough of my project.",
  social: [
    { label: "Instagram", href: "" },
    { label: "LinkedIn", href: "" },
    { label: "YouTube", href: "" },
  ],
  // Hero media — add paths / stream URLs later (.m3u8 or .mp4).
  hero: {
    poster: "/videos/web/hero-poster.jpg",
    loopSrc: "/videos/web/hero-reel.mp4", // muted loop, compressed from public/videos/assets/3D Ad Reel 2.mp4
    showreelSrc: "", // full showreel with sound
  },
  ogImage: "",
};

/** Digits with country code; a bare 10-digit Indian number gets 91 prepended. */
function intlDigits(phone: string) {
  const d = phone.replace(/\D/g, "").replace(/^0(?=\d{10}$)/, "");
  return d.length === 10 ? `91${d}` : d;
}

export function telHref(phone = site.phone) {
  return phone ? `tel:+${intlDigits(phone)}` : "#enquiry";
}

export function whatsappHref(message: string = site.whatsappMessage) {
  const n = intlDigits(site.whatsapp);
  return n
    ? `https://wa.me/${n}?text=${encodeURIComponent(message)}`
    : "#enquiry";
}

/** "9673439102" → "+91 96734 39102" for display. */
export function formatPhone(phone = site.phone) {
  const d = intlDigits(phone);
  return d.length === 12 && d.startsWith("91") ? `+91 ${d.slice(2, 7)} ${d.slice(7)}` : phone;
}
