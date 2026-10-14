import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
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

export const metadata: Metadata = {
  title: "B-Trac Engineering Ltd. | Powering Bangladesh's Industrial Growth",
  description:
    "B-Trac Engineering Ltd (BTEL) delivers EPC and engineering solutions across substation & switchgear, solar power, MEP/EPC, and water treatment chemicals — trusted by 60+ industry leaders across Bangladesh.",
  metadataBase: new URL("https://btraceng.com"),
  openGraph: {
    title: "B-Trac Engineering Ltd. | Powering Bangladesh's Industrial Growth",
    description:
      "Complete EPC and engineering solutions — from 33KV substations and megawatt-scale solar plants to MEP systems and water treatment. Trusted by 60+ industry leaders.",
    type: "website",
    locale: "en_US",
  },
};

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
