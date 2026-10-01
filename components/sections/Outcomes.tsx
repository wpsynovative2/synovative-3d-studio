import { CtaLink } from "@/components/ui/CtaLink";
import { Section, SectionCta } from "@/components/ui/Section";
import { DashedCurve, Glow, StickyNote } from "@/components/doodles/Doodles";
import { ROOM_CLIPS, VideoPolaroid } from "@/components/doodles/VideoTiles";

const OUTCOMES = [
  {
    title: "Sell before construction",
    body: "Pre-launch and under-construction buyers see the finished project the lobby, the view from the 22nd floor, the clubhouse at dusk.",
  },
  {
    title: "Convert more site visits",
    body: "Your sales team pitches with a film, not a floor plan. Buyers understand the layout in two minutes instead of twenty.",
  },
  {
    title: "One asset, every channel",
    body: "The same film cuts down for Meta and Google ads, Reels, sales-gallery screens and channel-partner WhatsApp groups.",
  },
  {
    title: "Clarity for approvals and investors",
    body: "Boards, lenders and planning authorities see scale, massing and context without reading drawings.",
  },
];

export function Outcomes() {
  return (
    <Section
      eyebrow="Why walkthroughs sell"
      title="Buyers don't read floor plans. They watch films."
      intro="A walkthrough does the selling your sample flat can't do yet."
      aside={
        <div className="relative h-52 w-96 xl:w-[34rem]">
          {/* kitchen sits in the open space left of the group (wide screens only) */}
          <VideoPolaroid clip={ROOM_CLIPS.kitchen} className="absolute -top-14 left-0 hidden w-44 -rotate-6 xl:block" />
          <VideoPolaroid clip={ROOM_CLIPS.livingRoom} className="absolute -top-4 right-0 w-64 rotate-3" />
          <StickyNote clip className="absolute top-12 right-60 size-32 animate-sway [--r:-6deg]">
            Sell it before
            <br />
            it&apos;s built
          </StickyNote>
        </div>
      }
      decor={
        <>
          <Glow className="absolute top-0 left-1/2 size-[42rem] -translate-x-1/2" />
          <DashedCurve
            className="absolute right-6 bottom-8 hidden w-80 opacity-60 min-[1600px]:block"
            d="M4 100C60 20 120 110 180 60S280 10 316 30"
          />
        </>
      }
    >
      <ul className="grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2">
        {OUTCOMES.map((o, i) => (
          <li key={o.title} className="bg-paper-raised p-8">
            <span className="grid size-9 place-items-center rounded-lg bg-accent font-display text-sm font-bold text-[#2a2135] tabular-nums">
              0{i + 1}
            </span>
            <h3 className="mt-4 font-display text-xl font-semibold">{o.title}</h3>
            <p className="mt-2 text-ink-soft">{o.body}</p>
          </li>
        ))}
      </ul>
      <SectionCta>
        <CtaLink location="outcomes">Start Selling Before Construction</CtaLink>
      </SectionCta>
    </Section>
  );
}
