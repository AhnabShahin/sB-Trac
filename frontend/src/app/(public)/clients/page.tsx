import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getClientStats, getClientTestimonials } from "@/data/company";
import { ServiceDetailHero } from "@/components/sections/service-detail-hero";
import { ClientIndustryBands } from "@/components/sections/client-industry-bands";
import { Reveal } from "@/components/ui/reveal";
import { StaggerGroup } from "@/components/ui/stagger-group";
import { Counter } from "@/components/ui/counter";
import { Magnetic } from "@/components/ui/magnetic";
import { SiteFooter } from "@/components/sections/site-footer";
import { LandmarkIcon, CapIcon, FactoryIcon, GlobeIcon } from "@/components/ui/icons";

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

const TRUST_BADGES = [
  { icon: FactoryIcon, title: "60+ Clients", subtitle: "All sectors" },
  { icon: GlobeIcon, title: "Multinational", subtitle: "Global brands" },
  { icon: LandmarkIcon, title: "Government", subtitle: "BREB, PGCB, Navy" },
  { icon: CapIcon, title: "Since 2009", subtitle: "Long-term trust" },
];

export default async function ClientsPage() {
  const [stats, testimonials] = await Promise.all([
    getClientStats(),
    getClientTestimonials(),
  ]);

  return (
    <main className="flex-1">
      <section
        className="relative flex min-h-[64vh] items-center overflow-hidden pt-16"
        style={{ background: "linear-gradient(160deg, #080d19 0%, #101729 45%, #0e1528 100%)" }}
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <picture className="relative block h-full w-full">
            <source srcSet="/assets/hero/clients.webp" type="image/webp" />
            <Image
              src="/assets/hero/clients.jpg"
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
          <ServiceDetailHero accent="teal" maxWidth="max-w-3xl">
            <nav aria-label="Breadcrumb" className="mb-5 text-[13px] text-muted">
              <Link href="/" className="transition-colors hover:text-white">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-[#94A3B8]">Clients</span>
            </nav>

            <div
              data-hero-item
              className="mb-7 inline-flex items-center gap-2 rounded-full border border-teal/30 bg-teal/[0.10] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-teal"
            >
              <span className="h-1.5 w-1.5 shrink-0 animate-[var(--animate-pulse-dot)] rounded-full bg-teal" />
              60+ Industry Leaders
            </div>

            <h1
              data-hero-item
              className="mb-6 font-display text-[clamp(40px,5vw,64px)] font-extrabold leading-[1.05] tracking-[-1px] text-white"
            >
              Bangladesh&apos;s Most
              <br />
              <span className="text-teal">Demanding Clients</span>
              <br />
              Trust BTEL.
            </h1>

            <p data-hero-item className="max-w-xl text-base leading-[1.75] text-[#94A3B8] sm:text-lg">
              From Fortune 500 multinationals to government institutions and
              industrial conglomerates — BTEL has delivered engineering
              excellence across every major sector since 2009.
            </p>

            <StaggerGroup
              as="div"
              itemSelector="[data-stagger-item]"
              className="mt-9 flex flex-wrap gap-3"
            >
              {TRUST_BADGES.map((badge) => (
                <div
                  key={badge.title}
                  data-stagger-item
                  className="flex items-center gap-3 rounded-lg border border-border bg-white/[0.03] px-5 py-3.5"
                >
                  <badge.icon width={20} height={20} className="shrink-0 text-teal" />
                  <div>
                    <div className="text-sm font-bold text-white">{badge.title}</div>
                    <div className="text-[13px] text-muted">{badge.subtitle}</div>
                  </div>
                </div>
              ))}
            </StaggerGroup>
          </ServiceDetailHero>
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <StaggerGroup
          as="div"
          itemSelector="[data-stagger-item]"
          className="mx-auto grid max-w-6xl grid-cols-2 gap-px bg-border lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <div key={stat.label} data-stagger-item className="bg-card px-6 py-10 text-center">
              <Counter
                value={Number(stat.value)}
                suffix={stat.accent}
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

      {/* "Our Client List" (a flat LogoWall) used to sit here. The industry bands
          below already show every client grouped by sector, so it duplicated the
          same marks with less context and was removed. */}
      {/* `tone="light"` renders the bands off-white. Only this page asks for it; the
          homepage renders the same component in its dark form. */}
      <ClientIndustryBands headingAs="h2" tone="light" />

      <section className="bg-navy px-6 py-24 sm:px-12 lg:px-20 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mx-auto max-w-xl text-center">
            <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-teal">
              What Clients Say
            </div>
            <h2 className="font-display text-[clamp(32px,3.6vw,44px)] font-extrabold leading-[1.1] text-white">
              Built on Trust &
              <br />
              <span className="text-teal">Long-Term Partnerships</span>
            </h2>
          </Reveal>

          <StaggerGroup
            as="div"
            itemSelector="[data-stagger-item]"
            className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-3"
          >
            {testimonials.map((t) => (
              <div
                key={t.author + t.role}
                data-stagger-item
                // Same hover vocabulary as the other cards on the site (client
                // bands, strength areas): lift, a teal edge, and the teal glow.
                // No `data-cursor-interactive` and no pointer cursor — nothing
                // here is clickable, and the lift should not imply otherwise.
                className="group relative rounded-[10px] border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-teal/30 hover:shadow-[0_12px_32px_rgba(10,158,136,0.12)]"
              >
                {/* Accent line that wipes in from the left on hover. `rounded-t`
                    matches the card radius so it does not poke out of the corner. */}
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
                <div className="font-display text-[15px] font-bold text-white">
                  {t.author}
                </div>
                <div className="mt-0.5 text-xs text-muted">{t.role}</div>
              </div>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <section className="bg-navy2 px-6 py-20 text-center sm:px-12 lg:px-20">
        <Reveal className="mx-auto max-w-2xl">
          <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-teal">
            Work With BTEL
          </div>
          <h2 className="mb-4 font-display text-[clamp(32px,4vw,48px)] font-extrabold leading-[1.1] text-white">
            Join Bangladesh&apos;s Most
            <br />
            Trusted Client List
          </h2>
          <p className="mx-auto mb-9 max-w-xl text-base leading-[1.7] text-[#94A3B8]">
            BTEL&apos;s engineering team works with clients of all sizes —
            from SMEs to multinationals and government institutions.
          </p>
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
