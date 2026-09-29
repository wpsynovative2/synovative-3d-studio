import type { CSSProperties, ReactNode } from "react";

/*
 * Hand-made "desk" doodles (torn paper, sticky notes, swatches, ruler, camera path…) that decorate
 * the landing page. All are decorative: aria-hidden, pointer-events-none, theme-aware via tokens.
 */

type Pos = { className?: string; style?: CSSProperties };

// Deterministic jitter so server and client render identical paths.
function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

/** Rectangle path with torn / ragged edges. */
function tornRect(w: number, h: number, seed: number, amp = 4) {
  const r = rng(seed);
  const pts: [number, number][] = [];
  const step = 9;
  for (let x = 0; x <= w; x += step) pts.push([x, amp + (r() - 0.5) * amp * 2]);
  for (let y = step; y <= h; y += step) pts.push([w - amp + (r() - 0.5) * amp * 1.2, y]);
  for (let x = w; x >= 0; x -= step) pts.push([x, h - amp + (r() - 0.5) * amp * 2]);
  for (let y = h; y >= step; y -= step) pts.push([amp + (r() - 0.5) * amp * 1.2, y]);
  return "M" + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L") + "Z";
}

// overflow visible: tape strips, clips and the camera may poke past the viewBox without being clipped.
const hidden = { "aria-hidden": true as const, overflow: "visible" };

/** `relative` unless the caller already positions the element (Tailwind's `relative` would win over `absolute`). */
export const positioned = (className: string) => (/\b(absolute|fixed|sticky)\b/.test(className) ? "" : "relative");

/* ------------------------------------------------------------------ paper + sketches */

/** Torn sheet of paper with tape and a floor-plan sketch. */
export function FloorPlanPaper({ className = "", style }: Pos) {
  return (
    <svg viewBox="0 0 280 220" className={className} style={style} {...hidden}>
      <path d={tornRect(270, 210, 7)} transform="translate(5 5)" className="fill-doodle-paper" filter="url(#dd-shadow-plan)" />
      <defs>
        <filter id="dd-shadow-plan" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="5" floodOpacity="0.12" />
        </filter>
      </defs>
      {/* floor plan */}
      <g className="stroke-doodle-ink" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="38" y="42" width="196" height="132" rx="2" />
        <path d="M128 42v62M38 104h56M110 104h24v70M170 104h64M170 104v28" />
        {/* door swings */}
        <path d="M94 104a16 16 0 0 1 16 -16" strokeDasharray="3 4" />
        <path d="M134 150a18 18 0 0 1 18 18" strokeDasharray="3 4" />
        {/* window marks */}
        <path d="M60 42h40M180 42h36M234 60v34" strokeWidth="4" className="stroke-doodle-note" />
        {/* furniture */}
        <rect x="52" y="120" width="40" height="26" rx="4" />
        <circle cx="200" cy="150" r="12" />
        <rect x="150" y="56" width="62" height="34" rx="3" />
        {/* dimension line */}
        <path d="M38 188h196M38 183v10M234 183v10" strokeWidth="1.3" />
      </g>
      <text x="136" y="208" textAnchor="middle" className="fill-doodle-ink font-hand" fontSize="15">
        12&apos;-6&quot; × 18&apos;
      </text>
      <text x="62" y="78" className="fill-doodle-ink font-hand" fontSize="14">
        Living
      </text>
      <text x="152" y="124" className="fill-doodle-ink font-hand" fontSize="13">
        Bed
      </text>
      {/* tape */}
      <rect x="-6" y="-10" width="70" height="22" transform="rotate(-28 20 0)" className="fill-doodle-tape" />
      <rect x="226" y="192" width="64" height="20" transform="rotate(-24 250 200)" className="fill-doodle-tape" />
    </svg>
  );
}

/** Torn sheet with a lightbulb sketch and a purple note tucked behind (top-left of the moodboard). */
export function IdeaPaper({ className = "", style, note = "big idea?" }: Pos & { note?: string }) {
  return (
    <svg viewBox="0 0 280 230" className={className} style={style} {...hidden}>
      <rect x="120" y="120" width="120" height="96" rx="3" transform="rotate(8 180 168)" className="fill-doodle-note" />
      <path d={tornRect(250, 170, 3, 5)} transform="translate(4 8) rotate(-4 125 85)" className="fill-doodle-paper" filter="url(#dd-shadow-idea)" />
      <g transform="translate(92 38)" className="stroke-doodle-ink" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M40 22c-12 0-20 9-20 19 0 8 5 12 8 16 2 3 3 6 3 9h18c0-3 1-6 3-9 3-4 8-8 8-16 0-10-8-19-20-19Z" />
        <path d="M32 72h16M34 78h12M36 66v-12l4 4 4-4v12" />
        <path d="M40 4v8M14 14l6 6M66 14l-6 6M4 40h8M68 40h8" />
      </g>
      <text x="150" y="160" textAnchor="middle" className="fill-doodle-ink font-hand" fontSize="17">
        {note}
      </text>
      <rect x="-4" y="14" width="70" height="22" transform="rotate(-32 30 25)" className="fill-doodle-tape" />
      <defs>
        <filter id="dd-shadow-idea" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="5" floodOpacity="0.12" />
        </filter>
      </defs>
    </svg>
  );
}

/** Isometric line sketch of a tower + low block — the "3D" doodle. */
export function IsoBuilding({ className = "", style }: Pos) {
  return (
    <svg viewBox="0 0 220 220" className={className} style={style} {...hidden}>
      <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" className="stroke-doodle-ink">
        {/* tower */}
        <path d="M110 30 150 52 150 170 110 192 110 30Z" className="fill-doodle-note-2" />
        <path d="M110 30 70 52 70 170 110 192Z" className="fill-doodle-paper" />
        <path d="M110 30 150 52 110 74 70 52Z" className="fill-doodle-paper" />
        {/* windows */}
        <g fill="none" strokeWidth="1.4">
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <path d={`M78 ${78 + i * 20} 102 ${91 + i * 20}`} />
              <path d={`M118 ${91 + i * 20} 142 ${78 + i * 20}`} />
            </g>
          ))}
        </g>
        {/* low block */}
        <path d="M150 130 196 154 196 182 150 206 104 182" fill="none" strokeDasharray="4 5" />
        {/* ground ellipse */}
        <path d="M30 186c40 22 120 30 172 -4" fill="none" strokeDasharray="2 6" />
      </g>
      <circle cx="176" cy="40" r="14" className="fill-doodle-yellow" />
    </svg>
  );
}

/** Lightbulb sketch with rays. */
export function Lightbulb({ className = "", style }: Pos) {
  return (
    <svg viewBox="0 0 80 90" className={className} style={style} {...hidden}>
      <g className="stroke-doodle-ink" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M40 22c-12 0-20 9-20 19 0 8 5 12 8 16 2 3 3 6 3 9h18c0-3 1-6 3-9 3-4 8-8 8-16 0-10-8-19-20-19Z" />
        <path d="M32 72h16M34 78h12M36 66v-12l4 4 4-4v12" />
        <path d="M40 4v8M14 14l6 6M66 14l-6 6M4 40h8M68 40h8" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ tools */

/** Fan of material / colour swatches. */
export function SwatchFan({ className = "", style }: Pos) {
  const strips = [
    ["#4b2d91", "#6d4bc3", "#9b7fe0", "#cbbcf2"],
    ["#5f3ca7", "#8c6ad8", "#b39cea", "#dcd0f7"],
    ["#7a5bc9", "#a58ae6", "#c7b6f1", "#ebe4fb"],
    ["#d98d14", "#faac37", "#fcc66d", "#fde3b3"],
    ["#e8a93a", "#f6c65c", "#f9dc8e", "#fcefcb"],
    ["#e06d4a", "#f08a6a", "#f5ae93", "#fad3c3"],
  ];
  return (
    <svg viewBox="0 0 320 320" className={className} style={style} {...hidden}>
      <g transform="translate(40 280)">
        {strips.map((cells, i) => (
          <g key={i} transform={`rotate(${-78 + i * 13})`}>
            <rect x="0" y="-22" width="250" height="44" rx="6" fill="#fffdf8" filter="url(#dd-shadow-sw)" />
            {cells.map((c, j) => (
              <rect key={j} x={62 + j * 46} y="-18" width="42" height="36" rx="2" fill={c} />
            ))}
            <rect x="12" y="-10" width="36" height="4" rx="2" fill="#d6d0e0" />
            <rect x="12" y="2" width="24" height="4" rx="2" fill="#e4dfec" />
          </g>
        ))}
        <circle r="10" fill="#b8bcc4" stroke="#8d9199" strokeWidth="2" />
      </g>
      <defs>
        <filter id="dd-shadow-sw" x="-5%" y="-30%" width="110%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.15" />
        </filter>
      </defs>
    </svg>
  );
}

/** Steel architect's ruler. */
export function Ruler({ className = "", style }: Pos) {
  const ticks = Array.from({ length: 41 }, (_, i) => i);
  return (
    <svg viewBox="0 0 340 56" className={className} style={style} {...hidden}>
      <defs>
        <linearGradient id="dd-steel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e3e6ea" />
          <stop offset="0.5" stopColor="#c3c8ce" />
          <stop offset="1" stopColor="#9da3ab" />
        </linearGradient>
      </defs>
      <rect x="2" y="4" width="336" height="48" rx="4" fill="url(#dd-steel)" stroke="#8a9098" />
      <g stroke="#4a4f57" strokeWidth="1.2">
        {ticks.map((i) => (
          <line key={i} x1={14 + i * 8} x2={14 + i * 8} y1="4" y2={i % 5 === 0 ? 22 : 13} />
        ))}
      </g>
      <g fill="#3d4148" fontSize="10" fontFamily="ui-monospace, monospace">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <text key={n} x={14 + n * 40} y="36" textAnchor="middle">
            {n}
          </text>
        ))}
      </g>
    </svg>
  );
}

/** Transparent set-square (drafting triangle). */
export function SetSquare({ className = "", style }: Pos) {
  return (
    <svg viewBox="0 0 200 200" className={className} style={style} {...hidden}>
      <path
        d="M10 190 190 190 10 10Z M44 170 150 170 44 64Z"
        fillRule="evenodd"
        className="fill-brand/15 stroke-brand/50"
        strokeWidth="2"
      />
      <g className="stroke-brand/60" strokeWidth="1.2">
        {Array.from({ length: 16 }, (_, i) => (
          <line key={i} x1={20 + i * 10} x2={20 + i * 10} y1="190" y2={i % 5 === 0 ? 180 : 185} />
        ))}
      </g>
    </svg>
  );
}

/** Yellow pencil. */
export function Pencil({ className = "", style }: Pos) {
  return (
    <svg viewBox="0 0 240 30" className={className} style={style} {...hidden}>
      <rect x="30" y="4" width="180" height="22" fill="#f6c65c" />
      <rect x="30" y="4" width="180" height="7" fill="#fad98c" />
      <rect x="210" y="4" width="22" height="22" rx="3" fill="#b9a3e0" />
      <rect x="204" y="4" width="8" height="22" fill="#9aa0a8" />
      <path d="M30 4 4 15 30 26Z" fill="#f1d9b5" />
      <path d="M11 12 4 15 11 18Z" fill="#2a2135" />
    </svg>
  );
}

/* ------------------------------------------------------------------ motion doodles */

/** Camera flying along a dashed "camera path" — the walkthrough itself. */
export function CameraPath({ className = "", style, label = "camera path" }: Pos & { label?: string }) {
  return (
    <svg viewBox="0 0 300 160" className={className} style={style} {...hidden}>
      <path
        d="M8 140C60 150 80 90 120 96s40 40 70 20 20-50 60-70"
        fill="none"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeDasharray="7 7"
        className="stroke-doodle-ink animate-dash"
      />
      <text x="70" y="156" className="fill-doodle-ink font-hand" fontSize="16">
        {label}
      </text>
      {/* camera */}
      <g transform="translate(228 30) rotate(-18)" className="animate-float">
        <rect x="0" y="10" width="40" height="28" rx="5" className="fill-doodle-note stroke-doodle-ink" strokeWidth="2" />
        <path d="M40 18 54 10v28l-14-8" className="fill-doodle-note-2 stroke-doodle-ink" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="10" cy="6" r="6" className="fill-doodle-paper stroke-doodle-ink" strokeWidth="2" />
        <circle cx="26" cy="6" r="6" className="fill-doodle-paper stroke-doodle-ink" strokeWidth="2" />
        <circle cx="12" cy="24" r="3" className="fill-doodle-yellow" />
      </g>
    </svg>
  );
}

/** Paper plane with a looping dashed trail. */
export function PaperPlane({ className = "", style }: Pos) {
  return (
    <svg viewBox="0 0 280 130" className={className} style={style} {...hidden}>
      {/* trail + plane float together so the plane never drifts off its trail */}
      <g className="animate-float">
        <path
          d="M4 120c40 4 70-10 90-30s10-40-8-32 0 34 30 26 74-26 114-48"
          fill="none"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeDasharray="7 7"
          className="stroke-doodle-ink animate-dash"
        />
        {/* plane drawn with its tail at (0,0), rotated to follow the trail's final direction */}
        <g transform="translate(230 36) rotate(-24)">
          <path d="M-6 -22 40 -3 0 0Z" className="fill-doodle-note" />
          <path d="M0 0 40 -3 6 15Z" className="fill-doodle-ink" opacity="0.55" />
        </g>
      </g>
    </svg>
  );
}

/** Loose dashed curve. */
export function DashedCurve({ className = "", style, d = "M4 60C70 0 150 0 200 50s60 70 110 40" }: Pos & { d?: string }) {
  return (
    <svg viewBox="0 0 320 120" className={className} style={style} {...hidden}>
      <path d={d} fill="none" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="8 8" className="stroke-doodle-ink" />
    </svg>
  );
}

/* ------------------------------------------------------------------ notes, glow, watermark */

/** Sticky note with handwriting, optional paperclip and a second note peeking behind. */
export function StickyNote({
  children,
  className = "",
  style,
  tone = "purple",
  clip = false,
  backNote = false,
}: Pos & { children: ReactNode; tone?: "purple" | "yellow"; clip?: boolean; backNote?: boolean }) {
  const bg = tone === "purple" ? "bg-doodle-note text-[#2a2135]" : "bg-doodle-yellow text-[#2a2135]";
  return (
    <div className={`${positioned(className)} ${className}`} style={style} aria-hidden>
      {backNote && (
        <div
          className={`absolute inset-0 translate-x-3 -translate-y-3 rotate-6 rounded-sm shadow-lift-sm ${
            tone === "purple" ? "bg-doodle-yellow" : "bg-doodle-note"
          }`}
        />
      )}
      <div
        className={`relative flex size-full flex-col items-center justify-center rounded-sm p-4 text-center font-hand text-xl leading-tight shadow-lift-md ${bg} [clip-path:polygon(0_0,100%_0,100%_86%,86%_100%,0_100%)]`}
      >
        {children}
        <span className="mt-2 block h-0.5 w-16 -rotate-2 rounded-full bg-current opacity-60" />
      </div>
      {/* folded corner */}
      <div className="absolute right-0 bottom-0 size-[14%] rounded-tl-sm bg-black/10" />
      {clip && (
        <svg viewBox="0 0 24 60" className="absolute -top-6 right-6 h-14 w-6" aria-hidden>
          <path
            d="M8 40V10a4 4 0 0 1 8 0v36a7 7 0 0 1-14 0V14"
            fill="none"
            stroke="#8d9199"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
        </svg>
      )}
    </div>
  );
}

/** Soft radial purple glow. */
export function Glow({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--brand)_22%,transparent),transparent)] blur-2xl ${className}`}
    />
  );
}

/** Huge faded word, like the "JOIN US" watermark. */
export function Watermark({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p
      aria-hidden
      className={`font-display leading-none font-bold tracking-tight whitespace-nowrap text-brand/[0.07] uppercase select-none ${className}`}
    >
      {children}
    </p>
  );
}

/** Wrapper that places a doodle layer behind a section's content. */
export function DoodleLayer({ children }: { children: ReactNode }) {
  return <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">{children}</div>;
}
