import { faqs } from "@/content/faq";
import { segments } from "@/content/segments";
import { site } from "@/content/site";
import type { Variant } from "@/content/variants";
import { EnquiryProvider } from "@/components/form/EnquiryContext";
import { EnquiryModal } from "@/components/form/EnquiryModal";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Deliverables } from "@/components/sections/Deliverables";
import { Enquiry } from "@/components/sections/Enquiry";
import { FAQ } from "@/components/sections/FAQ";
import { HeroVideo } from "@/components/sections/HeroVideo";
import { Outcomes } from "@/components/sections/Outcomes";
import { Process } from "@/components/sections/Process";
import { ProjectTypes } from "@/components/sections/ProjectTypes";
import { ProofBar } from "@/components/sections/ProofBar";
import { WorkGallery } from "@/components/sections/WorkGallery";

/** The whole landing page. `/` and every `/lp/[segment]` variant render this with different config. */
export function LandingPage({ variant }: { variant: Variant }) {
  const ordered = variant.leadSegment
    ? [...segments].sort((a, b) => Number(b.slug === variant.leadSegment) - Number(a.slug === variant.leadSegment))
    : segments;

  return (
    <EnquiryProvider landingVariant={variant.key} defaultProjectType={variant.projectType ?? ""}>
      <JsonLd />
      <SiteHeader />
      <main>
        <HeroVideo variant={variant} />
        <ProjectTypes segments={ordered} />
        <WorkGallery />
        <Outcomes />
        <Deliverables />
        <Process />
        <ProofBar />
        <FAQ />
        <Enquiry />
      </main>
      <SiteFooter />
      <MobileActionBar />
      <EnquiryModal />
    </EnquiryProvider>
  );
}

function JsonLd() {
  const org = {
    "@type": ["Organization", "LocalBusiness"],
    "@id": `${site.url}/#org`,
    name: site.name,
    url: site.url,
    description: site.description,
    ...(site.phone && { telephone: site.phone }),
    ...(site.email && { email: site.email }),
    ...(site.address && { address: site.address }),
    areaServed: ["Mumbai", "Thane", "Navi Mumbai", "Pune", "India"],
    sameAs: site.social.map((s) => s.href).filter(Boolean),
  };
  const faqPage = {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const video = site.hero.showreelSrc && {
    "@type": "VideoObject",
    name: `${site.name} showreel`,
    description: site.description,
    contentUrl: site.hero.showreelSrc,
    ...(site.hero.poster && { thumbnailUrl: new URL(site.hero.poster, site.url).toString() }),
    uploadDate: "2026-01-01", // update when the showreel is published
  };
  const graph = { "@context": "https://schema.org", "@graph": [org, faqPage, video].filter(Boolean) };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }}
    />
  );
}
