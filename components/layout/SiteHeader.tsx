"use client";

import { useEffect, useState } from "react";
import { site, telHref } from "@/content/site";
import { trackCall } from "@/lib/tracking";
import { CtaLink } from "@/components/ui/CtaLink";
import { PhoneIcon } from "@/components/ui/icons";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  { href: "#projects", label: "Projects" },
  { href: "#work", label: "Work" },
  { href: "#process", label: "Process" },
  { href: "#faq", label: "FAQ" },
];

export function SiteHeader() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Over the hero video the header is transparent, so text stays light in both themes.
  const onDark = !solid;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        solid ? "border-b border-line bg-paper/90 shadow-lift-sm backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 transition-all sm:px-6 ${
          solid ? "h-16" : "h-20"
        }`}
      >
        <a href="#top" aria-label="Synovative 3D Studio — back to top">
          <Logo onDark={onDark} />
        </a>

        <nav aria-label="Sections" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`block rounded-full px-4 py-2 transition-colors font-display text-sm font-medium tracking-wide uppercase ${
                    onDark ? "text-white/85 hover:bg-white/10 hover:text-white" : "text-ink-soft hover:bg-brand-wash hover:text-brand"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {site.phone && (
            <a
              href={telHref()}
              onClick={() => trackCall("header")}
              className={`hidden items-center gap-2 text-sm font-semibold lg:flex ${onDark ? "text-white" : "text-ink"}`}
            >
              <PhoneIcon width={16} height={16} className={onDark ? "text-[#b9a3e0]" : "text-brand"} />
              {site.phone}
            </a>
          )}
          <ThemeToggle />
          <CtaLink location="header" size="sm" variant="accent">
            Get a Quote
          </CtaLink>
        </div>
      </div>
    </header>
  );
}
