import type { Metadata, Viewport } from "next";
import { Caveat, Fredoka, Nunito } from "next/font/google";
import Script from "next/script";
import { site } from "@/content/site";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

// Same families as synovative.vercel.app. Favicon comes from app/icon.png (file convention).
const nunito = Nunito({ variable: "--font-nunito", subsets: ["latin"], display: "swap" });
const fredoka = Fredoka({ variable: "--font-fredoka", subsets: ["latin"], display: "swap" });
// Handwriting for doodles / sticky notes (the main site uses Caveat too).
const caveat = Caveat({ variable: "--font-caveat", subsets: ["latin"], display: "swap" });

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
// First-party sGTM host (e.g. https://track.synovative3dstudio.in); falls back to Google.
const GTM_HOST = process.env.NEXT_PUBLIC_SGTM_URL || "https://www.googletagmanager.com";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: "3D Walkthrough Videos for Real Estate | Synovative 3D Studio",
  description:
    "Photoreal 3D walkthrough films for residential, commercial, industrial and villa projects in Mumbai. Built for pre-launch campaigns, sales galleries and ads — delivered in weeks.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: "3D Walkthrough Videos for Real Estate | Synovative 3D Studio",
    description: site.description,
    locale: "en_IN",
    ...(site.ogImage && { images: [{ url: site.ogImage, width: 1200, height: 630 }] }),
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#17131f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${nunito.variable} ${fredoka.variable} ${caveat.variable} antialiased`} suppressHydrationWarning>
      <head>
        {/* Applies the saved / OS theme before first paint (no flash) */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-dvh">
        {GTM_ID && (
          <>
            <Script id="gtm" strategy="afterInteractive">
              {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='${GTM_HOST}/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
            </Script>
            <noscript>
              <iframe
                src={`${GTM_HOST}/ns.html?id=${GTM_ID}`}
                height="0"
                width="0"
                style={{ display: "none", visibility: "hidden" }}
              />
            </noscript>
          </>
        )}
        {children}
        <div aria-hidden className="paper-grain" />
      </body>
    </html>
  );
}
