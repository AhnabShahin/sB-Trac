import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getProjectsContent } from "@/data/pages";
import type { ProjectsAccent } from "@/data/content-types";
import { ServiceDetailHero } from "@/components/sections/service-detail-hero";
import { ProjectPortfolioGrid } from "@/components/sections/project-portfolio-grid";
import {
  TrackRecordCards,
  type TrackRecordCard,
} from "@/components/sections/track-record-cards";
import type { ProjectFilterValue } from "@/components/sections/project-portfolio-grid";
import { Reveal } from "@/components/ui/reveal";
import { StaggerGroup } from "@/components/ui/stagger-group";
import { Counter } from "@/components/ui/counter";
import { Magnetic } from "@/components/ui/magnetic";
import { SiteFooter } from "@/components/sections/site-footer";

export const metadata: Metadata = {
  title: "Project Portfolio | B-Trac Engineering Ltd.",
  description:
    "38+ projects and BDT 500+ Cr delivered across substation & switchgear, solar power, MEP/EPC, and water treatment — BTEL's project portfolio spans Bangladesh's most demanding industrial clients.",
  openGraph: {
    title: "Project Portfolio | B-Trac Engineering Ltd.",
    description:
      "From the largest MEP contract in BTEL history to utility-scale solar plants — a portfolio spanning five engineering divisions.",
    type: "website",
  },
};

const BADGE_ACCENT: Record<ProjectsAccent, { chip: string; dot: string }> = {
  blue: { chip: "border-blue-light/30 bg-blue-light/[0.10] text-blue-light", dot: "bg-blue-light" },
  teal: { chip: "border-teal/30 bg-teal/[0.10] text-teal", dot: "bg-teal" },
  amber: { chip: "border-amber/30 bg-amber/[0.10] text-amber", dot: "bg-amber" },
  purple: { chip: "border-purple/30 bg-purple/[0.10] text-purple", dot: "bg-purple" },
  cyan: { chip: "border-cyan/30 bg-cyan/[0.10] text-cyan", dot: "bg-cyan" },
};

const TR_ACCENT: Record<ProjectsAccent, { text: string; border: string }> = {
  teal: { text: "text-teal", border: "border-t-teal" },
  amber: { text: "text-amber", border: "border-t-amber" },
  blue: { text: "text-blue-light", border: "border-t-blue" },
  purple: { text: "text-purple", border: "border-t-purple" },
  cyan: { text: "text-cyan", border: "border-t-cyan" },
};

export default async function ProjectsPage() {
  const content = await getProjectsContent();
  const hero = content?.projectsHero;
  const statsBand = content?.statsBand?.stats ?? [];
  const projects = content?.portfolio?.projects ?? [];
  const trackRecord = content?.trackRecord;
  const cta = content?.projectsCta;

  const trackCards: TrackRecordCard[] =
    trackRecord?.cards.map((c) => ({
      tag: c.tag,
      accent: TR_ACCENT[c.accent]?.text ?? "text-teal",
      border: TR_ACCENT[c.accent]?.border ?? "border-t-teal",
      filter: c.filter as ProjectFilterValue,
      title: c.title,
      description: c.description,
    })) ?? [];

  const divisionCounts = trackCards.reduce<Record<string, number>>((acc, card) => {
    acc[card.filter] = projects.filter(
      (p) => (p.filterTag ?? p.categorySlug) === card.filter,
    ).length;
    return acc;
  }, {});

  return (
    <main className="flex-1">
      {hero ? (
        <section
          className="relative flex min-h-[70vh] items-center overflow-hidden pt-16"
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
                "radial-gradient(ellipse 60% 70% at 80% 40%, rgba(159,185,252,0.10) 0%, transparent 60%), radial-gradient(ellipse 40% 50% at 10% 80%, rgba(10,158,136,0.08) 0%, transparent 60%)",
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
                <span className="text-[#94A3B8]">Project Portfolio</span>
              </nav>

              {hero.badge ? (
                <div
                  data-hero-item
                  className={`mb-7 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wider ${BADGE_ACCENT[hero.accent]?.chip ?? BADGE_ACCENT.blue.chip}`}
                >
                  <span className={`h-1.5 w-1.5 shrink-0 animate-[var(--animate-pulse-dot)] rounded-full ${BADGE_ACCENT[hero.accent]?.dot ?? BADGE_ACCENT.blue.dot}`} />
                  {hero.badge}
                </div>
              ) : null}

              <h1
                data-hero-item
                className="mb-6 font-display text-[clamp(48px,5.5vw,72px)] font-extrabold leading-[0.95] tracking-[-1px] text-white"
              >
                {hero.headingLine1}
                <br />
                <span className="bg-gradient-to-br from-blue-light to-teal bg-clip-text text-transparent">
                  {hero.headingHighlight}
                </span>{" "}
                {hero.headingSuffix}
              </h1>

              <p data-hero-item className="max-w-xl text-base leading-[1.75] text-[#94A3B8] sm:text-lg">
                {hero.subhead}
              </p>
            </ServiceDetailHero>
          </div>
        </section>
      ) : null}

      {statsBand.length > 0 ? (
        <section className="border-y border-border bg-navy2">
          <StaggerGroup
            as="div"
            itemSelector="[data-stagger-item]"
            className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-12 sm:px-12 lg:grid-cols-4 lg:px-20"
          >
            {statsBand.map((stat, i) => (
              <div key={`${stat.description}-${i}`} data-stagger-item className="text-center lg:text-left">
                <Counter
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  className="font-display text-[clamp(30px,3.2vw,40px)] font-extrabold leading-none text-white"
                  suffixClassName="text-teal"
                />
                <div className="mt-2 whitespace-pre-line text-[13px] leading-[1.5] text-muted">
                  {stat.description}
                </div>
              </div>
            ))}
          </StaggerGroup>
        </section>
      ) : null}

      {projects.length > 0 ? (
        <section id="portfolio" className="bg-navy2 px-6 pb-24 pt-20 sm:px-12 lg:px-20">
          <div className="mx-auto max-w-6xl">
            <ProjectPortfolioGrid projects={projects} />
          </div>
        </section>
      ) : null}

      {trackRecord && trackCards.length > 0 ? (
        <section className="bg-navy px-6 py-24 sm:px-12 lg:px-20 lg:py-28">
          <div className="mx-auto max-w-6xl">
            <Reveal className="mx-auto max-w-xl text-center">
              <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-teal">
                {trackRecord.eyebrow}
              </div>
              <h2 className="font-display text-[clamp(32px,3.6vw,44px)] font-extrabold leading-[1.1] text-white">
                {trackRecord.headingLine1}
                <br />
                {trackRecord.headingLine2}
              </h2>
            </Reveal>

            <StaggerGroup
              as="div"
              itemSelector="[data-stagger-item]"
              className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3"
            >
              <TrackRecordCards items={trackCards} counts={divisionCounts} />
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
              <br />
              {cta.headingLine2}
            </h2>
            <p className="mx-auto mb-9 max-w-xl text-base leading-[1.7] text-[#94A3B8]">
              {cta.intro}
            </p>
            {cta.ctaLabel ? (
              <div className="flex flex-wrap items-center justify-center gap-6">
                <Magnetic>
                  <Link
                    href={cta.ctaHref || "#"}
                    data-cursor-interactive
                    className="inline-block rounded-[4px] bg-blue-light px-8 py-3.5 text-[15px] font-semibold text-navy transition-colors hover:bg-blue2"
                  >
                    {cta.ctaLabel}
                  </Link>
                </Magnetic>
              </div>
            ) : null}
          </Reveal>
        </section>
      ) : null}

      <SiteFooter />
    </main>
  );
}
