import Link from "next/link";
import { getProductsServicesContent } from "@/data/pages";
import type { HeroSlide } from "@/data/site";
import { ServicesHeroContent } from "@/components/sections/services-hero-content";
import { HeroBackgroundSlider } from "@/components/sections/hero-background-slider";

export async function ServicesHeroSection() {
  const content = await getProductsServicesContent();
  const c = content?.servicesHero;
  if (!c) return null;

  const bannerSlides: HeroSlide[] = (c.banners ?? []).map((src) => ({
    type: "image",
    src,
  }));

  return (
    <section
      className="relative overflow-hidden px-6 pb-20 pt-36 sm:px-12 lg:px-20 lg:pb-24 lg:pt-44"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
        backgroundColor: "var(--color-navy)",
      }}
    >
      <HeroBackgroundSlider
        slides={bannerSlides}
        alt="B-Trac Engineering service divisions"
        slideDuration={3}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(14,21,40,0.55) 0%, rgba(14,21,40,0.8) 65%, var(--color-navy) 100%), linear-gradient(90deg, rgba(14,21,40,0.7) 0%, rgba(14,21,40,0.25) 55%, rgba(14,21,40,0.5) 100%)",
        }}
      />

      <ServicesHeroContent>
        <nav data-hero-item aria-label="Breadcrumb" className="mb-8 text-[13px] text-muted">
          <Link href="/" className="transition-colors hover:text-white">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[#94A3B8]">Products &amp; Services</span>
        </nav>

        {c.badge ? (
          <div
            data-hero-item
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal/25 bg-teal/[0.08] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[1.5px] text-teal"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-teal" />
            {c.badge}
          </div>
        ) : null}

        <h1
          data-hero-item
          className="mb-6 font-display text-[clamp(40px,5.8vw,68px)] font-extrabold leading-[1.02] text-white"
        >
          {c.headingPrefix}
          <span className="text-teal">{c.headingHighlight}</span>
          {c.headingSuffix}
        </h1>

        <p data-hero-item className="max-w-2xl text-base leading-[1.75] text-[#94A3B8] sm:text-lg">
          {c.subhead}
        </p>
      </ServicesHeroContent>
    </section>
  );
}
