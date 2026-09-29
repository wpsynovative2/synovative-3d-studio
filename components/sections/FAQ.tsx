import { faqs } from "@/content/faq";
import { AccordionItem } from "@/components/ui/Accordion";
import { CtaLink } from "@/components/ui/CtaLink";
import { Section } from "@/components/ui/Section";
import { DashedCurve, IdeaPaper, StickyNote } from "@/components/doodles/Doodles";
import { ROOM_CLIPS, VideoPolaroid } from "@/components/doodles/VideoTiles";

export function FAQ() {
  return (
    <Section
      id="faq"
      eyebrow="FAQ"
      title="Questions developers ask us."
      className="bg-paper-tint"
      aside={
        // sits in the open space right of the heading, above the accordion
        <div className="relative h-24 w-[38rem]">
          <VideoPolaroid clip={ROOM_CLIPS.bathroom} className="absolute -top-20 left-0 hidden w-60 rotate-3 xl:block" />
        </div>
      }
    >
      <div className="grid gap-12 lg:grid-cols-[1fr_17rem]">
        <div className="border-t border-line">
          {faqs.map((f) => (
            <AccordionItem key={f.q} title={f.q}>
              <p>
                {f.a}{" "}
                <CtaLink location="faq" variant="link">
                  Get a quote →
                </CtaLink>
              </p>
            </AccordionItem>
          ))}
        </div>

        {/* Doodle column (desktop only) */}
        <div aria-hidden className="relative hidden lg:block">
          <IdeaPaper note="ask us anything" className="w-full rotate-3" />
          <DashedCurve className="-mt-2 ml-4 w-44 opacity-60" d="M20 4C10 40 90 40 120 70s-40 40 10 46" />
          <StickyNote tone="yellow" className="mt-2 ml-14 size-36 animate-sway [--r:-5deg]">
            Drawings can wait till after the call
          </StickyNote>
        </div>
      </div>
    </Section>
  );
}
