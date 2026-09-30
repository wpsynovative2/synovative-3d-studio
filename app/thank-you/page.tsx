import type { Metadata } from "next";
import Link from "next/link";
import { formatPhone, site, telHref, whatsappHref } from "@/content/site";
import { ThankYouTracker } from "@/components/ThankYouTracker";
import { Logo } from "@/components/layout/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { buttonClass } from "@/components/ui/Button";
import { CheckIcon } from "@/components/ui/icons";
import { DoodleLayer, Glow, PaperPlane, StickyNote, Watermark } from "@/components/doodles/Doodles";

export const metadata: Metadata = {
  title: "Your quote request is in | Synovative 3D Studio",
  robots: { index: false, follow: false },
};

const NEXT_STEPS = [
  "We call you within one working day to understand the project.",
  "You share drawings (CAD, elevations or floor plans) after the call.",
  "We send a fixed quote and timeline for your walkthrough.",
];

export default function ThankYouPage() {
  return (
    <div className="relative isolate flex min-h-dvh flex-col">
      <ThankYouTracker />
      <DoodleLayer>
        <Glow className="absolute top-1/4 left-1/2 size-[40rem] -translate-x-1/2" />
        <PaperPlane className="absolute top-24 right-[6%] hidden w-72 md:block" />
        <StickyNote clip className="absolute right-[8%] bottom-24 hidden size-40 animate-sway [--r:5deg] lg:block">
          Talk soon!
        </StickyNote>
        <Watermark className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[min(18vw,16rem)]">
          Sent
        </Watermark>
      </DoodleLayer>
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Link href="/">
          <Logo />
        </Link>
        <ThemeToggle />
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-4 py-16 sm:px-6">
        <span className="grid size-14 place-items-center rounded-full bg-brand text-on-brand shadow-lift-brand">
          <CheckIcon width={28} height={28} />
        </span>
        <h1 className="mt-8 font-display text-4xl font-semibold tracking-tight md:text-5xl">
          Your quote request is in.
        </h1>
        <p className="mt-4 text-lg text-ink-soft">
          Thanks — the studio team has your project details. Here&apos;s what happens next:
        </p>

        <ol className="mt-8 space-y-4">
          {NEXT_STEPS.map((s, i) => (
            <li key={s} className="flex gap-4">
              <span className="grid size-8 shrink-0 place-items-center rounded-full border border-brand font-display text-sm font-semibold text-brand">
                {i + 1}
              </span>
              <span className="pt-1">{s}</span>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-wrap gap-3">
          {site.whatsapp && (
            <a href={whatsappHref("Hi, I just requested a walkthrough quote on your website.")} className={buttonClass("primary")}>
              Share drawings on WhatsApp
            </a>
          )}
          {site.phone && (
            <a href={telHref()} className={buttonClass("secondary")}>
              Call {formatPhone()}
            </a>
          )}
          <Link href="/#work" className={buttonClass("ghost")}>
            Watch more walkthroughs
          </Link>
        </div>
      </main>
    </div>
  );
}
