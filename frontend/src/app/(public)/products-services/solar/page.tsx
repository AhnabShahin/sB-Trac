import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ServiceDetailHero } from "@/components/sections/service-detail-hero";
import { OtherServicesSection } from "@/components/sections/other-services-section";
import { SiteVisitForm } from "@/components/sections/site-visit-form";
import { ServiceSlider } from "@/components/ui/service-slider";
import { Reveal } from "@/components/ui/reveal";
import { StaggerGroup } from "@/components/ui/stagger-group";
import { SiteFooter } from "@/components/sections/site-footer";
import {
  SunIcon,
  PlugIcon,
  BatteryIcon,
  BoltIcon,
  LightbulbIcon,
  LeafIcon,
  HandshakeIcon,
  type IconProps,
} from "@/components/ui/icons";

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

/**
 * Each system type points at the matching sub-category in the product catalogue on
 * `/products-services`. On-Grid and Hybrid both live under Solar Power; the off-grid
 * offering is delivered by the battery-backed Hybrid and ESS products, so it links
 * to the storage sub-category that actually carries the batteries.
 */
const SYSTEM_TYPES = [
  {
    icon: PlugIcon,
    name: "On-Grid Solar",
    description:
      "Grid-connected solar power systems that export excess energy and reduce your utility bill. Ideal for factories, commercial buildings and institutions with a reliable grid supply.",
    tag: "Net Metering Ready",
    tone: "border-blue-light/30",
    gradient: "linear-gradient(135deg, #161e36, #0A3060)",
    tagClass: "bg-blue-light/15 text-blue-light",
    href: "/products-services#renewable-energy-solar",
  },
  {
    icon: BatteryIcon,
    name: "Off-Grid Solar",
    description:
      "Standalone solar power systems with battery storage for locations without grid access. Provides 24/7 clean energy independence in remote industrial and agricultural sites.",
    tag: "Battery Storage",
    tone: "border-teal/30",
    gradient: "linear-gradient(135deg, #161e36, #1A3010)",
    tagClass: "bg-teal/15 text-teal",
    href: "/products-services#renewable-energy-storage",
  },
  {
    icon: BoltIcon,
    name: "Hybrid Solar",
    description:
      "Combines grid connection with battery storage for maximum resilience. Automatically switches power sources to ensure zero downtime — ideal for mission-critical operations.",
    tag: "Zero Downtime",
    tone: "border-amber/30",
    gradient: "linear-gradient(135deg, #161e36, #2A2010)",
    tagClass: "bg-amber/15 text-amber",
    href: "/products-services#renewable-energy-solar",
  },
];

const FEATURES: { icon: (props: IconProps) => React.JSX.Element; iconBg: string; title: string; description: string }[] = [
  {
    icon: SunIcon,
    iconBg: "bg-[#FEF3C7]",
    title: "Revolutionary Solar Power Plants",
    description:
      "Harnessing solar energy efficiently to deliver optimum energy solutions for industrial, commercial and institutional clients across Bangladesh.",
  },
  {
    icon: LightbulbIcon,
    iconBg: "bg-[#D1FAE5]",
    title: "Cutting Edge Technology & Operations",
    description:
      "We design, develop and implement on-grid, off-grid, and hybrid solar power plants using globally proven equipment and signature operations management systems.",
  },
  {
    icon: LeafIcon,
    iconBg: "bg-[#ECFDF5]",
    title: "Future Integration & Environmental Responsibility",
    description:
      "Turnkey solutions advancing sustainability and carbon neutrality through solar power — aligning with Bangladesh's national renewable energy targets and global ESG commitments.",
  },
  {
    icon: HandshakeIcon,
    iconBg: "bg-[#FEF3C7]",
    title: "Partner in Development & a Friend in Need",
    description:
      "Construction, maintenance, and troubleshooting powered by aerial surveillance and simulations to meet the energy demand of today and tomorrow.",
  },
];

const PROCESS = [
  { num: "01", title: "Site Survey & Yield Analysis", description: "Shading analysis, structural roof checks, and solar irradiance simulation.", active: false },
  { num: "02", title: "System Engineering & Design", description: "Single line diagrams, component selection, structural sizing, net metering planning.", active: false },
  { num: "03", title: "Procurement & Import", description: "Tier-1 solar modules, string/central inverters, mounting structure, protection hardware.", active: false },
  { num: "04", title: "Installation & Interconnection", description: "Mechanical mounting, DC/AC cabling, inverter setup, grid synchronisation.", active: true },
  { num: "05", title: "Testing, Commissioning & O&M", description: "Performance ratio testing, grid authority sign-off, ongoing monitoring & AMC.", active: false },
];

const SOLAR_SLIDES = [
  { src: "/assets/slider/solar/01.jpg", webpSrc: "/assets/slider/solar/01.webp", alt: "BTEL Solar Installation Project Photo 01", caption: "Rooftop Megawatt Solar EPC Installation" },
  { src: "/assets/slider/solar/02.jpg", webpSrc: "/assets/slider/solar/02.webp", alt: "BTEL Solar Installation Project Photo 02", caption: "Tier-1 High Efficiency Solar Array Layout" },
  { src: "/assets/slider/solar/03.jpg", webpSrc: "/assets/slider/solar/03.webp", alt: "BTEL Solar Installation Project Photo 03", caption: "Industrial Solar Power Plant Grid Connection" },
  { src: "/assets/slider/solar/04.jpg", webpSrc: "/assets/slider/solar/04.webp", alt: "BTEL Solar Installation Project Photo 04", caption: "Smart Inverter & SCADA Monitoring System" },
];

export default function SolarPage() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section
        className="relative flex min-h-[85vh] items-center overflow-hidden pt-20"
        style={{ background: "linear-gradient(160deg, #080d19 0%, #101729 40%, #0A2010 100%)" }}
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <picture className="relative block h-full w-full">
            <source srcSet="/assets/hero/solar.webp" type="image/webp" />
            <Image
              src="/assets/hero/solar.jpg"
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
              <span className="text-[#94A3B8]">Solar & Renewable</span>
            </nav>

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber/30 bg-amber/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber">
              Turnkey Solar EPC · On-Grid & Off-Grid
            </div>

            <h1 className="mb-6 font-display text-[clamp(40px,5.5vw,64px)] font-extrabold leading-[1.05] text-white">
              Solar Power
              <br />
              <span className="bg-gradient-to-r from-amber via-yellow-400 to-teal bg-clip-text text-transparent">
                Solutions
              </span>
            </h1>

            <p className="mb-9 text-lg leading-[1.75] text-[#C3CDDB]">
              Turnkey solar EPC for industrial and commercial facilities across
              Bangladesh. From high-efficiency rooftop PV arrays to hybrid microgrids,
              BTEL lowers operating energy costs up to 40% with clean energy.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="#site-visit"
                data-cursor-interactive
                className="inline-block rounded bg-amber px-7 py-3.5 text-[15px] font-semibold text-navy transition-all hover:bg-amber-light"
              >
                Book Free Site Visit
              </Link>
              <a
                href="#system-types"
                data-cursor-interactive
                className="inline-block rounded border border-white/20 px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:border-amber hover:text-amber"
              >
                Explore System Types
              </a>
            </div>
          </ServiceDetailHero>
        </div>
      </section>

      {/* System Types Section */}
      <section id="system-types" className="bg-navy px-6 py-24 sm:px-12 lg:px-20 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mx-auto max-w-xl text-center">
            <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-amber">
              Solar Configurations
            </div>
            <h2 className="mb-4 font-display text-[clamp(32px,3.6vw,44px)] font-extrabold leading-[1.1] text-white">
              Tailored System Architecture
            </h2>
            <p className="mx-auto max-w-md text-base leading-[1.7] text-[#94A3B8]">
              We design and commission solar solutions engineered specifically for your load profile — select a configuration to see the products behind it.
            </p>
          </Reveal>

          <StaggerGroup
            as="div"
            itemSelector="[data-stagger-item]"
            className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3"
          >
            {SYSTEM_TYPES.map((system) => (
              <Link
                key={system.name}
                href={system.href}
                data-stagger-item
                data-cursor-interactive
                className={`group rounded-[10px] border ${system.tone} px-6 py-7 transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/60 focus-visible:ring-offset-2 focus-visible:ring-offset-navy`}
                style={{ background: system.gradient }}
              >
                <div className="mb-4 text-white/90">
                  <system.icon width={28} height={28} />
                </div>
                <h3 className="mb-2 font-display text-xl font-extrabold text-white">{system.name}</h3>
                <p className="mb-4 text-[13px] leading-[1.65] text-[#94A3B8]">{system.description}</p>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`rounded-[4px] px-2.5 py-1 text-[11px] font-bold tracking-[0.3px] ${system.tagClass}`}>
                    {system.tag}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-white/70 transition-transform duration-300 group-hover:translate-x-0.5">
                    View products
                    <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-offwhite px-6 py-24 sm:px-12 lg:px-20 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-[#059669]">
              Our Approach
            </div>
            <h2 className="mb-4 font-display text-[clamp(32px,3.6vw,44px)] font-extrabold leading-[1.1] text-navy">
              Turnkey Solar / Renewable Projects
            </h2>
            <p className="max-w-2xl text-base leading-[1.7] text-[#4A5568]">
              From the first site survey to the final watt delivered — BTEL
              manages every phase of your solar project.
            </p>
          </Reveal>

          <StaggerGroup
            as="div"
            itemSelector="[data-stagger-item]"
            className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2"
          >
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                data-stagger-item
                className="flex items-start gap-4 rounded-[10px] border border-[#E2E8F0] bg-white px-7 py-7 transition-all hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(10,158,136,0.1)]"
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] ${feature.iconBg} text-navy`}>
                  <feature.icon width={22} height={22} />
                </div>
                <div>
                  <h3 className="mb-1.5 font-display text-lg font-bold text-navy">{feature.title}</h3>
                  <p className="text-[13px] leading-[1.65] text-[#4A5568]">{feature.description}</p>
                </div>
              </div>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Process & Project Slider Section */}
      <section className="bg-navy px-6 py-24 sm:px-12 lg:px-20 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mx-auto max-w-xl text-center">
            <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-amber">
              How We Work
            </div>
            <h2 className="mb-4 font-display text-[clamp(32px,3.6vw,44px)] font-extrabold leading-[1.1] text-white">
              The BTEL Solar EPC Process
            </h2>
            <p className="mx-auto max-w-md text-base leading-[1.7] text-[#94A3B8]">
              Five structured phases from concept to commissioning —
              delivered on time, every time.
            </p>
          </Reveal>

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
            {PROCESS.map((step) => (
              <div key={step.num} data-stagger-item className="px-3 text-center">
                <div
                  className={`relative z-1 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 bg-card font-display text-xl font-extrabold ${
                    step.active ? "border-amber text-amber" : "border-teal text-teal"
                  }`}
                >
                  {step.num}
                </div>
                <h3 className="mb-1.5 font-display text-[15px] font-bold text-white">{step.title}</h3>
                <p className="text-xs leading-[1.5] text-muted">{step.description}</p>
              </div>
            ))}
          </StaggerGroup>

          {/* Interactive Project Slider (After Steps Section) */}
          <div className="mt-16">
            <Reveal>
              <div className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-teal">
                Featured Solar Project Installations
              </div>
              <ServiceSlider slides={SOLAR_SLIDES} title="Solar Project Showcase" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Free Site Visit Form Section */}
      <section
        id="site-visit"
        className="relative overflow-hidden px-6 py-24 sm:px-12 lg:px-20"
        style={{
          background: "linear-gradient(135deg, #101729 0%, #182037 60%, #141e40 100%)",
        }}
      >
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-amber">
              Get Started
            </div>
            <h2 className="mb-4 font-display text-[clamp(32px,4vw,48px)] font-extrabold leading-[1.1] text-white">
              See Your Site&apos;s
              <br />
              Solar Potential
            </h2>
            <p className="max-w-[480px] text-base leading-[1.7] text-[#94A3B8]">
              Book a free, no-obligation site visit and our solar engineers
              will assess your roof or land, energy usage, and recommend the
              right system size.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <SiteVisitForm />
          </Reveal>
        </div>
      </section>

      {/* Solar CTA Ultra-Wide Banner (After CTA Section) */}
      <section className="relative w-full overflow-hidden bg-navy2">
        <picture>
          <source srcSet="/assets/banner/solar-cta.webp" type="image/webp" />
          <Image
            src="/assets/banner/solar-cta.jpg"
            alt="BTEL Solar Energy Solutions Banner"
            width={1920}
            height={480}
            sizes="100vw"
            className="h-[220px] sm:h-[300px] w-full object-cover object-center"
            loading="lazy"
            decoding="async"
          />
        </picture>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/50 to-transparent"
        />
        <div className="absolute inset-0 flex items-center px-6 sm:px-12 lg:px-20">
          <div className="max-w-xl">
            <h3 className="mb-2 font-display text-2xl sm:text-3xl font-extrabold text-white">
              Ready to transition your facility to clean solar energy?
            </h3>
            <p className="text-sm text-[#94A3B8]">
              Contact BTEL&apos;s renewable energy team for full EPC proposals & ROI analysis.
            </p>
          </div>
        </div>
      </section>

      <OtherServicesSection currentSlug="solar" />

      <SiteFooter />
    </main>
  );
}
