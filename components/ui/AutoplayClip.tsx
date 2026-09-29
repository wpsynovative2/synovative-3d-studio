"use client";

import { useRef } from "react";
import { LazyVideo } from "./LazyVideo";
import { RestartIcon } from "./icons";

/** Card media: autoplaying muted loop that fills its (relative) parent, with a restart button. */
export function AutoplayClip({ src, poster, label }: { src: string; poster?: string; label: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const restart = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => {});
  };

  return (
    <>
      <LazyVideo ref={videoRef} src={src} poster={poster} className="absolute inset-0 size-full object-cover" />
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          restart();
        }}
        aria-label={`Restart ${label} preview`}
        title="Restart"
        className="absolute bottom-3 left-3 z-10 grid size-9 place-items-center rounded-full bg-black/55 text-white backdrop-blur btn-motion hover:bg-accent hover:text-[#2a2135]"
      >
        <RestartIcon width={16} height={16} />
      </button>
    </>
  );
}
