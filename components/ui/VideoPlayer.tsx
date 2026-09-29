"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, type VideoHTMLAttributes } from "react";
import { track } from "@/lib/tracking";

type Props = Omit<VideoHTMLAttributes<HTMLVideoElement>, "src"> & {
  src: string;
  /** Sends video_progress at 25/50/75/100% under this id. */
  trackingId?: string;
};

const isHls = (src: string) => /\.m3u8(\?|$)/i.test(src);

/** <video> that plays MP4 natively and HLS via Safari or a lazily loaded hls.js. */
export const VideoPlayer = forwardRef<HTMLVideoElement, Props>(function VideoPlayer(
  { src, trackingId, ...rest },
  ref,
) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useImperativeHandle(ref, () => videoRef.current as HTMLVideoElement);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;
    let destroy: (() => void) | undefined;
    let cancelled = false;

    if (isHls(src) && !video.canPlayType("application/vnd.apple.mpegurl")) {
      import("hls.js").then(({ default: Hls }) => {
        if (cancelled || !Hls.isSupported()) return;
        const hls = new Hls({ capLevelToPlayerSize: true, startLevel: -1 });
        hls.loadSource(src);
        hls.attachMedia(video);
        destroy = () => hls.destroy();
      });
    } else {
      video.src = src;
    }
    return () => {
      cancelled = true;
      destroy?.();
    };
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !trackingId) return;
    const sent = new Set<number>();
    const onTime = () => {
      if (!video.duration) return;
      const pct = (video.currentTime / video.duration) * 100;
      for (const mark of [25, 50, 75, 100]) {
        if (pct >= (mark === 100 ? 98 : mark) && !sent.has(mark)) {
          sent.add(mark);
          track("video_progress", { video_id: trackingId, percent: mark });
        }
      }
    };
    const onPlay = () => {
      if (!sent.has(0)) {
        sent.add(0);
        track("video_play", { video_id: trackingId });
      }
    };
    video.addEventListener("timeupdate", onTime);
    video.addEventListener("play", onPlay);
    return () => {
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("play", onPlay);
    };
  }, [trackingId]);

  return <video ref={videoRef} {...rest} />;
});
