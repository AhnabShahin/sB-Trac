import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import { getPublicSettings } from "@/services/settings";
import "./globals.css";

// Only the weights actually applied in the app are requested. The site uses
// `font-medium` (500), `font-semibold` (600) and `font-bold` (700) for body
// copy; 300 was declared but never used and shipped an unused woff2.
const barlow = Barlow({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

// Hardcoded fallbacks. The admin Settings module (site identity + SEO) overrides
// the title/description when set; an unreachable or unseeded backend falls back
// to these, so SEO is never empty.
const DEFAULT_TITLE = "B-Trac Engineering Ltd. | Powering Bangladesh's Industrial Growth";
const DEFAULT_DESCRIPTION =
  "B-Trac Engineering Ltd (BTEL) delivers EPC and engineering solutions across substation & switchgear, solar power, MEP/EPC, and water treatment chemicals — trusted by 60+ industry leaders across Bangladesh.";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSettings();

  const title =
    settings?.seo.metaTitle?.trim() ||
    (settings?.identity.siteName?.trim() && settings?.identity.tagline?.trim()
      ? `${settings.identity.siteName.trim()} | ${settings.identity.tagline.trim()}`
      : "") ||
    DEFAULT_TITLE;
  const description = settings?.seo.metaDescription?.trim() || DEFAULT_DESCRIPTION;
  const ogImage = settings?.seo.ogImage?.trim();

  return {
    title,
    description,
    metadataBase: new URL("https://btraceng.com"),
    openGraph: {
      title,
      description,
      type: "website",
      locale: "en_US",
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
  };
}

// The root layout is deliberately thin: html/body shell, fonts and the dark
// navy canvas only. The marketing chrome (Lenis smooth-scroll, site header,
// back-to-top) lives in `(public)/layout.tsx` so the `(auth)` and `(admin)`
// trees render without it. Keep `"use client"` out of this file — metadata and
// the initial HTML stay server-rendered.
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${barlow.variable} ${barlowCondensed.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-navy text-white">
        {children}
      </body>
    </html>
  );
}
