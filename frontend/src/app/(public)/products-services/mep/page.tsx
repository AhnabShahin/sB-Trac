import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getMepContent } from "@/data/pages";
import { ServiceDetailHero } from "@/components/sections/service-detail-hero";
import { OtherServicesGrid } from "@/components/sections/other-services-grid";
import { ServiceSlider } from "@/components/ui/service-slider";
import { Reveal } from "@/components/ui/reveal";
import { StaggerGroup } from "@/components/ui/stagger-group";
import { SiteFooter } from "@/components/sections/site-footer";
import { SERVICE_ICON_COMPONENTS } from "@/lib/service-icons";
import { iconChip } from "@/lib/color";

export const metadata: Metadata = {
  title: "MEP / EPC Solutions | B-Trac Engineering Ltd.",
  description:
    "Mechanical, Electrical, and Plumbing engineering with stark focus on construction, safety & security — plus complete generator EPC solutions across Bangladesh.",
  openGraph: {
    title: "MEP / EPC Solutions | B-Trac Engineering Ltd.",
    description:
      "Turnkey MEP/EPC solutions spanning mechanical, electrical, plumbing, HVAC, fire protection, and industrial generator installation.",
    type: "website",
  },
};

export default async function MepServicePage() {
  const content = await getMepContent();
  const hero = content?.hero;
  const pillars = content?.pillars;
  const services = content?.services;
  const slider = content?.slider;
  const brands = content?.brands;
  const otherServices = content?.otherServices;

  return (
    <main className="flex-1">
      {hero ? (
        <section className="relative flex min-h-[85vh] items-center overflow-hidden pt-20 bg-navy">
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
                "linear-gradient(180deg, rgba(16,23,41,0.65) 0%, rgba(16,23,41,0.85) 60%, rgba(16,23,41,0.98) 100%), radial-gradient(ellipse 70% 70% at 75% 35%, rgba(224,138,0,0.18), transparent 70%)",
            }}
          />

          <div className="relative z-1 px-6 py-20 sm:px-12 lg:px-20">
            <ServiceDetailHero accent="amber">
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

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber/30 bg-amber/[0.12] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber">
                {hero.badge}
              </div>

              <h1 className="mb-6 max-w-[640px] font-display text-[clamp(40px,5.5vw,64px)] font-extrabold leading-[1.05] text-white">
                {hero.headingLine1}{" "}
                <span className="bg-gradient-to-r from-amber via-yellow-400 to-teal bg-clip-text text-transparent">
                  {hero.headingHighlight}
                </span>
                <br />
                {hero.headingSuffix}
              </h1>

              <p className="mb-9 max-w-xl text-lg leading-[1.75] text-[#C3CDDB]">{hero.subhead}</p>

              {hero.stats.length > 0 ? (
                <div className="flex flex-wrap gap-8">
                  {hero.stats.map((stat) => (
                    <div key={stat.label}>
                      <div className="font-display text-[26px] font-extrabold text-white">
                        {stat.value}
                        {stat.unit ? <span className="text-base text-amber">{stat.unit}</span> : null}
                      </div>
                      <div className="mt-1 text-xs text-muted">{stat.label}</div>
                    </div>
                  ))}
                </div>
              ) : null}
            </ServiceDetailHero>
          </div>
        </section>
      ) : null}

      {pillars && pillars.pillars.length > 0 ? (
        <section className="bg-navy px-6 py-20 sm:px-12 lg:px-20">
          <div className="mx-auto max-w-5xl">
            <StaggerGroup
              as="div"
              itemSelector="[data-stagger-item]"
              className="grid grid-cols-1 gap-[2px] overflow-hidden rounded-xl bg-border sm:grid-cols-3"
            >
              {pillars.pillars.map((pillar) => (
                <div
                  key={pillar.letter}
                  data-stagger-item
                  className="bg-navy2 px-7 py-8 text-center transition-colors hover:bg-[#132030]"
                >
                  <div
                    className="mb-2 font-display text-[72px] font-extrabold leading-none"
                    style={{ color: iconChip(pillar.accentColor, 0.4) }}
                  >
                    {pillar.letter}
                  </div>
                  <h3 className="mb-2 font-display text-lg font-bold text-white">{pillar.name}</h3>
                  <p className="text-[13px] leading-[1.6] text-muted">{pillar.description}</p>
                </div>
              ))}
            </StaggerGroup>
          </div>
        </section>
      ) : null}

      {(services && services.cards.length > 0) || (slider && slider.images.length > 0) ? (
        <section className="bg-navy2 px-6 py-24 sm:px-12 lg:px-20 lg:py-28">
          <div className="mx-auto max-w-5xl">
            {services ? (
              <Reveal>
                <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-amber">
                  {services.eyebrow}
                </div>
                <h2 className="mb-4 font-display text-[clamp(32px,3.6vw,44px)] font-extrabold leading-[1.1] text-white">
                  {services.heading}
                </h2>
                {services.intro ? (
                  <p className="max-w-2xl text-base leading-[1.7] text-[#94A3B8]">{services.intro}</p>
                ) : null}
              </Reveal>
            ) : null}

            {services && services.cards.length > 0 ? (
              <StaggerGroup
                as="div"
                itemSelector="[data-stagger-item]"
                className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2"
              >
                {services.cards.map((service) => {
                  const Icon = SERVICE_ICON_COMPONENTS[service.icon];
                  return (
                    <Link
                      key={service.title}
                      href={service.href || "#"}
                      data-stagger-item
                      data-cursor-interactive
                      className="group relative flex items-start gap-4 overflow-hidden rounded-[10px] border border-border bg-card px-7 py-7 transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/60 focus-visible:ring-offset-2 focus-visible:ring-offset-navy2"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute inset-y-0 left-0 w-[3px]"
                        style={{ background: service.accentColor }}
                      />
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
                        style={{ background: iconChip(service.accentColor), color: service.accentColor }}
                      >
                        <Icon width={22} height={22} />
                      </div>
                      <div>
                        <h3 className="mb-1.5 font-display text-lg font-bold text-white">{service.title}</h3>
                        <p className="text-[13px] leading-[1.65] text-[#94A3B8]">{service.description}</p>
                        <span
                          className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold transition-transform duration-300 group-hover:translate-x-0.5"
                          style={{ color: service.accentColor }}
                        >
                          View products
                          <span aria-hidden="true">→</span>
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </StaggerGroup>
            ) : null}

            {slider && slider.images.length > 0 ? (
              <div className="mt-16">
                <Reveal>
                  <div className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-amber">
                    {slider.eyebrow}
                  </div>
                  <ServiceSlider
                    slides={slider.images.map((img) => ({ src: img.image, alt: img.caption, caption: img.caption }))}
                    title="MEP Showcase"
                  />
                </Reveal>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {brands && brands.brands.length > 0 ? (
        <section className="bg-navy px-6 py-20 sm:px-12 lg:px-20">
          <div className="mx-auto max-w-5xl text-center">
            <Reveal>
              <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-teal">{brands.eyebrow}</div>
              <h2 className="mb-8 font-display text-2xl font-extrabold text-white">{brands.heading}</h2>
            </Reveal>
            <div className="flex flex-wrap justify-center gap-3">
              {brands.brands.map((brand) => (
                <span
                  key={brand}
                  className="rounded-md border border-border bg-card px-5 py-2.5 font-display text-sm font-semibold text-white/90"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {otherServices ? <OtherServicesGrid content={otherServices} /> : null}

      <SiteFooter />
    </main>
  );
}
