import Link from "next/link";
import { formatPhone, site, telHref } from "@/content/site";
import { Logo } from "./Logo";

export function SiteFooter() {
  const socials = site.social.filter((s) => s.href);
  return (
    <footer className="bg-brand-surface-deep px-4 pt-16 pb-28 text-white sm:px-6 md:pb-12">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <Logo onDark />
          <p className="mt-4 max-w-sm text-sm text-white/70">
            Photoreal 3D walkthrough films for real-estate developers, builders and architects across Mumbai and
            India. {site.tagline}
          </p>
        </div>

        <div className="text-sm">
          <p className="font-display text-xs font-semibold tracking-[0.22em] text-accent uppercase">Contact</p>
          <ul className="mt-3 space-y-2 text-white/70">
            {site.phone && (
              <li>
                <a href={telHref()} className="transition-colors hover:text-accent">
                  {formatPhone()}
                </a>
              </li>
            )}
            {site.email && (
              <li>
                <a href={`mailto:${site.email}`} className="transition-colors hover:text-accent">
                  {site.email}
                </a>
              </li>
            )}
            {site.address && <li>{site.address}</li>}
            <li>{site.hours}</li>
          </ul>
        </div>

        <div className="text-sm">
          <p className="font-display text-xs font-semibold tracking-[0.22em] text-accent uppercase">More</p>
          <ul className="mt-3 space-y-2 text-white/70">
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener" className="transition-colors hover:text-accent">
                  {s.label}
                </a>
              </li>
            ))}
            {/* <li>
              <a href={site.mainSiteUrl} className="transition-colors hover:text-accent">
                synovative.in
              </a>
            </li> */}
            <li>
              <Link href="/privacy" className="transition-colors hover:text-accent">
                Privacy policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-6xl border-t border-white/10 pt-6 text-xs text-white/60">
        © {new Date().getFullYear()} {site.name}. All rights reserved.
      </p>
    </footer>
  );
}
