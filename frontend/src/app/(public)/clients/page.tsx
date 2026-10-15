import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getClientsContent } from "@/data/pages";
import type { ClientsTrustIcon, ProjectsAccent } from "@/data/content-types";
import { ServiceDetailHero } from "@/components/sections/service-detail-hero";
import { ClientIndustryBandsView } from "@/components/sections/client-industry-bands-view";
import { Reveal } from "@/components/ui/reveal";
import { StaggerGroup } from "@/components/ui/stagger-group";
import { Counter } from "@/components/ui/counter";
import { Magnetic } from "@/components/ui/magnetic";
import { SiteFooter } from "@/components/sections/site-footer";
import {
  LandmarkIcon,
  CapIcon,
  FactoryIcon,
  GlobeIcon,
  type IconProps,
} from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Our Clients | B-Trac Engineering Ltd.",
  description:
    "60+ industry leaders trust BTEL — from FMCG multinationals and pharmaceutical majors to government utilities and telecom operators, across every major sector in Bangladesh since 2009.",
  openGraph: {
    title: "Our Clients | B-Trac Engineering Ltd.",
    description:
      "From Fortune 500 multinationals to government institutions and industrial conglomerates — BTEL has delivered engineering excellence across every major sector since 2009.",
    type: "website",
  },
};

const TRUST_ICON_MAP: Record<ClientsTrustIcon, (props: IconProps) => React.JSX.Element> = {
  factory: FactoryIcon,
  globe: GlobeIcon,
  landmark: LandmarkIcon,
  cap: CapIcon,
};

const BADGE_ACCENT: Record<ProjectsAccent, { chip: string; dot: string; text: string }> = {
  blue: { chip: "border-blue-light/30 bg-blue-light/[0.10] text-blue-light", dot: "bg-blue-light", text: "text-blue-light" },
  teal: { chip: "border-teal/30 bg-teal/[0.10] text-teal", dot: "bg-teal", text: "text-teal" },
  amber: { chip: "border-amber/30 bg-amber/[0.10] text-amber", dot: "bg-amber", text: "text-amber" },
  purple: { chip: "border-purple/30 bg-purple/[0.10] text-purple", dot: "bg-purple", text: "text-purple" },
  cyan: { chip: "border-cyan/30 bg-cyan/[0.10] text-cyan", dot: "bg-cyan", text: "text-cyan" },
};

export default async function ClientsPage() {
  const content = await getClientsContent();
  const hero = content?.clientsHero;
  const stats = content?.clientsStats?.stats ?? [];
  const bands = content?.clientsBands?.industries ?? [];
  const testimonials = content?.clientsTestimonials;
  const cta = content?.clientsCta;
  const accent = BADGE_ACCENT[hero?.accent ?? "teal"] ?? BADGE_ACCENT.teal;

  return (
    <main className="flex-1">
      {hero ? (
        <section
          className="relative flex min-h-[64vh] items-center overflow-hidden pt-16"
          style={{ background: "linear-gradient(160deg, #080d19 0%, #101729 45%, #0e1528 100%)" }}
        >
          {hero.image ? (
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
              <Image
                src={hero.image}
                alt=""
                fill
                priority
                loading="eager"
                className="bg-ken-burns object-cover object-center opacity-50 will-change-transform"
                sizes="100vw"
              />
            </div>
          ) : null}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(14,21,40,0.70) 0%, rgba(14,21,40,0.85) 60%, rgba(14,21,40,0.98) 100%), radial-gradient(ellipse 60% 70% at 80% 40%, rgba(10,158,136,0.10) 0%, transparent 60%), radial-gradient(ellipse 40% 50% at 10% 80%, rgba(159,185,252,0.08) 0%, transparent 60%)",
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
            <ServiceDetailHero accent={hero.accent} maxWidth="max-w-3xl">
              <nav aria-label="Breadcrumb" className="mb-5 text-[13px] text-muted">
                <Link href="/" className="transition-colors hover:text-white">
                  Home
                </Link>
                <span className="mx-2">/</span>
                <span className="text-[#94A3B8]">Clients</span>
              </nav>

              {hero.badge ? (
                <div
                  data-hero-item
                  className={`mb-7 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wider ${accent.chip}`}
                >
                  <span className={`h-1.5 w-1.5 shrink-0 animate-[var(--animate-pulse-dot)] rounded-full ${accent.dot}`} />
                  {hero.badge}
                </div>
              ) : null}

              <h1
                data-hero-item
                className="mb-6 font-display text-[clamp(40px,5vw,64px)] font-extrabold leading-[1.05] tracking-[-1px] text-white"
              >
                {hero.headingLine1}
                <br />
                <span className={accent.text}>{hero.headingHighlight}</span>
                {hero.headingSuffix ? (
                  <>
                    <br />
                    {hero.headingSuffix}
                  </>
                ) : null}
              </h1>

              <p data-hero-item className="max-w-xl text-base leading-[1.75] text-[#94A3B8] sm:text-lg">
                {hero.subhead}
              </p>

              {hero.badges.length > 0 ? (
                <StaggerGroup
                  as="div"
                  itemSelector="[data-stagger-item]"
                  className="mt-9 flex flex-wrap gap-3"
                >
                  {hero.badges.map((badge) => {
                    const Icon = TRUST_ICON_MAP[badge.icon] ?? FactoryIcon;
                    return (
                      <div
                        key={badge.title}
                        data-stagger-item
                        className="flex items-center gap-3 rounded-lg border border-border bg-white/[0.03] px-5 py-3.5"
                      >
                        <Icon width={20} height={20} className="shrink-0 text-teal" />
                        <div>
                          <div className="text-sm font-bold text-white">{badge.title}</div>
                          <div className="text-[13px] text-muted">{badge.subtitle}</div>
                        </div>
                      </div>
                    );
                  })}
                </StaggerGroup>
              ) : null}
            </ServiceDetailHero>
          </div>
        </section>
      ) : null}

      {stats.length > 0 ? (
        <section className="border-y border-border bg-card">
          <StaggerGroup
            as="div"
            itemSelector="[data-stagger-item]"
            className="mx-auto grid max-w-6xl grid-cols-2 gap-px bg-border lg:grid-cols-4"
          >
            {stats.map((stat) => (
              <div key={stat.label} data-stagger-item className="bg-card px-6 py-10 text-center">
                <Counter
                  value={stat.value}
                  suffix={stat.suffix}
                  className="font-display text-[clamp(32px,3.6vw,44px)] font-extrabold leading-none text-white"
                  suffixClassName="text-teal"
                />
                <div className="mt-2 whitespace-pre-line text-[13px] leading-[1.4] text-muted">
                  {stat.label}
                </div>
              </div>
            ))}
          </StaggerGroup>
        </section>
      ) : null}

      {bands.length > 0 ? <ClientIndustryBandsView industries={bands} headingAs="h2" /> : null}

      {testimonials && testimonials.items.length > 0 ? (
        <section className="bg-navy px-6 py-24 sm:px-12 lg:px-20 lg:py-28">
          <div className="mx-auto max-w-6xl">
            <Reveal className="mx-auto max-w-xl text-center">
              <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-teal">
                {testimonials.eyebrow}
              </div>
              <h2 className="font-display text-[clamp(32px,3.6vw,44px)] font-extrabold leading-[1.1] text-white">
                {testimonials.headingLine1}
                <br />
                <span className="text-teal">{testimonials.headingHighlight}</span>
              </h2>
            </Reveal>

            <StaggerGroup
              as="div"
              itemSelector="[data-stagger-item]"
              className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-3"
            >
              {testimonials.items.map((t) => (
                <div
                  key={t.author + t.role}
                  data-stagger-item
                  className="group relative rounded-[10px] border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-teal/30 hover:shadow-[0_12px_32px_rgba(10,158,136,0.12)]"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 rounded-t-[10px] bg-teal transition-transform duration-300 group-hover:scale-x-100"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-5 top-3 font-serif text-6xl leading-none text-teal/15 transition-all duration-300 group-hover:-translate-y-1 group-hover:text-teal/30"
                  >
                    &rdquo;
                  </span>
                  <p className="relative mb-5 text-sm leading-[1.75] text-[#94A3B8] transition-colors duration-300 group-hover:text-[#C3CDDB]">
                    {t.quote}
                  </p>
                  <div className="font-display text-[15px] font-bold text-white">{t.author}</div>
                  <div className="mt-0.5 text-xs text-muted">{t.role}</div>
                </div>
              ))}
            </StaggerGroup>
          </div>
        </section>
      ) : null}

      {cta ? (
        <section className="bg-navy2 px-6 py-20 text-center sm:px-12 lg:px-20">
          <Reveal className="mx-auto max-w-2xl">
            <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-teal">
              {cta.eyebrow}
            </div>
            <h2 className="mb-4 font-display text-[clamp(32px,4vw,48px)] font-extrabold leading-[1.1] text-white">
              {cta.headingLine1}
              {cta.headingLine2 ? (
                <>
                  <br />
                  {cta.headingLine2}
                </>
              ) : null}
            </h2>
            {cta.body ? (
              <p className="mx-auto mb-9 max-w-xl text-base leading-[1.7] text-[#94A3B8]">{cta.body}</p>
            ) : null}
            <div className="flex flex-wrap items-center justify-center gap-6">
              {cta.primaryLabel ? (
                <Magnetic>
                  <Link
                    href={cta.primaryHref || "#"}
                    data-cursor-interactive
                    className="inline-block rounded-[4px] bg-teal px-8 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-teal-dark"
                  >
                    {cta.primaryLabel}
                  </Link>
                </Magnetic>
              ) : null}
              {cta.secondaryLabel ? (
                <Link
                  href={cta.secondaryHref || "#"}
                  data-cursor-interactive
                  className="text-[15px] font-medium text-white/80 transition-colors hover:text-teal"
                >
                  {cta.secondaryLabel}
                </Link>
              ) : null}
            </div>
          </Reveal>
        </section>
      ) : null}

      <SiteFooter />
    </main>
  );
}
