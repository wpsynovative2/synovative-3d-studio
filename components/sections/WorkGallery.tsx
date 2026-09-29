"use client";

import { useState } from "react";
import { WORK_FILTERS, projects, type WorkCategory } from "@/content/projects";
import { Chip } from "@/components/ui/Chip";
import { CtaLink } from "@/components/ui/CtaLink";
import { Section, SectionCta } from "@/components/ui/Section";
import { VideoCard } from "@/components/ui/VideoCard";
import { VideoLightbox, type LightboxVideo } from "@/components/ui/VideoLightbox";
import { CameraPath, FloorPlanPaper, Watermark } from "@/components/doodles/Doodles";

export function WorkGallery() {
  const [filter, setFilter] = useState<WorkCategory | "All">("All");
  const [open, setOpen] = useState<LightboxVideo | null>(null);
  const shown = filter === "All" ? projects : projects.filter((p) => p.category === filter);
  // Only offer filters that have films in them.
  const filters = WORK_FILTERS.filter((f) => f.value === "All" || projects.some((p) => p.category === f.value));

  return (
    <Section
      id="work"
      eyebrow="Showreel"
      title="Film that sells the space, not the camera."
      intro="A selection of recent walkthroughs. Tap any film to watch it in full."
      className="bg-paper-tint"
      aside={<CameraPath className="-mt-2 w-80" />}
      decor={
        <>
          <FloorPlanPaper className="absolute top-16 left-6 hidden w-48 -rotate-6 min-[1600px]:block" />
          <Watermark className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[min(12vw,13rem)]">Walkthrough</Watermark>
        </>
      }
    >
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by project type">
        {filters.map((f) => (
          <Chip key={f.value} active={filter === f.value} onClick={() => setFilter(f.value)}>
            {f.label}
          </Chip>
        ))}
      </div>

      <ul className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => (
          <li key={p.id}>
            <VideoCard
              title={p.name}
              meta={[p.category, p.city].filter(Boolean).join(" · ")}
              poster={p.poster}
              preview={p.preview}
              duration={p.duration}
              onPlay={() =>
                setOpen({
                  id: p.id,
                  title: [p.name, p.city].filter(Boolean).join(" — "),
                  src: p.src,
                  poster: p.poster,
                  category: p.category,
                })
              }
            />
          </li>
        ))}
      </ul>

      <SectionCta>
        <CtaLink location="gallery">Want one like this? Get a Quote</CtaLink>
      </SectionCta>

      <VideoLightbox video={open} onClose={() => setOpen(null)} ctaLocation="gallery" />
    </Section>
  );
}
