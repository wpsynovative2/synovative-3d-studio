import type { CSSProperties } from "react";
import { LazyVideo } from "@/components/ui/LazyVideo";
import { positioned } from "./Doodles";

/** Web-optimised room loops (public/videos/web). */
export const ROOM_CLIPS = {
  livingRoom: { src: "/videos/web/living-room.mp4", poster: "/videos/web/living-room.jpg", label: "Living room" },
  kitchen: { src: "/videos/web/kitchen.mp4", poster: "/videos/web/kitchen.jpg", label: "Kitchen" },
  bedroom: { src: "/videos/web/bedroom.mp4", poster: "/videos/web/bedroom.jpg", label: "Bedroom" },
  bathroom: { src: "/videos/web/bathroom.mp4", poster: "/videos/web/bathroom.jpg", label: "Bathroom" },
  masterBedroom: { src: "/videos/web/master-bedroom.mp4", poster: "/videos/web/master-bedroom.jpg", label: "Master bedroom" },
  spaBathroom: { src: "/videos/web/spa-bathroom.mp4", poster: "/videos/web/spa-bathroom.jpg", label: "Spa bathroom" },
  lounge: { src: "/videos/web/lounge.mp4", poster: "/videos/web/lounge.jpg", label: "Lounge" },
} as const;

type Clip = (typeof ROOM_CLIPS)[keyof typeof ROOM_CLIPS];

/** Instant-photo style frame with a looping render inside, a strip of tape and a handwritten caption. */
export function VideoPolaroid({
  clip,
  caption,
  className = "",
  style,
  tape = true,
}: {
  clip: Clip;
  caption?: string;
  className?: string;
  style?: CSSProperties;
  tape?: boolean;
}) {
  return (
    <figure
      aria-hidden
      className={`${positioned(className)} bg-paper-raised p-2.5 pb-9 shadow-lift-lg ${className}`}
      style={style}
    >
      {tape && (
        <span className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 -rotate-3 bg-doodle-tape shadow-sm backdrop-blur-[1px]" />
      )}
      <div className="relative aspect-video overflow-hidden bg-paper-sunken">
        <LazyVideo src={clip.src} poster={clip.poster} className="absolute inset-0 size-full object-cover" />
      </div>
      <figcaption className="absolute inset-x-0 bottom-1.5 text-center font-hand text-lg leading-none text-ink-soft">
        {caption ?? clip.label}
      </figcaption>
    </figure>
  );
}

/** Phone mockup playing a vertical (9:16) reel. */
export function PhoneReel({ src, poster, className = "" }: { src: string; poster?: string; className?: string }) {
  return (
    <div aria-hidden className={`relative rounded-[2.4rem] bg-[#17131f] p-2.5 shadow-lift-lg ring-1 ring-black/10 ${className}`}>
      <span className="absolute top-4 left-1/2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-black" />
      <div className="relative aspect-[9/16] overflow-hidden rounded-[1.9rem] bg-black">
        <LazyVideo src={src} poster={poster} className="absolute inset-0 size-full object-cover" />
      </div>
    </div>
  );
}
