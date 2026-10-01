import Image from "next/image";
import type { Segment } from "@/content/segments";
import { CtaLink } from "@/components/ui/CtaLink";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { Section } from "@/components/ui/Section";
import { ArrowRightIcon } from "@/components/ui/icons";
import { DashedCurve, Glow, IsoBuilding, StickyNote } from "@/components/doodles/Doodles";
import { ROOM_CLIPS, VideoPolaroid } from "@/components/doodles/VideoTiles";
import { AutoplayClip } from "@/components/ui/AutoplayClip";

export function ProjectTypes({ segments }: { segments: Segment[] }) {
  return (
    <Section
      id="projects"
      eyebrow="Project types"
      title="Whatever you're launching, buyers see it finished."
      intro="Each film is planned around who you're selling to home buyers, tenants, investors or approval boards."
      aside={
        <div className="relative h-44 w-80 xl:w-[38rem]">
          <VideoPolaroid clip={ROOM_CLIPS.bedroom} className="absolute -top-12 left-0 hidden w-56 -rotate-3 xl:block" />
          <IsoBuilding className="absolute -top-10 right-36 w-44" />
          <StickyNote tone="yellow" className="absolute top-12 right-0 size-28 animate-sway [--r:6deg]">
            Walk it before it&apos;s built
          </StickyNote>
        </div>
      }
      decor={
        <>
          <Glow className="absolute top-1/3 left-0 size-[36rem]" />
          <DashedCurve className="absolute bottom-4 left-6 hidden w-64 opacity-60 min-[1600px]:block" />
        </>
      }
    >
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {segments.map((s) => (
          <li key={s.slug} className="flex flex-col overflow-hidden rounded-card border border-line bg-paper-raised">
            <div className="relative aspect-[4/3]">
              {s.clip ? (
                <AutoplayClip src={s.clip} poster={s.poster} label={s.title} />
              ) : s.poster ? (
                <Image src={s.poster} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
              ) : (
                <MediaPlaceholder label={s.projectType} />
              )}
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h3 className="font-display text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 flex-1 text-ink-soft">{s.pitch}</p>
              <CtaLink
                location="project_card"
                projectType={s.projectType}
                variant="link"
                className="mt-6 self-start"
              >
                {s.cta} <ArrowRightIcon width={16} height={16} />
              </CtaLink>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
