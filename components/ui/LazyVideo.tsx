"use client";

import { useEffect, useImperativeHandle, useRef, type Ref } from "react";

/**
 * Muted looping clip that only downloads when it comes near the viewport and pauses when it
 * leaves, so a page full of clips doesn't fight the hero for bandwidth.
 */
export function LazyVideo({
  src,
  poster,
  className = "",
  ref,
}: {
  src: string;
  poster?: string;
  className?: string;
  ref?: Ref<HTMLVideoElement>;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useImperativeHandle(ref, () => videoRef.current as HTMLVideoElement, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!video.src) {
            video.src = src;
            video.load();
          }
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [src]);

  return (
    <video
      ref={videoRef}
      poster={poster || undefined}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden
      className={className}
    />
  );
}
