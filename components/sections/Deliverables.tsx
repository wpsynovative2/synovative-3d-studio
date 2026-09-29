import { CtaLink } from "@/components/ui/CtaLink";
import { Section, SectionCta } from "@/components/ui/Section";
import { CheckIcon } from "@/components/ui/icons";
import { Pencil, Ruler, SwatchFan } from "@/components/doodles/Doodles";
import { PhoneReel } from "@/components/doodles/VideoTiles";

const DELIVERABLES = [
  { title: "Exterior walkthrough film", note: "60–120 seconds, 4K master" },
  { title: "Interior walkthrough", note: "Sample flat or show unit" },
  { title: "Aerial flythrough", note: "Plus master-plan animation" },
  { title: "Amenity and lifestyle shots", note: "Pool, clubhouse, landscape, people" },
  { title: "Vertical cut-downs", note: "9:16 and 1:1 for Reels, Shorts and ads" },
  { title: "Still renders", note: "Extra frames from the same scenes" },
  { title: "Voice-over, music and branding", note: "Logo, RERA details, end card" },
];

export function Deliverables() {
  return (
    <Section
      eyebrow="What you get"
      title="One production. Everything your launch needs."
      intro="Every package is built from a single 3D scene, so every format matches."
      className="bg-paper-tint"
      aside={<SwatchFan className="-mt-10 w-56" />}
      decor={
        <>
          <Ruler className="absolute top-40 right-6 hidden w-48 -rotate-[20deg] min-[1600px]:block" />
          <Pencil className="absolute bottom-24 left-6 hidden w-48 rotate-12 min-[1600px]:block" />
        </>
      }
    >
      <div className="grid items-start gap-12 lg:grid-cols-[1fr_16rem]">
      <ul className="grid gap-4 sm:grid-cols-2">
        {DELIVERABLES.map((d) => (
          <li key={d.title} className="flex gap-4 rounded-card border border-line bg-paper-raised p-5">
            <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-accent text-[#2a2135]">
              <CheckIcon width={16} height={16} />
            </span>
            <div>
              <p className="font-semibold">{d.title}</p>
              <p className="text-sm text-ink-soft">{d.note}</p>
            </div>
          </li>
        ))}
      </ul>

      {/* The 9:16 cut-down, shown where it lives: on a phone */}
      <div className="relative mx-auto w-[min(20rem,82vw)] lg:w-full">
        <p aria-hidden className="mb-3 -rotate-3 text-center font-hand text-xl text-brand">
          your Reels cut-down ↓
        </p>
        <PhoneReel src="/videos/web/reel-what-you-get.mp4" poster="/videos/web/reel-what-you-get.jpg" className="rotate-2" />
      </div>
      </div>
      <SectionCta>
        <CtaLink location="deliverables">Get the Full Package Quote</CtaLink>
      </SectionCta>
    </Section>
  );
}
