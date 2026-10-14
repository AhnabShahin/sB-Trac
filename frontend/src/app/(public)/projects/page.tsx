import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getProjects } from "@/data/company";
import { getHeroStats } from "@/data/site";
import { ServiceDetailHero } from "@/components/sections/service-detail-hero";
import { ProjectPortfolioGrid } from "@/components/sections/project-portfolio-grid";
import {
  TrackRecordCards,
  type TrackRecordCard,
} from "@/components/sections/track-record-cards";
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

interface StatsBandItem {
  value: number;
  suffix: string;
  prefix?: string;
  description: string;
}

/**
 * Builds this page's stats band from `getHeroStats()` — the same source the
 * homepage hero reads — so the three shared figures (PO value, projects,
 * clients) cannot drift apart again. They had: this band carried its own
 * literals and showed a different PO value from the one the hero and this page's
 * own metadata both quote.
 *
 * Only the numbers are shared. The captions stay local because the same figures
 * read differently framed as a portfolio, and the ISO stat has no homepage
 * counterpart so it remains a literal.
 */
async function getStatsBand(): Promise<StatsBandItem[]> {
  const byLabel = new Map((await getHeroStats()).map((stat) => [stat.label, stat]));

  // Throws at build time rather than rendering a broken counter, so a renamed
  // label in getHeroStats() fails loudly instead of silently showing NaN.
  const pick = (label: string) => {
    const stat = byLabel.get(label);
    if (!stat) throw new Error(`getHeroStats() has no stat labelled "${label}"`);
    return stat;
  };

  const poValue = pick("Total PO Value (BDT)");
  const projects = pick("Projects");
  const clients = pick("Clients");

  return [
    {
      value: poValue.value,
      // The homepage renders this as "500Cr+" with "(BDT)" carried in the label,
      // so the suffix is reused verbatim and no "BDT" prefix is added here.
      suffix: poValue.suffix,
      description: "Total PO value\ndelivered (BDT)",
    },
    {
      value: projects.value,
      suffix: projects.suffix,
      description: "Projects across all\nfive divisions",
    },
    {
      value: clients.value,
      suffix: clients.suffix,
      description: "Industry clients\nserved since 2009",
    },
    { value: 100, suffix: "%", description: "ISO 9001 quality\nacross all projects" },
  ];
}

const ACHIEVEMENTS: TrackRecordCard[] = [
  {
    tag: "MEP",
    accent: "text-teal",
    border: "border-t-teal",
    // "Largest EPC Contracts" is the MEP division's work.
    filter: "mep",
    title: "Largest EPC Contracts",
    description:
      "BTEL's MEP division has delivered the company's highest-value projects — including the BDT 185.98 Cr BATB Savar facility and a BDT 91 Cr ongoing factory conversion. Both are among the largest private MEP contracts in Bangladesh.",
  },
  {
    tag: "Solar",
    accent: "text-amber",
    border: "border-t-amber",
    filter: "solar",
    title: "MW-Scale Solar Plants",
    description:
      "From rural irrigation systems for BADC to a 3MW industrial plant for Akij Jute Mills, BTEL's solar division has delivered projects across all scales — on-grid, off-grid, and hybrid — covering Bangladesh's urban and rural industrial landscape.",
  },
  {
    tag: "Power",
    accent: "text-blue-light",
    border: "border-t-blue",
    // 33KV-132KV systems are the substation & switchgear division.
    filter: "substation",
    title: "33KV to 132KV Systems",
    description:
      "BTEL's substation and switchgear divisions serve national grid authorities and private industrial clients — delivering complete power systems from transformer manufacturing to SCADA commissioning.",
  },
];

export default async function ProjectsPage() {
  const [projects, statsBand] = await Promise.all([getProjects(), getStatsBand()]);

  // How many projects each Track Record card should claim it will show. Counted
  // here rather than in the client cards so the numbers come from the same
  // source the portfolio grid filters against, and cannot disagree with it.
  const divisionCounts = ACHIEVEMENTS.reduce<Record<string, number>>((acc, item) => {
    acc[item.filter] = projects.filter(
      (project) => (project.filterTag ?? project.categorySlug) === item.filter
    ).length;
    return acc;
  }, {});

  return (
    <main className="flex-1">
      <section
        className="relative flex min-h-[70vh] items-center overflow-hidden pt-16"
        style={{ background: "linear-gradient(160deg, #080d19 0%, #101729 45%, #0e1528 100%)" }}
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <picture className="relative block h-full w-full">
            <source srcSet="/assets/hero/projects.webp" type="image/webp" />
            <Image
              src="/assets/hero/projects.jpg"
              alt=""
              fill
              priority
              loading="eager"
              className="object-cover object-center opacity-50"
              sizes="100vw"
            />
          </picture>
        </div>
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
          <ServiceDetailHero accent="blue" maxWidth="max-w-3xl">
            <nav aria-label="Breadcrumb" className="mb-5 text-[13px] text-muted">
              <Link href="/" className="transition-colors hover:text-white">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-[#94A3B8]">Project Portfolio</span>
            </nav>

            <div
              data-hero-item
              className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-light/30 bg-blue-light/[0.10] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-light"
            >
              <span className="h-1.5 w-1.5 shrink-0 animate-[var(--animate-pulse-dot)] rounded-full bg-blue-light" />
              38+ Projects · BDT 400+ Cr Delivered
            </div>

            <h1
              data-hero-item
              className="mb-6 font-display text-[clamp(48px,5.5vw,72px)] font-extrabold leading-[0.95] tracking-[-1px] text-white"
            >
              Work That
              <br />
              <span className="bg-gradient-to-br from-blue-light to-teal bg-clip-text text-transparent">
                Speaks
              </span>{" "}
              For
              <br />
              Itself
            </h1>

            <p data-hero-item className="max-w-xl text-base leading-[1.75] text-[#94A3B8] sm:text-lg">
              From the largest MEP contract in BTEL history to utility-scale
              solar plants — our project portfolio spans five engineering
              divisions, serving Bangladesh&apos;s most demanding clients.
            </p>
          </ServiceDetailHero>
        </div>
      </section>

      <section className="border-y border-border bg-navy2">
        <StaggerGroup
          as="div"
          itemSelector="[data-stagger-item]"
          className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-12 sm:px-12 lg:grid-cols-4 lg:px-20"
        >
          {statsBand.map((stat) => (
            <div key={stat.description} data-stagger-item className="text-center lg:text-left">
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

      <section id="portfolio" className="bg-navy2 px-6 pb-24 pt-20 sm:px-12 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <ProjectPortfolioGrid projects={projects} />
        </div>
      </section>

      <section className="bg-navy px-6 py-24 sm:px-12 lg:px-20 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mx-auto max-w-xl text-center">
            <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-teal">
              Track Record
            </div>
            <h2 className="font-display text-[clamp(32px,3.6vw,44px)] font-extrabold leading-[1.1] text-white">
              Proven Across
              <br />
              Every Division
            </h2>
          </Reveal>

          {/* Each card filters the portfolio below to its division and scrolls
              to it, so the summary and the evidence are one click apart. */}
          <StaggerGroup
            as="div"
            itemSelector="[data-stagger-item]"
            className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3"
          >
            <TrackRecordCards items={ACHIEVEMENTS} counts={divisionCounts} />
          </StaggerGroup>
        </div>
      </section>

      <section className="bg-navy2 px-6 py-20 text-center sm:px-12 lg:px-20">
        <Reveal className="mx-auto max-w-2xl">
          <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-teal">
            Start Your Project
          </div>
          <h2 className="mb-4 font-display text-[clamp(32px,4vw,48px)] font-extrabold leading-[1.1] text-white">
            Let&apos;s Add Your Project
            <br />
            to This Portfolio
          </h2>
          <p className="mx-auto mb-9 max-w-xl text-base leading-[1.7] text-[#94A3B8]">
            Reach out to BTEL&apos;s engineering team to discuss your
            requirements. We respond within 24 hours.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Magnetic>
              <Link
                href="/contact"
                data-cursor-interactive
                className="inline-block rounded-[4px] bg-blue-light px-8 py-3.5 text-[15px] font-semibold text-navy transition-colors hover:bg-blue2"
              >
                Request a Quotation →
              </Link>
            </Magnetic>
          </div>
        </Reveal>
      </section>

      <SiteFooter />
    </main>
  );
}
