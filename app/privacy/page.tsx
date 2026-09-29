import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";
import { Logo } from "@/components/layout/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export const metadata: Metadata = {
  title: "Privacy policy | Synovative 3D Studio",
  alternates: { canonical: "/privacy" },
};

// Draft — have this reviewed before launch (Architecture §15).
export default function PrivacyPage() {
  return (
    <div className="min-h-dvh">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Link href="/">
          <Logo />
        </Link>
        <ThemeToggle />
      </header>
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_li]:mt-1 [&_p]:mt-4 [&_p]:text-ink-soft [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:text-ink-soft">
        <h1 className="font-display text-4xl font-semibold tracking-tight">Privacy policy</h1>
        <p>
          This policy explains how {site.name} (&quot;we&quot;) collects and uses information submitted through{" "}
          {site.domain}.
        </p>

        <h2>What we collect</h2>
        <ul>
          <li>Details you enter in the enquiry form: name, mobile number, email, company, role and project details.</li>
          <li>
            Campaign information such as UTM parameters and ad click IDs (fbclid, gclid), the page you submitted from,
            and advertising cookies (_fbp, _fbc).
          </li>
          <li>Usage data collected by analytics and advertising tags (Google Tag Manager, Google Analytics, Meta Pixel).</li>
        </ul>

        <h2>How we use it</h2>
        <ul>
          <li>To contact you about your enquiry and prepare a quote.</li>
          <li>To store your enquiry in our CRM and lead sheet so our sales team can follow up.</li>
          <li>
            To measure which ads bring enquiries. Contact details sent to advertising platforms are hashed before they
            leave our servers.
          </li>
        </ul>

        <h2>Sharing</h2>
        <p>
          We do not sell your data. It is processed by service providers we use to run this site and respond to you
          (hosting, CRM, email and WhatsApp messaging, analytics and advertising platforms).
        </p>

        <h2>Your choices</h2>
        <p>
          You can ask us to access, correct or delete your information at any time
          {site.email ? (
            <>
              {" "}
              by emailing <a href={`mailto:${site.email}`} className="text-brand underline">{site.email}</a>
            </>
          ) : null}
          .
        </p>

        <h2>Updates</h2>
        <p>We may update this policy. The latest version is always on this page.</p>
      </main>
    </div>
  );
}
