import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LandingPage } from "@/components/LandingPage";
import { variants } from "@/content/variants";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(variants).map((segment) => ({ segment }));
}

export async function generateMetadata({ params }: PageProps<"/lp/[segment]">): Promise<Metadata> {
  const { segment } = await params;
  const variant = variants[segment];
  return {
    title: variant ? `${variant.headline} | Synovative 3D Studio` : undefined,
    description: variant?.subline,
    // Ad-variant URLs: noindex, canonical to the generic page.
    robots: { index: false, follow: true },
    alternates: { canonical: "/" },
  };
}

export default async function VariantPage({ params }: PageProps<"/lp/[segment]">) {
  const { segment } = await params;
  const variant = variants[segment];
  if (!variant) notFound();
  return <LandingPage variant={variant} />;
}
