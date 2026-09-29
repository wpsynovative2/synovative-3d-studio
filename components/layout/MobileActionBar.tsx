"use client";

import { useEffect, useState } from "react";
import { telHref, whatsappHref } from "@/content/site";
import { trackCall, trackCta, trackWhatsApp } from "@/lib/tracking";
import { useEnquiry } from "@/components/form/EnquiryContext";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/icons";

/** Bottom bar on mobile: visible after the hero, hidden while the form is in view. */
export function MobileActionBar() {
  const { openEnquiry, isOpen } = useEnquiry();
  const [pastHero, setPastHero] = useState(false);
  const [formInView, setFormInView] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    const form = document.getElementById("enquiry");
    const observers: IntersectionObserver[] = [];
    if (hero) {
      const o = new IntersectionObserver(([e]) => setPastHero(!e.isIntersecting), { threshold: 0.15 });
      o.observe(hero);
      observers.push(o);
    }
    if (form) {
      const o = new IntersectionObserver(([e]) => setFormInView(e.isIntersecting), { threshold: 0.1 });
      o.observe(form);
      observers.push(o);
    }
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const visible = pastHero && !formInView && !isOpen;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!visible}
      inert={!visible}
    >
      <div className="grid grid-cols-3 gap-2 p-2 text-sm font-semibold">
        <a
          href={telHref()}
          onClick={() => trackCall("mobile_bar")}
          className="btn-motion flex h-12 items-center justify-center gap-2 rounded-full border border-line"
        >
          <PhoneIcon width={18} height={18} /> Call
        </a>
        <a
          href={whatsappHref()}
          target="_blank"
          rel="noopener"
          onClick={() => trackWhatsApp("mobile_bar")}
          className="btn-motion flex h-12 items-center justify-center gap-2 rounded-full border border-line"
        >
          <WhatsAppIcon width={18} height={18} className="text-[#25d366]" /> WhatsApp
        </a>
        <button
          type="button"
          onClick={() => {
            trackCta("mobile_bar");
            openEnquiry();
          }}
          className="btn-motion flex h-12 items-center justify-center rounded-full bg-accent text-[#2a2135] shadow-lift-accent"
        >
          Get a Quote
        </button>
      </div>
    </div>
  );
}
