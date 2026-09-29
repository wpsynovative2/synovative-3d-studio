import { CtaLink } from "@/components/ui/CtaLink";
import { Section, SectionCta } from "@/components/ui/Section";
import { CheckIcon } from "@/components/ui/icons";
import { Glow, Pencil, SetSquare } from "@/components/doodles/Doodles";
import { ROOM_CLIPS, VideoPolaroid } from "@/components/doodles/VideoTiles";

const STEPS = [
  {
    title: "Share drawings and brief",
    body: "CAD, elevations or floor plans, plus who you're selling to and your launch date.",
    signOff: false,
  },
  {
    title: "3D modelling and material approval",
    body: "We build the model and send clay and material views for sign-off.",
    signOff: true,
  },
  {
    title: "Lighting, landscape and camera path",
    body: "You approve the mood, time of day and every camera move before rendering.",
    signOff: true,
  },
  {
    title: "Animation and render",
    body: "Final-quality frames rendered on our farm.",
    signOff: false,
  },
  {
    title: "Edit, music, voice-over, revisions",
    body: "Cut, graded and branded, with a revision round built in.",
    signOff: true,
  },
  {
    title: "Final delivery in all formats",
    body: "4K master, ad and Reels cut-downs, and still frames.",
    signOff: false,
  },
];

const TIMELINES = [
  { size: "Single villa or bungalow", time: "2–3", unit: "weeks" },
  { size: "One residential or commercial tower", time: "3–4", unit: "weeks" },
  { size: "Multi-tower project with interiors", time: "4–6", unit: "weeks" },
  { size: "Township or master plan", time: "5–8", unit: "weeks" },
];

export function Process() {
  return (
    <Section
      id="process"
      eyebrow="Process"
      title="From drawings to launch film in six steps."
      intro="You approve at every stage, so there are no surprises in the final cut."
      aside={
        <div className="relative h-44 w-72 xl:w-[30rem]">
          <VideoPolaroid clip={ROOM_CLIPS.spaBathroom} className="absolute -top-12 right-0 hidden w-56 rotate-3 xl:block" />
          <SetSquare className="absolute -top-2 right-16 w-36 rotate-12 xl:right-60 xl:w-28" />
          <Pencil className="absolute top-24 right-0 w-56 -rotate-[20deg] xl:right-44 xl:w-44" />
        </div>
      }
      decor={
        <>
          <Glow className="absolute right-0 bottom-10 size-[36rem]" />
        </>
      }
    >
      <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {STEPS.map((s, i) => (
          <li
            key={s.title}
            className="group relative flex flex-col overflow-hidden rounded-card border border-line bg-paper-raised p-6 shadow-lift-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lift-md"
          >
            {/* oversized step number watermark */}
            <span
              aria-hidden
              className="pointer-events-none absolute -top-4 -right-1 font-display text-[7rem] leading-none font-bold text-brand-wash transition-colors group-hover:text-accent-wash"
            >
              {i + 1}
            </span>

            <span className="relative grid size-11 place-items-center rounded-xl bg-accent font-display text-base font-bold text-[#2a2135] shadow-lift-accent">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="relative mt-5 font-display text-lg font-semibold">
              {s.title}
            </h3>
            <p className="relative mt-2 flex-1 text-ink-soft">{s.body}</p>
            {s.signOff && (
              <span className="relative mt-5 inline-flex items-center gap-1.5 self-start rounded-full bg-brand-wash px-3 py-1 font-display text-xs font-semibold text-brand">
                <CheckIcon width={14} height={14} /> Your sign-off
              </span>
            )}
          </li>
        ))}
      </ol>
      <SectionCta>
        <CtaLink location="process">Send Us Your Drawings</CtaLink>
        <p className="text-sm text-ink-soft">Drawings can be shared after the call.</p>
      </SectionCta>
    </Section>
  );
}
