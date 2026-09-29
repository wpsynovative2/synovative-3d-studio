"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { heroTrust } from "@/content/stats";
import type { Variant } from "@/content/variants";
import { buttonClass } from "@/components/ui/Button";
import { CtaLink } from "@/components/ui/CtaLink";
import {
  VideoLightbox,
  type LightboxVideo,
} from "@/components/ui/VideoLightbox";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { PlayIcon } from "@/components/ui/icons";

export function HeroVideo({ variant }: { variant: Variant }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [lightbox, setLightbox] = useState<LightboxVideo | null>(null);

  const loopSrc = variant.heroLoopSrc || site.hero.loopSrc;
  const poster = variant.heroPoster || site.hero.poster;

  // Always autoplay (muted + loop). play() is also called explicitly because some browsers
  // skip the autoplay attribute when the src is attached after mount (HLS via hls.js).
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !loopSrc) return;
    v.muted = true;
    const tryPlay = () => v.play().catch(() => {});
    tryPlay();
    v.addEventListener("canplay", tryPlay);
    return () => v.removeEventListener("canplay", tryPlay);
  }, [loopSrc]);

  const openShowreel = () =>
    setLightbox({
      id: "showreel",
      title: "Synovative 3D Studio — Showreel",
      src: site.hero.showreelSrc,
      poster,
    });

  const trust = heroTrust.filter((t) => t.value);

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden bg-night pt-20 text-white md:flex md:min-h-[100svh] md:items-end md:pt-0"
    >
      {/* mobile: 16:9 frame below the header; desktop: full-bleed background */}
      <div className="relative aspect-video md:absolute md:inset-0 md:-z-10 md:aspect-auto" aria-hidden>
        {poster ? (
          <Image
            src={poster}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_75%_20%,rgb(95_60_167/0.55),transparent_65%),linear-gradient(160deg,#231c30,#17131f)]" />
        )}
        {loopSrc && (
          <VideoPlayer
            ref={videoRef}
            src={loopSrc}
            poster={poster || undefined}
            muted
            autoPlay
            loop
            playsInline
            preload="auto"
            trackingId="hero_loop"
            className="absolute inset-0 size-full object-cover"
          />
        )}
        {/* <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--night)_6%,rgb(23_19_31/0.75)_45%,rgb(23_19_31/0.35)_100%)]" /> */}
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 pt-8 pb-10 empty:hidden sm:px-6 md:pt-32 md:pb-24">
        {/* <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
          3D walkthrough films · Mumbai & MMR
        </p>
        <h1 className="max-w-4xl font-display text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl md:text-7xl">
          {variant.headline}
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-white/85 text-pretty md:text-xl">{variant.subline}</p>

        <div className="mt-10 flex flex-wrap gap-3">
          <CtaLink location="hero" size="lg" variant="accent" projectType={variant.projectType}>
            Get Your Project Live in 3D
          </CtaLink>
          <button type="button" onClick={openShowreel} className={buttonClass("secondary", "lg", "!border-white/70 !text-white hover:!bg-white hover:!text-[#2a2135]")}>
            <PlayIcon width={16} height={16} /> Watch the Showreel
          </button>
        </div> */}

        {trust.length > 0 && (
          <dl className="mt-14 flex flex-wrap gap-x-12 gap-y-6 border-t border-white/15 pt-8">
            {trust.map((t) => (
              <div key={t.label}>
                <dt className="text-sm text-white/70">{t.label}</dt>
                <dd className="font-display text-3xl font-semibold">
                  {t.value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      <a
        href="#projects"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs tracking-[0.2em] text-white/70 uppercase md:flex"
      >
        Scroll
        <span className="h-10 w-px animate-pulse bg-gradient-to-b from-white/60 to-transparent" />
      </a>

      <VideoLightbox
        video={lightbox}
        onClose={() => setLightbox(null)}
        ctaLabel="Get Your Project Live in 3D"
        ctaLocation="showreel"
      />
    </section>
  );
}
