import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getWaterTreatmentContent } from "@/data/pages";
import { ServiceDetailHero } from "@/components/sections/service-detail-hero";
import { OtherServicesGrid } from "@/components/sections/other-services-grid";
import { ServiceSlider } from "@/components/ui/service-slider";
import { Reveal } from "@/components/ui/reveal";
import { StaggerGroup } from "@/components/ui/stagger-group";
import { SiteFooter } from "@/components/sections/site-footer";
import { SERVICE_ICON_COMPONENTS } from "@/lib/service-icons";
import { iconChip } from "@/lib/color";

export const metadata: Metadata = {
  title: "Water Treatment Chemicals | B-Trac Engineering Ltd.",
  description:
    "Authorized distributor of NALCO (Ecolab) water treatment chemicals in Bangladesh — boiler, cooling tower, RO membrane, and engine coolant programs.",
  openGraph: {
    title: "Water Treatment Chemicals | B-Trac Engineering Ltd.",
    description:
      "Authorized distributor of NALCO (Ecolab) water treatment chemicals in Bangladesh. Complete industrial water management solutions.",
    type: "website",
  },
};

export default async function WaterTreatmentServicePage() {
  const content = await getWaterTreatmentContent();
  const hero = content?.hero;
  const features = content?.features;
  const slider = content?.slider;
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
                "linear-gradient(180deg, rgba(14,21,40,0.65) 0%, rgba(14,21,40,0.85) 60%, rgba(14,21,40,0.98) 100%), radial-gradient(ellipse 70% 70% at 75% 35%, rgba(124,58,237,0.18), transparent 70%)",
            }}
          />

          <div className="relative z-1 px-6 py-20 sm:px-12 lg:px-20">
            <ServiceDetailHero accent="purple" maxWidth="max-w-6xl">
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

              <div className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-purple/30 bg-purple/[0.1] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
                <span className="h-1.5 w-1.5 rounded-full bg-purple" />
                {hero.badge}
              </div>

              <h1 className="mb-6 font-display text-[clamp(40px,5.5vw,64px)] font-extrabold leading-[1.05] text-white">
                {hero.headingLine1}
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-purple to-teal bg-clip-text text-transparent">
                  {hero.headingHighlight}
                </span>
              </h1>

              <p className="mb-8 max-w-lg text-lg leading-[1.75] text-[#C3CDDB]">{hero.subhead}</p>
            </ServiceDetailHero>
          </div>
        </section>
      ) : null}

      {(features && features.cards.length > 0) || (slider && slider.images.length > 0) ? (
        <section className="bg-navy2 px-6 py-24 sm:px-12 lg:px-20 lg:py-28">
          <div className="mx-auto max-w-6xl">
            {features ? (
              <Reveal className="mx-auto max-w-xl text-center">
                <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-purple">
                  {features.eyebrow}
                </div>
                <h2 className="mb-4 font-display text-[clamp(32px,3.6vw,44px)] font-extrabold leading-[1.1] text-white">
                  {features.heading}
                </h2>
                {features.intro ? (
                  <p className="mx-auto text-base leading-[1.7] text-[#94A3B8]">{features.intro}</p>
                ) : null}
              </Reveal>
            ) : null}

            {features && features.cards.length > 0 ? (
              <StaggerGroup
                as="div"
                itemSelector="[data-stagger-item]"
                className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
              >
                {features.cards.map((feature) => {
                  const Icon = SERVICE_ICON_COMPONENTS[feature.icon];
                  return (
                    <Link
                      key={feature.title}
                      href={feature.href || "#"}
                      data-stagger-item
                      data-cursor-interactive
                      className="group rounded-lg border border-border bg-card p-6 transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple/60 focus-visible:ring-offset-2 focus-visible:ring-offset-navy2"
                    >
                      <div
                        className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg"
                        style={{ background: iconChip(feature.accentColor), color: feature.accentColor }}
                      >
                        <Icon width={22} height={22} />
                      </div>
                      <h3 className="mb-1.5 font-display text-base font-bold text-white">{feature.title}</h3>
                      <p className="text-xs leading-[1.6] text-[#94A3B8]">{feature.description}</p>
                      <span
                        className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold transition-transform duration-300 group-hover:translate-x-0.5"
                        style={{ color: feature.accentColor }}
                      >
                        View products
                        <span aria-hidden="true">→</span>
                      </span>
                    </Link>
                  );
                })}
              </StaggerGroup>
            ) : null}

            {slider && slider.images.length > 0 ? (
              <div className="mt-16">
                <Reveal>
                  <div className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-purple">
                    {slider.eyebrow}
                  </div>
                  <ServiceSlider
                    slides={slider.images.map((img) => ({ src: img.image, alt: img.caption, caption: img.caption }))}
                    title="Water Treatment Showcase"
                  />
                </Reveal>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {otherServices ? <OtherServicesGrid content={otherServices} /> : null}

      <SiteFooter />
    </main>
  );
}
