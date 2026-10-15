import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getSubstationContent } from "@/data/pages";
import { ServiceDetailHero } from "@/components/sections/service-detail-hero";
import { OtherServicesGrid } from "@/components/sections/other-services-grid";
import { ServiceSlider } from "@/components/ui/service-slider";
import { Reveal } from "@/components/ui/reveal";
import { StaggerGroup } from "@/components/ui/stagger-group";
import { SiteFooter } from "@/components/sections/site-footer";
import { SERVICE_ICON_COMPONENTS } from "@/lib/service-icons";
import { iconChip } from "@/lib/color";

export const metadata: Metadata = {
  title: "Substation & Switchgear Systems | B-Trac Engineering Ltd.",
  description:
    "Complete 33kV & 11kV electrical substation systems, power transformers, and HV/LV switchgear — the leading gateway of power to industries across Bangladesh.",
  openGraph: {
    title: "Substation & Switchgear Systems | B-Trac Engineering Ltd.",
    description:
      "Complete 33kV & 11kV electrical substation systems, power transformers, and HV/LV switchgear for industrial and utility clients across Bangladesh.",
    type: "website",
  },
};

export default async function SubstationServicePage() {
  const content = await getSubstationContent();
  const hero = content?.hero;
  const capabilities = content?.capabilities;
  const features = content?.features;
  const slider = content?.slider;
  const specs = content?.specs;
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
                "linear-gradient(180deg, rgba(14,21,40,0.65) 0%, rgba(14,21,40,0.85) 60%, rgba(14,21,40,0.98) 100%), radial-gradient(ellipse 70% 70% at 75% 35%, rgba(159,185,252,0.2), transparent 70%)",
            }}
          />

          <div className="relative z-1 px-6 py-20 sm:px-12 lg:px-20">
            <ServiceDetailHero accent="blue">
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

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-light/30 bg-blue-light/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-light">
                {hero.badge}
              </div>

              <h1 className="mb-6 font-display text-[clamp(40px,5.5vw,64px)] font-extrabold leading-[1.05] text-white">
                {hero.headingLine1}
                <br />
                <span className="bg-gradient-to-r from-blue-light to-teal bg-clip-text text-transparent">
                  {hero.headingHighlight}
                </span>
              </h1>

              <p className="mb-9 max-w-xl text-lg leading-[1.75] text-[#C3CDDB]">{hero.subhead}</p>

              {hero.stats.length > 0 ? (
                <div className="flex flex-wrap gap-10">
                  {hero.stats.map((stat) => (
                    <div key={stat.label}>
                      <div className="font-display text-[28px] font-extrabold text-white">
                        {stat.value}
                        {stat.unit ? <span className="text-base text-blue-light">{stat.unit}</span> : null}
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

      {capabilities && capabilities.cards.length > 0 ? (
        <section className="bg-navy2 px-6 py-20 sm:px-12 lg:px-20">
          <div className="mx-auto max-w-6xl">
            <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="mb-2 text-[11px] font-bold uppercase tracking-[2px] text-blue-light">
                  {capabilities.eyebrow}
                </div>
                <h2 className="font-display text-[clamp(26px,3vw,36px)] font-extrabold leading-[1.1] text-white">
                  {capabilities.heading}
                </h2>
              </div>
              {capabilities.intro ? (
                <p className="max-w-md text-[13px] leading-[1.6] text-[#94A3B8]">{capabilities.intro}</p>
              ) : null}
            </Reveal>

            <StaggerGroup
              as="div"
              itemSelector="[data-stagger-item]"
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {capabilities.cards.map((card) => {
                const Icon = SERVICE_ICON_COMPONENTS[card.icon];
                return (
                  <Link
                    key={card.title}
                    href={card.href || "#"}
                    data-stagger-item
                    data-cursor-interactive
                    className="group rounded-lg border border-white/10 bg-white/[0.04] p-6 transition-colors hover:border-blue-light/40 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-light/60 focus-visible:ring-offset-2 focus-visible:ring-offset-navy2"
                  >
                    <div
                      className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg"
                      style={{ background: iconChip(card.accentColor), color: card.accentColor }}
                    >
                      <Icon width={22} height={22} />
                    </div>
                    <h3 className="mb-1.5 font-display text-base font-bold text-white">{card.title}</h3>
                    <p className="text-xs leading-[1.6] text-[#94A3B8]">{card.description}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-blue-light transition-transform duration-300 group-hover:translate-x-0.5">
                      View products
                      <span aria-hidden="true">→</span>
                    </span>
                  </Link>
                );
              })}
            </StaggerGroup>
          </div>
        </section>
      ) : null}

      {(features && features.cards.length > 0) || (slider && slider.images.length > 0) ? (
        <section className="bg-offwhite px-6 py-24 sm:px-12 lg:px-20 lg:py-28">
          <div className="mx-auto max-w-6xl">
            {features ? (
              <Reveal className="mx-auto max-w-2xl text-center">
                <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-blue">
                  {features.eyebrow}
                </div>
                <h2 className="mb-4 font-display text-[clamp(32px,3.6vw,44px)] font-extrabold leading-[1.1] text-navy">
                  {features.heading}
                </h2>
                {features.intro ? (
                  <p className="mx-auto max-w-2xl text-base leading-[1.7] text-[#4A5568]">{features.intro}</p>
                ) : null}
              </Reveal>
            ) : null}

            {features && features.cards.length > 0 ? (
              <StaggerGroup
                as="div"
                itemSelector="[data-stagger-item]"
                className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {features.cards.map((feature) => {
                  const Icon = SERVICE_ICON_COMPONENTS[feature.icon];
                  return (
                    <div
                      key={feature.title}
                      data-stagger-item
                      className="relative overflow-hidden rounded-[10px] border border-[#E2E8F0] bg-white px-6 py-7 transition-transform hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(32,49,105,0.1)]"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 top-0 h-[3px]"
                        style={{ background: "linear-gradient(90deg, var(--color-blue), var(--color-teal))" }}
                      />
                      <div
                        className="mb-3.5 flex h-11 w-11 items-center justify-center rounded-lg"
                        style={{ background: iconChip(feature.accentColor), color: feature.accentColor }}
                      >
                        <Icon width={22} height={22} />
                      </div>
                      <h3 className="mb-2 font-display text-lg font-extrabold text-navy">{feature.title}</h3>
                      <p className="text-[13px] leading-[1.65] text-[#4A5568]">{feature.description}</p>
                    </div>
                  );
                })}
              </StaggerGroup>
            ) : null}

            {slider && slider.images.length > 0 ? (
              <div className="mt-16">
                <Reveal>
                  <div className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-blue">
                    {slider.eyebrow}
                  </div>
                  <ServiceSlider
                    slides={slider.images.map((img) => ({ src: img.image, alt: img.caption, caption: img.caption }))}
                    title="Substation Showcase"
                  />
                </Reveal>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {specs && specs.rows.length > 0 ? (
        <section className="bg-navy px-6 py-24 sm:px-12 lg:px-20 lg:py-28">
          <div className="mx-auto max-w-6xl">
            <Reveal className="mx-auto max-w-2xl text-center">
              <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-blue-light">
                {specs.eyebrow}
              </div>
              <h2 className="mb-4 font-display text-[clamp(32px,3.6vw,44px)] font-extrabold leading-[1.1] text-white">
                {specs.heading}
              </h2>
            </Reveal>

            <div className="mt-12 overflow-hidden rounded-[10px] border border-border bg-card">
              <table className="w-full border-collapse">
                <StaggerGroup as="tbody" itemSelector="[data-stagger-item]" stagger={0.05} y={8}>
                  {specs.rows.map((spec) => (
                    <tr key={spec.label} data-stagger-item className="border-b border-border last:border-none">
                      <td className="w-2/5 px-6 py-4 text-sm font-medium text-muted">{spec.label}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-white">{spec.value}</td>
                    </tr>
                  ))}
                </StaggerGroup>
              </table>
            </div>
          </div>
        </section>
      ) : null}

      {otherServices ? <OtherServicesGrid content={otherServices} /> : null}

      <SiteFooter />
    </main>
  );
}
