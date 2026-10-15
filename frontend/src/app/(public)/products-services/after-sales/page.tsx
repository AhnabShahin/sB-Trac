import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAfterSalesContent } from "@/data/pages";
import { ServiceDetailHero } from "@/components/sections/service-detail-hero";
import { Reveal } from "@/components/ui/reveal";
import { StaggerGroup } from "@/components/ui/stagger-group";
import { SiteFooter } from "@/components/sections/site-footer";
import { SERVICE_ICON_COMPONENTS } from "@/lib/service-icons";
import { iconChip } from "@/lib/color";

export const metadata: Metadata = {
  title: "After Sales Support & Service | B-Trac Engineering Ltd.",
  description:
    "Nationwide, round-the-clock after-sales support — AMC contracts, spare parts, and emergency response for every BTEL substation, solar, MEP, and water treatment project.",
  openGraph: {
    title: "After Sales Support & Service | B-Trac Engineering Ltd.",
    description:
      "Nationwide, round-the-clock after-sales support ensuring reliable operation for every BTEL-delivered solution across Bangladesh.",
    type: "website",
  },
};

export default async function AfterSalesServicePage() {
  const content = await getAfterSalesContent();
  const hero = content?.hero;
  const stats = content?.stats;
  const services = content?.services;
  const process = content?.process;
  const coverage = content?.coverage;
  const cta = content?.cta;

  return (
    <main className="flex-1">
      {hero ? (
        <section className="relative flex min-h-[80vh] items-center overflow-hidden pt-20 bg-navy">
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
                "linear-gradient(180deg, rgba(14,21,40,0.65) 0%, rgba(14,21,40,0.85) 60%, rgba(14,21,40,0.98) 100%), radial-gradient(ellipse 50% 60% at 80% 40%, rgba(14,165,181,0.14) 0%, transparent 60%)",
            }}
          />

          <div className="relative z-1 px-6 py-20 sm:px-12 lg:px-20 lg:py-24">
            <ServiceDetailHero accent="cyan" maxWidth="max-w-3xl">
              <nav aria-label="Breadcrumb" className="mb-5 text-[13px] text-muted">
                <Link href="/" className="transition-colors hover:text-white">
                  Home
                </Link>
                <span className="mx-2">/</span>
                <span className="text-[#94A3B8]">{hero.breadcrumbLabel}</span>
              </nav>

              <div
                data-hero-item
                className="mb-7 inline-flex w-fit items-center gap-2 rounded-full border border-cyan/30 bg-cyan/[0.1] px-4 py-1.5 text-xs font-bold uppercase tracking-[1px] text-cyan"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
                {hero.badge}
              </div>

              <h1
                data-hero-item
                className="mb-6 font-display text-[clamp(40px,5.5vw,64px)] font-extrabold leading-[0.95] tracking-[-1px] text-white"
              >
                {hero.headingLine1}
                <br />
                <span className="text-cyan">{hero.headingHighlight}</span> {hero.headingSuffix}
              </h1>

              <p data-hero-item className="mb-8 max-w-xl text-base leading-[1.75] text-[#94A3B8]">
                {hero.subhead}
              </p>
            </ServiceDetailHero>
          </div>
        </section>
      ) : null}

      {stats && stats.stats.length > 0 ? (
        <div className="border-y border-border bg-card px-6 py-14 sm:px-12 lg:px-20">
          <StaggerGroup
            as="div"
            itemSelector="[data-stagger-item]"
            className="mx-auto grid max-w-6xl grid-cols-2 gap-y-8 lg:grid-cols-4 lg:gap-y-0"
          >
            {stats.stats.map((stat, i) => (
              <div
                key={stat.value + stat.description}
                data-stagger-item
                className={`px-4 text-center sm:px-6 ${i !== stats.stats.length - 1 ? "lg:border-r lg:border-border" : ""}`}
              >
                <div className="font-display text-4xl font-extrabold leading-none text-white sm:text-5xl">
                  {stat.value}
                  <span className="text-teal">{stat.accent}</span>
                </div>
                <div className="mt-2 text-[13px] leading-[1.5] text-muted">{stat.description}</div>
              </div>
            ))}
          </StaggerGroup>
        </div>
      ) : null}

      {services && services.cards.length > 0 ? (
        <section className="bg-navy px-6 py-24 sm:px-12 lg:px-20 lg:py-28">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-cyan">{services.eyebrow}</div>
              <h2 className="mb-4 font-display text-[clamp(32px,3.6vw,44px)] font-extrabold leading-[1.1] text-white">
                {services.heading}
              </h2>
              {services.intro ? (
                <p className="max-w-2xl text-base leading-[1.7] text-[#94A3B8]">{services.intro}</p>
              ) : null}
            </Reveal>

            <StaggerGroup
              as="div"
              itemSelector="[data-stagger-item]"
              className="mt-12 grid grid-cols-1 gap-[2px] overflow-hidden rounded-xl bg-border sm:grid-cols-2 lg:grid-cols-3"
            >
              {services.cards.map((service, i) => {
                const Icon = SERVICE_ICON_COMPONENTS[service.icon];
                return (
                  <div
                    key={service.title}
                    data-stagger-item
                    className={`relative overflow-hidden px-9 py-11 transition-colors hover:bg-[#1d2640] ${
                      service.highlight
                        ? "bg-[linear-gradient(135deg,rgba(14,165,181,0.08),var(--color-card))]"
                        : "bg-card"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute right-4 top-3 select-none font-display text-[72px] font-extrabold leading-none text-cyan/[0.06]"
                    >
                      {service.highlight ? "✓" : String(i + 1).padStart(2, "0")}
                    </span>
                    <div
                      className="relative mb-5 flex h-12 w-12 items-center justify-center rounded-lg border"
                      style={{ borderColor: iconChip(service.accentColor, 0.3), background: iconChip(service.accentColor, 0.12), color: service.accentColor }}
                    >
                      <Icon width={22} height={22} />
                    </div>
                    <h3 className="relative mb-2.5 font-display text-xl font-extrabold leading-[1.1] text-white">
                      {service.title}
                    </h3>
                    <p className="relative text-sm leading-[1.65] text-[#94A3B8]">{service.description}</p>
                  </div>
                );
              })}
            </StaggerGroup>
          </div>
        </section>
      ) : null}

      {process && process.steps.length > 0 ? (
        <section className="bg-navy2 px-6 py-24 sm:px-12 lg:px-20 lg:py-28">
          <div className="mx-auto max-w-6xl">
            <Reveal className="mx-auto max-w-xl text-center">
              <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-cyan">{process.eyebrow}</div>
              <h2 className="mb-4 font-display text-[clamp(32px,3.6vw,44px)] font-extrabold leading-[1.1] text-white">
                {process.heading}
              </h2>
              {process.intro ? (
                <p className="mx-auto max-w-md text-base leading-[1.7] text-[#94A3B8]">{process.intro}</p>
              ) : null}
            </Reveal>

            <StaggerGroup
              as="div"
              itemSelector="[data-stagger-item]"
              className="relative mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-[10%] right-[10%] top-9 hidden h-px opacity-30 lg:block"
                style={{ background: "linear-gradient(90deg, var(--color-teal), var(--color-blue), var(--color-teal))" }}
              />
              {process.steps.map((step, i) => {
                const Icon = step.icon ? SERVICE_ICON_COMPONENTS[step.icon] : null;
                const accent = step.accentColor ?? "#0a9e88";
                return (
                  <div key={step.title} data-stagger-item className="px-5 text-center">
                    <div
                      className="relative z-1 mx-auto mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-full border-2 bg-card text-white"
                      style={{ borderColor: accent }}
                    >
                      {Icon ? <Icon width={26} height={26} /> : null}
                      <span
                        className="absolute -right-1.5 -top-1.5 flex h-[22px] w-[22px] items-center justify-center rounded-full font-display text-[11px] font-extrabold text-white"
                        style={{ background: accent }}
                      >
                        {i + 1}
                      </span>
                    </div>
                    <h3 className="mb-2 font-display text-[17px] font-bold text-white">{step.title}</h3>
                    <p className="text-[13px] leading-[1.6] text-muted">{step.description}</p>
                  </div>
                );
              })}
            </StaggerGroup>
          </div>
        </section>
      ) : null}

      {coverage ? (
        <section className="bg-navy px-6 py-24 sm:px-12 lg:px-20 lg:py-28">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center lg:gap-20">
            <Reveal>
              <div className="relative overflow-hidden rounded-xl border border-border bg-card px-10 py-12 text-center">
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-[3px]"
                  style={{ background: "linear-gradient(90deg, var(--color-teal), var(--color-blue))" }}
                />
                <div
                  className="font-display text-[72px] font-extrabold leading-none"
                  style={{
                    background: "linear-gradient(135deg, var(--color-teal), var(--color-blue))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  BD
                </div>
                <div className="mt-1 font-display text-lg font-bold tracking-wide text-muted">
                  {coverage.cardHeading}
                </div>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-[1.7] text-[#94A3B8]">{coverage.cardIntro}</p>
                {coverage.regions.length > 0 ? (
                  <StaggerGroup
                    as="div"
                    itemSelector="[data-stagger-item]"
                    stagger={0.04}
                    y={10}
                    className="mt-5 flex flex-wrap justify-center gap-2"
                  >
                    {coverage.regions.map((region) => (
                      <span
                        key={region}
                        data-stagger-item
                        className="rounded-[4px] border border-teal/20 bg-teal/[0.1] px-3 py-1.5 text-xs font-semibold text-teal"
                      >
                        {region}
                      </span>
                    ))}
                  </StaggerGroup>
                ) : null}
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-cyan">Coverage Details</div>
              <h2 className="mb-4 font-display text-[clamp(32px,3.6vw,44px)] font-extrabold leading-[1.1] text-white">
                {coverage.headingLine1}
                <br />
                {coverage.headingLine2}
              </h2>
              <p className="mb-9 max-w-2xl text-base leading-[1.7] text-[#94A3B8]">{coverage.intro}</p>
              {coverage.points.length > 0 ? (
                <StaggerGroup
                  as="div"
                  itemSelector="[data-stagger-item]"
                  stagger={0.08}
                  y={16}
                  className="flex flex-col gap-5"
                >
                  {coverage.points.map((point) => {
                    const Icon = SERVICE_ICON_COMPONENTS[point.icon];
                    return (
                      <div key={point.title} data-stagger-item className="flex items-start gap-5">
                        <div
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border"
                          style={{ borderColor: iconChip(point.accentColor, 0.3), background: iconChip(point.accentColor, 0.12), color: point.accentColor }}
                        >
                          <Icon width={20} height={20} />
                        </div>
                        <div>
                          <h3 className="mb-1 font-display text-[17px] font-bold text-white">{point.title}</h3>
                          <p className="text-sm leading-[1.6] text-muted">{point.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </StaggerGroup>
              ) : null}
            </Reveal>
          </div>
        </section>
      ) : null}

      {cta ? (
        <section
          className="px-6 py-20 text-center sm:px-12 lg:px-20"
          style={{ background: "linear-gradient(135deg, var(--color-navy2), var(--color-navy))" }}
        >
          <Reveal className="mx-auto max-w-2xl">
            <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-cyan">{cta.eyebrow}</div>
            <h2 className="mb-4 font-display text-[clamp(32px,4vw,48px)] font-extrabold leading-[1.1] text-white">
              {cta.headingLine1}
              <br />
              {cta.headingLine2}
            </h2>
            <p className="mx-auto text-base leading-[1.75] text-[#94A3B8]">{cta.intro}</p>

            {cta.options.length > 0 ? (
              <StaggerGroup
                as="div"
                itemSelector="[data-stagger-item]"
                stagger={0.1}
                className="mx-auto mt-12 grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-2"
              >
                {cta.options.map((option) => {
                  const Icon = SERVICE_ICON_COMPONENTS[option.icon];
                  return (
                    <div
                      key={option.title}
                      data-stagger-item
                      className="group rounded-[10px] border border-border bg-card px-6 py-7 text-center transition-colors"
                    >
                      <div
                        className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-lg transition-colors"
                        style={{ background: iconChip(option.accentColor), color: option.accentColor }}
                      >
                        <Icon width={20} height={20} />
                      </div>
                      <div className="mb-1 font-display text-[17px] font-bold text-white">{option.title}</div>
                      <div className="mb-4 text-[13px] text-muted">{option.description}</div>
                      <a
                        href={option.href}
                        target={option.href.startsWith("http") ? "_blank" : undefined}
                        rel={option.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        data-cursor-interactive
                        className="inline-block border-b pb-px text-[13px] font-semibold transition-colors"
                        style={{ borderColor: iconChip(option.accentColor, 0.4), color: option.accentColor }}
                      >
                        {option.value}
                      </a>
                    </div>
                  );
                })}
              </StaggerGroup>
            ) : null}

            {cta.ctaLabel ? (
              <div className="mt-8">
                <Link
                  href={cta.ctaHref || "/contact"}
                  data-cursor-interactive
                  className="inline-flex items-center gap-2 rounded bg-teal px-8 py-3.5 text-[15px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-teal-dark"
                >
                  {cta.ctaLabel}
                </Link>
              </div>
            ) : null}
          </Reveal>
        </section>
      ) : null}

      <SiteFooter />
    </main>
  );
}
