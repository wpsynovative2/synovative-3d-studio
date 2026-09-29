"use client";

import Image from "next/image";
import { AutoplayClip } from "./AutoplayClip";
import { MediaPlaceholder } from "./MediaPlaceholder";
import { PlayIcon } from "./icons";

/** Gallery card: muted preview loop (with restart) that opens the full film on click. */
export function VideoCard({
  title,
  meta,
  poster,
  preview,
  duration,
  onPlay,
}: {
  title: string;
  meta?: string;
  poster: string;
  preview?: string;
  duration?: string;
  onPlay: () => void;
}) {
  return (
    <div className="group">
      <div className="relative aspect-video overflow-hidden rounded-card border border-line bg-paper-raised">
        {preview ? (
          <AutoplayClip src={preview} poster={poster} label={title} />
        ) : poster ? (
          <Image
            src={poster}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <MediaPlaceholder />
        )}

        {/* Whole frame opens the full film; restart button sits above it */}
        <button
          type="button"
          onClick={onPlay}
          aria-label={`Play ${title} full film`}
          className="absolute inset-0 grid place-items-center"
        >
          <span className="flex items-center gap-2 rounded-full bg-white/70 py-2.5 pr-4 pl-3 font-display text-sm font-semibold text-[#2a2135] shadow-lg">
            <PlayIcon width={18} height={18} /> Watch film
          </span>
        </button>

        {duration && (
          <span className="pointer-events-none absolute right-3 bottom-3 rounded bg-black/70 px-2 py-0.5 text-xs text-white tabular-nums">
            {duration}
          </span>
        )}
      </div>
      <button type="button" onClick={onPlay} className="mt-3 block text-left">
        <span className="block font-semibold group-hover:text-brand">
          {title}
        </span>
        {meta && <span className="block text-sm text-ink-soft">{meta}</span>}
      </button>
    </div>
  );
}
