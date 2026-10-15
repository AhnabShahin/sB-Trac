import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getSolarContent } from "@/data/pages";
import { ServiceDetailHero } from "@/components/sections/service-detail-hero";
import { OtherServicesGrid } from "@/components/sections/other-services-grid";
import { SiteVisitForm } from "@/components/sections/site-visit-form";
import { ServiceSlider } from "@/components/ui/service-slider";
import { Reveal } from "@/components/ui/reveal";
import { StaggerGroup } from "@/components/ui/stagger-group";
import { SiteFooter } from "@/components/sections/site-footer";
import { SERVICE_ICON_COMPONENTS } from "@/lib/service-icons";
import { iconChip } from "@/lib/color";

export const metadata: Metadata = {
  title: "Solar Power Solutions | B-Trac Engineering Ltd.",
  description:
    "Turnkey solar EPC — on-grid, off-grid, and hybrid solar power systems for industrial and commercial clients across Bangladesh. Book a free site visit.",
  openGraph: {
    title: "Solar Power Solutions | B-Trac Engineering Ltd.",
    description:
      "Turnkey solar EPC — on-grid, off-grid, and hybrid systems for industrial and commercial clients across Bangladesh.",
    type: "website",
  },
};

export default async function SolarPage() {
  const content = await getSolarContent();
  const hero = content?.hero;
  const systemTypes = content?.systemTypes;
  const features = content?.features;
  const process = content?.process;
  const slider = content?.slider;
  const siteVisitCta = content?.siteVisitCta;
  const siteVisitForm = content?.siteVisitForm;
  const banner = content?.banner;
  const otherServices = content?.otherServices;

  return (
    <main className="flex-1">
      {hero ? (
        <section
          className="relative flex min-h-[85vh] items-center overflow-hidden pt-20"
          style={{ background: "linear-gradient(160deg, #080d19 0%, #101729 40%, #0A2010 100%)" }}
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <Image
              src={hero.image}
              alt=""
              fill
              priority
              loading="eager"
              className="object-cover object-center opacity-50"
              sizes="100vw"
            />
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(8,13,25,0.6) 0%, rgba(8,13,25,0.85) 60%, rgba(8,13,25,0.98) 100%), radial-gradient(ellipse 60% 60% at 80% 30%, rgba(224,138,0,0.15), transparent 60%)",
            }}
          />

          <div className="relative z-1 px-6 py-20 sm:px-12 lg:px-20">
            <ServiceDetailHero accent="amber" maxWidth="max-w-3xl">
              <nav aria-label="Breadcrumb" className="mb-5 text-[13px] text-muted">
                <Link href="/" className="transition-colors hover:text-white">
                  Home
                </Link>
                <span className="mx-2">/</span>
                <Link href="/products-services" className="transition-colors hover:text-white">
                  Products &amp; Services
                </Link>
                <span className="mx-2">/</span>
                <span className="text-[#94A3B8]">{hero.breadcrumbLabel}</span>
              </nav>

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber/30 bg-amber/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber">
                {hero.badge}
              </div>

              <h1 className="mb-6 font-display text-[clamp(40px,5.5vw,64px)] font-extrabold leading-[1.05] text-white">
                {hero.headingLine1}
                <br />
                <span className="bg-gradient-to-r from-amber via-yellow-400 to-teal bg-clip-text text-transparent">
                  {hero.headingHighlight}
                </span>
              </h1>

              <p className="mb-9 text-lg leading-[1.75] text-[#C3CDDB]">{hero.subhead}</p>

              {hero.primaryCta || hero.secondaryCta ? (
                <div className="flex flex-wrap items-center gap-4">
                  {hero.primaryCta ? (
                    <Link
                      href={hero.primaryCta.href}
                      data-cursor-interactive
                      className="inline-block rounded bg-amber px-7 py-3.5 text-[15px] font-semibold text-navy transition-all hover:bg-amber-light"
                    >
                      {hero.primaryCta.label}
                    </Link>
                  ) : null}
                  {hero.secondaryCta ? (
                    <a
                      href={hero.secondaryCta.href}
                      data-cursor-interactive
                      className="inline-block rounded border border-white/20 px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:border-amber hover:text-amber"
                    >
                      {hero.secondaryCta.label}
                    </a>
                  ) : null}
                </div>
              ) : null}
            </ServiceDetailHero>
          </div>
        </section>
      ) : null}

      {systemTypes && systemTypes.cards.length > 0 ? (
        <section id="system-types" className="bg-navy px-6 py-24 sm:px-12 lg:px-20 lg:py-28">
          <div className="mx-auto max-w-6xl">
            <Reveal className="mx-auto max-w-xl text-center">
              <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-amber">
                {systemTypes.eyebrow}
              </div>
              <h2 className="mb-4 font-display text-[clamp(32px,3.6vw,44px)] font-extrabold leading-[1.1] text-white">
                {systemTypes.heading}
              </h2>
              {systemTypes.intro ? (
                <p className="mx-auto max-w-md text-base leading-[1.7] text-[#94A3B8]">{systemTypes.intro}</p>
              ) : null}
            </Reveal>

            <StaggerGroup
              as="div"
              itemSelector="[data-stagger-item]"
              className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3"
            >
              {systemTypes.cards.map((system) => {
                const Icon = SERVICE_ICON_COMPONENTS[system.icon];
                return (
                  <Link
                    key={system.title}
                    href={system.href || "#"}
                    data-stagger-item
                    data-cursor-interactive
                    className="group rounded-[10px] border px-6 py-7 transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/60 focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
                    style={{
                      borderColor: iconChip(system.accentColor, 0.35),
                      background: `linear-gradient(135deg, #161e36, ${iconChip(system.accentColor, 0.22)})`,
                    }}
                  >
                    <div className="mb-4 text-white/90">
                      <Icon width={28} height={28} />
                    </div>
                    <h3 className="mb-2 font-display text-xl font-extrabold text-white">{system.title}</h3>
                    <p className="mb-4 text-[13px] leading-[1.65] text-[#94A3B8]">{system.description}</p>
                    <div className="flex flex-wrap items-center gap-3">
                      {system.tag ? (
                        <span
                          className="rounded-[4px] px-2.5 py-1 text-[11px] font-bold tracking-[0.3px]"
                          style={{ background: iconChip(system.accentColor, 0.15), color: system.accentColor }}
                        >
                          {system.tag}
                        </span>
                      ) : null}
                      <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-white/70 transition-transform duration-300 group-hover:translate-x-0.5">
                        View products
                        <span aria-hidden="true">→</span>
                      </span>
                    </div>
                  </Link>
                );
              })}
            </StaggerGroup>
          </div>
        </section>
      ) : null}

      {features && features.cards.length > 0 ? (
        <section className="bg-offwhite px-6 py-24 sm:px-12 lg:px-20 lg:py-28">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-[#059669]">
                {features.eyebrow}
              </div>
              <h2 className="mb-4 font-display text-[clamp(32px,3.6vw,44px)] font-extrabold leading-[1.1] text-navy">
                {features.heading}
              </h2>
              {features.intro ? (
                <p className="max-w-2xl text-base leading-[1.7] text-[#4A5568]">{features.intro}</p>
              ) : null}
            </Reveal>

            <StaggerGroup
              as="div"
              itemSelector="[data-stagger-item]"
              className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2"
            >
              {features.cards.map((feature) => {
                const Icon = SERVICE_ICON_COMPONENTS[feature.icon];
                return (
                  <div
                    key={feature.title}
                    data-stagger-item
                    className="flex items-start gap-4 rounded-[10px] border border-[#E2E8F0] bg-white px-7 py-7 transition-all hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(10,158,136,0.1)]"
                  >
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] text-navy"
                      style={{ background: iconChip(feature.accentColor, 0.18) }}
                    >
                      <Icon width={22} height={22} />
                    </div>
                    <div>
                      <h3 className="mb-1.5 font-display text-lg font-bold text-navy">{feature.title}</h3>
                      <p className="text-[13px] leading-[1.65] text-[#4A5568]">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </StaggerGroup>
          </div>
        </section>
      ) : null}

      {(process && process.steps.length > 0) || (slider && slider.images.length > 0) ? (
        <section className="bg-navy px-6 py-24 sm:px-12 lg:px-20 lg:py-28">
          <div className="mx-auto max-w-6xl">
            {process ? (
              <Reveal className="mx-auto max-w-xl text-center">
                <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-amber">
                  {process.eyebrow}
                </div>
                <h2 className="mb-4 font-display text-[clamp(32px,3.6vw,44px)] font-extrabold leading-[1.1] text-white">
                  {process.heading}
                </h2>
                {process.intro ? (
                  <p className="mx-auto max-w-md text-base leading-[1.7] text-[#94A3B8]">{process.intro}</p>
                ) : null}
              </Reveal>
            ) : null}

            {process && process.steps.length > 0 ? (
              <StaggerGroup
                as="div"
                itemSelector="[data-stagger-item]"
                className="relative mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-0"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-[10%] right-[10%] top-8 hidden h-0.5 lg:block"
                  style={{ background: "linear-gradient(90deg, var(--color-teal), var(--color-amber))" }}
                />
                {process.steps.map((step, i) => (
                  <div key={step.title} data-stagger-item className="px-3 text-center">
                    <div
                      className={`relative z-1 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 bg-card font-display text-xl font-extrabold ${
                        step.active ? "border-amber text-amber" : "border-teal text-teal"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <h3 className="mb-1.5 font-display text-[15px] font-bold text-white">{step.title}</h3>
                    <p className="text-xs leading-[1.5] text-muted">{step.description}</p>
                  </div>
                ))}
              </StaggerGroup>
            ) : null}

            {slider && slider.images.length > 0 ? (
              <div className="mt-16">
                <Reveal>
                  <div className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-teal">
                    {slider.eyebrow}
                  </div>
                  <ServiceSlider
                    slides={slider.images.map((img) => ({ src: img.image, alt: img.caption, caption: img.caption }))}
                    title="Solar Project Showcase"
                  />
                </Reveal>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {siteVisitCta ? (
        <section
          id="site-visit"
          className="relative overflow-hidden px-6 py-24 sm:px-12 lg:px-20"
          style={{ background: "linear-gradient(135deg, #101729 0%, #182037 60%, #141e40 100%)" }}
        >
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-amber">
                {siteVisitCta.eyebrow}
              </div>
              <h2 className="mb-4 font-display text-[clamp(32px,4vw,48px)] font-extrabold leading-[1.1] text-white">
                {siteVisitCta.headingLine1}
                <br />
                {siteVisitCta.headingLine2}
              </h2>
              <p className="max-w-[480px] text-base leading-[1.7] text-[#94A3B8]">{siteVisitCta.intro}</p>
            </Reveal>

            <Reveal delay={0.1}>
              <SiteVisitForm content={siteVisitForm} />
            </Reveal>
          </div>
        </section>
      ) : null}

      {banner ? (
        <section className="relative w-full overflow-hidden bg-navy2">
          {banner.image ? (
            <Image
              src={banner.image}
              alt="BTEL Solar Energy Solutions Banner"
              width={1920}
              height={480}
              sizes="100vw"
              className="h-[220px] sm:h-[300px] w-full object-cover object-center"
              loading="lazy"
              decoding="async"
            />
          ) : null}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/50 to-transparent"
          />
          <div className="absolute inset-0 flex items-center px-6 sm:px-12 lg:px-20">
            <div className="max-w-xl">
              <h3 className="mb-2 font-display text-2xl sm:text-3xl font-extrabold text-white">
                {banner.headingLine1}
              </h3>
              <p className="text-sm text-[#94A3B8]">{banner.intro}</p>
            </div>
          </div>
        </section>
      ) : null}

      {otherServices ? <OtherServicesGrid content={otherServices} /> : null}

      <SiteFooter />
    </main>
  );
}
