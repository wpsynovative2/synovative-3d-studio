"use client";

import { useEffect, useRef } from "react";
import type { ProjectType } from "@/content/segments";
import { CtaLink } from "./CtaLink";
import { CloseIcon } from "./icons";
import { VideoPlayer } from "./VideoPlayer";

export type LightboxVideo = {
  id: string;
  title: string;
  src: string;
  poster?: string;
  category?: ProjectType;
};

/** Modal player. The player only mounts while open, so nothing preloads. */
export function VideoLightbox({
  video,
  onClose,
  ctaLabel = "Get a walkthrough like this",
  ctaLocation = "lightbox",
}: {
  video: LightboxVideo | null;
  onClose: () => void;
  ctaLabel?: string;
  ctaLocation?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (video && !dialog.open) dialog.showModal();
    if (!video && dialog.open) dialog.close();
  }, [video]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => e.target === dialogRef.current && onClose()}
      aria-label={video?.title ?? "Video"}
      className="m-auto w-[min(100vw-2rem,72rem)] max-h-[calc(100dvh-2rem)] bg-transparent p-0 text-white"
    >
      {video && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-lg font-semibold">{video.title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="btn-motion grid size-10 place-items-center rounded-full bg-white/10 hover:bg-white/20"
              aria-label="Close video"
            >
              <CloseIcon />
            </button>
          </div>
          <div className="relative aspect-video overflow-hidden rounded-card bg-black">
            {video.src ? (
              <VideoPlayer
                src={video.src}
                poster={video.poster || undefined}
                trackingId={video.id}
                controls
                autoPlay
                playsInline
                className="size-full"
              />
            ) : (
              <div className="grid size-full place-items-center text-sm text-white/70">Video coming soon.</div>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-white/70">Like what you see? We&apos;ll quote your project within one working day.</p>
            <CtaLink location={ctaLocation} projectType={video.category} onNavigate={onClose}>
              {ctaLabel}
            </CtaLink>
          </div>
        </div>
      )}
    </dialog>
  );
}
