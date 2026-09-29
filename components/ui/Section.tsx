import type { ReactNode } from "react";
import { DoodleLayer } from "@/components/doodles/Doodles";

export function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  className = "",
  decor,
  aside,
}: {
  id?: string;
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Doodles pinned to the section edges, behind the content. */
  decor?: ReactNode;
  /** Doodle filling the empty space to the right of the heading (desktop only). */
  aside?: ReactNode;
}) {
  return (
    <section id={id} className={`relative isolate px-4 py-20 sm:px-6 md:py-28 ${className}`}>
      {decor && <DoodleLayer>{decor}</DoodleLayer>}
      <div className="relative mx-auto max-w-6xl">
        {aside && (
          <div aria-hidden className="pointer-events-none absolute top-0 right-0 -z-10 hidden lg:block">
            {aside}
          </div>
        )}
        <header className="max-w-2xl">
          {eyebrow && (
            <p className="mb-3 flex items-center gap-3 font-display text-xs font-semibold tracking-[0.22em] text-brand uppercase">
              <span aria-hidden className="h-1 w-6 rounded-full bg-accent" />
              {eyebrow}
            </p>
          )}
          <h2 className="font-display text-3xl font-semibold tracking-tight text-balance md:text-4xl">{title}</h2>
          {intro && <p className="mt-4 text-lg text-ink-soft text-pretty">{intro}</p>}
        </header>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}

export function SectionCta({ children }: { children: ReactNode }) {
  return <div className="mt-12 flex flex-wrap items-center gap-4">{children}</div>;
}
