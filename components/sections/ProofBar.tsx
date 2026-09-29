import Image from "next/image";
import { clientLogos, stats } from "@/content/stats";
import { CtaLink } from "@/components/ui/CtaLink";

/** Hidden entirely until real 3D-studio numbers or approved logos are added in content/stats.ts. */
export function ProofBar() {
  const shownStats = stats.filter((s) => s.value);
  if (!shownStats.length && !clientLogos.length) return null;

  return (
    <section className="border-y border-line px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {shownStats.length > 0 && (
          <dl className="grid gap-8 sm:grid-cols-3">
            {shownStats.map((s) => (
              <div key={s.label}>
                <dd className="font-display text-4xl font-semibold md:text-5xl">{s.value}</dd>
                <dt className="mt-1 text-ink-soft">{s.label}</dt>
              </div>
            ))}
          </dl>
        )}
        {clientLogos.length > 0 && (
          <ul className="mt-12 flex flex-wrap items-center gap-x-12 gap-y-8 opacity-70">
            {clientLogos.map((l) => (
              <li key={l.name}>
                <Image src={l.src} alt={l.name} width={140} height={48} className="h-10 w-auto object-contain" />
              </li>
            ))}
          </ul>
        )}
        <div className="mt-12">
          <CtaLink location="proof">Join These Developers</CtaLink>
        </div>
      </div>
    </section>
  );
}
