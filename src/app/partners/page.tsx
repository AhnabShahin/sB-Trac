import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPartnerBrands } from "@/data/company";
import { ServiceDetailHero } from "@/components/sections/service-detail-hero";
import { LogoWall } from "@/components/sections/logo-wall";
import { Reveal } from "@/components/ui/reveal";
import { Magnetic } from "@/components/ui/magnetic";
import { SiteFooter } from "@/components/sections/site-footer";

export const metadata: Metadata = {
  title: "Partners & Clients | B-Trac Engineering Ltd.",
  description:
    "BTEL is an authorized partner and distributor for 30+ global engineering brands — delivering certified, genuine products across power, solar, industrial, and cable & transformer sectors.",
  openGraph: {
    title: "Partners & Clients | B-Trac Engineering Ltd.",
    description:
      "BTEL is an authorized partner and distributor for 30+ global engineering brands — delivering certified, genuine products to Bangladesh's most demanding clients.",
    type: "website",
  },
};

export default async function PartnersPage() {
  const partnerMarks = await getPartnerBrands();

  return (
    <main className="flex-1">
      <section
        className="relative flex min-h-[64vh] items-center overflow-hidden pt-16"
        style={{ background: "linear-gradient(160deg, #080d19 0%, #101729 45%, #0e1528 100%)" }}
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <picture className="relative block h-full w-full">
            <source srcSet="/assets/hero/partners.webp" type="image/webp" />
            <Image
              src="/assets/hero/partners.jpg"
              alt=""
              fill
              priority
              loading="eager"
              className="object-cover object-[70%_center] sm:object-center opacity-50"
              sizes="100vw"
            />
          </picture>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(14,21,40,0.70) 0%, rgba(14,21,40,0.85) 60%, rgba(14,21,40,0.98) 100%), radial-gradient(ellipse 60% 60% at 80% 40%, rgba(10,158,136,0.10) 0%, transparent 60%), radial-gradient(ellipse 40% 50% at 10% 80%, rgba(159,185,252,0.08) 0%, transparent 60%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-1 px-6 py-20 sm:px-12 lg:px-20">
          <ServiceDetailHero accent="teal" maxWidth="max-w-3xl">
            <nav aria-label="Breadcrumb" className="mb-5 text-[13px] text-muted">
              <Link href="/" className="transition-colors hover:text-white">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-[#94A3B8]">Partners &amp; Clients</span>
            </nav>

            <div
              data-hero-item
              className="mb-7 inline-flex items-center gap-2 rounded-full border border-teal/30 bg-teal/[0.10] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-teal"
            >
              <span className="h-1.5 w-1.5 shrink-0 animate-[var(--animate-pulse-dot)] rounded-full bg-teal" />
              30 Global Brands · 60+ Clients
            </div>

            <h1
              data-hero-item
              className="mb-6 font-display text-[clamp(48px,5.5vw,72px)] font-extrabold leading-[0.95] tracking-[-1px] text-white"
            >
              World-Class
              <br />
              <span className="text-teal">Partners.</span>
            </h1>

            <p data-hero-item className="max-w-xl text-base leading-[1.75] text-[#94A3B8] sm:text-lg">
              BTEL is an authorized partner and distributor for 30+ global
              engineering brands — delivering certified, genuine products to
              Bangladesh&apos;s most demanding clients across FMCG,
              pharmaceuticals, energy, and government sectors.
            </p>
          </ServiceDetailHero>
        </div>
      </section>

      <section className="border-b border-border bg-navy2 px-6 py-20 sm:px-12 lg:px-20">
        <LogoWall
          eyebrow="Global Partnerships"
          heading="Partner Brands"
          description="Every brand we represent is backed by factory authorization, genuine product supply, and nationwide service support."
          logos={partnerMarks}
        />
      </section>

      <section className="bg-navy px-6 py-24 text-center sm:px-12 lg:px-20 lg:py-28">
        <Reveal className="mx-auto max-w-2xl">
          <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-teal">
            Work With BTEL
          </div>
          <h2 className="mb-9 font-display text-[clamp(32px,4vw,48px)] font-extrabold leading-[1.1] text-white">
            Join Our Partners Program
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Magnetic>
              <Link
                href="/contact"
                data-cursor-interactive
                className="inline-block rounded-[4px] bg-teal px-8 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-teal-dark"
              >
                Start a Conversation →
              </Link>
            </Magnetic>
            <Link
              href="/projects"
              data-cursor-interactive
              className="text-[15px] font-medium text-white/80 transition-colors hover:text-teal"
            >
              See Our Projects →
            </Link>
          </div>
        </Reveal>
      </section>

      <SiteFooter />
    </main>
  );
}
