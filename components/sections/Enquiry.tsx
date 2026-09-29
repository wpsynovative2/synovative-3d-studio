"use client";

import { site, telHref, whatsappHref } from "@/content/site";
import { trackCall, trackWhatsApp } from "@/lib/tracking";
import { LeadForm } from "@/components/form/LeadForm";
import { ROOM_CLIPS, VideoPolaroid } from "@/components/doodles/VideoTiles";
import { DoodleLayer, Glow, PaperPlane, StickyNote, Watermark } from "@/components/doodles/Doodles";
import { ClockIcon, MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/ui/icons";

export function Enquiry() {
  const contacts = [
    site.phone && {
      icon: <PhoneIcon />,
      label: "Call",
      value: site.phone,
      href: telHref(),
      onClick: () => trackCall("enquiry"),
    },
    site.whatsapp && {
      icon: <WhatsAppIcon />,
      label: "WhatsApp",
      value: "Chat with the studio",
      href: whatsappHref(),
      onClick: () => trackWhatsApp("enquiry"),
      external: true,
    },
    site.email && { icon: <MailIcon />, label: "Email", value: site.email, href: `mailto:${site.email}` },
    site.address && { icon: <PinIcon />, label: "Studio", value: site.address },
    { icon: <ClockIcon />, label: "Working hours", value: site.hours },
  ].filter(Boolean) as {
    icon: React.ReactNode;
    label: string;
    value: string;
    href?: string;
    onClick?: () => void;
    external?: boolean;
  }[];

  return (
    <section id="enquiry" className="relative isolate bg-paper-tint px-4 pt-20 pb-40 sm:px-6 md:pt-28 md:pb-56">
      <DoodleLayer>
        <Glow className="absolute top-10 left-1/2 size-[44rem] -translate-x-1/2" />
        <Watermark className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[min(13vw,13rem)]">
          Let&apos;s build
        </Watermark>
        <StickyNote clip backNote className="absolute right-8 bottom-24 hidden size-36 animate-sway [--r:-6deg] min-[1600px]:block">
          Better films,
          <br />
          together
        </StickyNote>
      </DoodleLayer>
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        {/* Form first on mobile */}
        <div className="lg:order-2">
          <LeadForm />
        </div>

        <div className="relative lg:order-1">
          {/* sits in the open space above the heading, below the FAQ */}
          <VideoPolaroid
            clip={ROOM_CLIPS.masterBedroom}
            className="pointer-events-none absolute -top-52 left-48 -z-10 hidden w-56 -rotate-3 xl:block"
          />
          <p className="mb-3 font-display text-xs font-semibold tracking-[0.2em] text-brand uppercase">Get a quote</p>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-balance md:text-5xl">
            Tell us about your project.
          </h2>
          <p className="mt-5 max-w-md text-lg text-ink-soft">
            Share the basics and we&apos;ll call you with a timeline and a fixed quote. Drawings can be shared after the
            call.
          </p>

          {/* Sticky-note card, same treatment as the main site */}
          <div className="mt-8 max-w-xs -rotate-1 rounded-2xl bg-accent p-5 text-[#2a2135] shadow-lift-md">
            <p className="font-display text-lg font-bold">We call back within one working day.</p>
            <p className="mt-1 text-sm text-[#2a2135]/80">With a timeline and a fixed quote for your project.</p>
          </div>

          <ul className="mt-10 space-y-5">
            {contacts.map((c) => {
              const inner = (
                <>
                  <span className="grid size-11 shrink-0 place-items-center rounded-full border border-line bg-paper-raised text-brand shadow-lift-sm">
                    {c.icon}
                  </span>
                  <span>
                    <span className="block text-sm text-ink-faint">{c.label}</span>
                    <span className="block font-semibold">{c.value}</span>
                  </span>
                </>
              );
              return (
                <li key={c.label}>
                  {c.href ? (
                    <a
                      href={c.href}
                      onClick={c.onClick}
                      target={c.external ? "_blank" : undefined}
                      rel={c.external ? "noopener" : undefined}
                      className="flex items-center gap-4 hover:text-brand"
                    >
                      {inner}
                    </a>
                  ) : (
                    <div className="flex items-center gap-4">{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>

          {/* in the flow under the contacts, so it never overlaps them */}
          <PaperPlane className="pointer-events-none mt-8 hidden w-64 lg:block" />
        </div>
      </div>
    </section>
  );
}
