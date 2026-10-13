import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ServiceDetailHero } from "@/components/sections/service-detail-hero";
import { OtherServicesSection } from "@/components/sections/other-services-section";
import { ServiceSlider } from "@/components/ui/service-slider";
import { Reveal } from "@/components/ui/reveal";
import { StaggerGroup } from "@/components/ui/stagger-group";
import { SiteFooter } from "@/components/sections/site-footer";
import {
  WrenchIcon,
  BoltIcon,
  FlameIcon,
  HardHatIcon,
  ShieldIcon,
  TruckIcon,
  type IconProps,
} from "@/components/ui/icons";

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

const PILLARS = [
  { letter: "M", name: "Mechanical", description: "HVAC, ducting, piping, fire protection, industrial ventilation, thermal insulation", color: "text-blue-light/40" },
  { letter: "E", name: "Electrical", description: "Power distribution, MV/LV cabling, busbar trunking, earthing, lighting, generator sync", color: "text-amber/40" },
  { letter: "P", name: "Plumbing", description: "Industrial water supply, drainage, storm water management, sanitary systems", color: "text-teal/40" },
];

/**
 * Each service points at the matching sub-category in the product catalogue on
 * `/products-services`, so a visitor can go from the service scope straight to the
 * products that deliver it.
 */
const SERVICES: {
  icon: (props: IconProps) => React.JSX.Element;
  title: string;
  description: string;
  href: string;
}[] = [
  {
    icon: WrenchIcon,
    title: "Turnkey Mechanical Systems",
    description:
      "HVAC plant installation, chillers, AHUs, ductwork, industrial ventilation, thermal insulation.",
    href: "/products-services#mep-epc-building-systems",
  },
  {
    icon: BoltIcon,
    title: "Electrical Power Distribution",
    description:
      "Cable tray routing, MV/LV power panels, busbar trunking, emergency power integration, earthing grid.",
    href: "/products-services#scp-power-control",
  },
  {
    icon: FlameIcon,
    title: "Fire Detection & Suppression",
    description:
      "Hydrant networks, sprinkler systems, FM200/Novec gas suppression, NFPA compliant detection panels.",
    href: "/products-services#mep-epc-building-systems",
  },
  {
    icon: ShieldIcon,
    title: "Plumbing & Process Piping",
    description:
      "Industrial water supply, drainage networks, compressed air lines, steam & chemical piping systems.",
    href: "/products-services#mep-epc-process-systems",
  },
  {
    icon: HardHatIcon,
    title: "Logistics & Site Management",
    description:
      "Heavy machinery positioning, rigging, crane operations, site logistics, safety supervision.",
    href: "/products-services#mep-epc-industrial-installation",
  },
  {
    icon: TruckIcon,
    title: "Construction Safety & Security",
    description:
      "OSHA compliant site protocols, access control, perimeter security, HSE documentation.",
    href: "/products-services#mep-epc-building-systems",
  },
];

const BRANDS = ["Caterpillar (CAT)", "Daikin", "Wilo", "Ingersoll Rand", "CompAir", "Trane", "Kruger", "TROX", "Atlas Copco"];

const MEP_SLIDES = [
  { src: "/assets/slider/mep/01.jpg", webpSrc: "/assets/slider/mep/01.webp", alt: "BTEL MEP Engineering Project Photo 01", caption: "Industrial HVAC & Mechanical Plant Commissioning" },
  { src: "/assets/slider/mep/02.jpg", webpSrc: "/assets/slider/mep/02.webp", alt: "BTEL MEP Electrical Distribution Photo 02", caption: "High Capacity Cable Tray & Busbar Trunking Assembly" },
  { src: "/assets/slider/mep/03.jpg", webpSrc: "/assets/slider/mep/03.webp", alt: "BTEL Fire Protection System Photo 03", caption: "NFPA-Compliant Industrial Fire Suppression Installation" },
  { src: "/assets/slider/mep/04.jpg", webpSrc: "/assets/slider/mep/04.webp", alt: "BTEL Heavy Machinery Positioning Photo 04", caption: "Heavy Industrial Rigging & Mechanical Site Operations" },
];

export default function MepServicePage() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative flex min-h-[85vh] items-center overflow-hidden pt-20 bg-navy">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <picture className="relative block h-full w-full">
            <source srcSet="/assets/hero/mep.webp" type="image/webp" />
            <Image
              src="/assets/hero/mep.jpg"
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
              <span className="text-[#94A3B8]">MEP / EPC</span>
            </nav>

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber/30 bg-amber/[0.12] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber">
              Service Division 03 · Mechanical, Electrical & Plumbing
            </div>

            <h1 className="mb-6 max-w-[640px] font-display text-[clamp(40px,5.5vw,64px)] font-extrabold leading-[1.05] text-white">
              Turnkey <span className="bg-gradient-to-r from-amber via-yellow-400 to-teal bg-clip-text text-transparent">MEP & EPC</span>
              <br />
              Solutions
            </h1>

            <p className="mb-9 max-w-xl text-lg leading-[1.75] text-[#C3CDDB]">
              Mechanical, Electrical, and Plumbing engineering delivered with strict adherence to safety,
              precision, and quality standards — from factory setups to high-rise developments.
            </p>

            <div className="flex flex-wrap gap-8">
              <div>
                <div className="font-display text-[26px] font-extrabold text-white">Full-Scope</div>
                <div className="mt-1 text-xs text-muted">Mechanical, Electrical, Plumbing</div>
              </div>
              <div>
                <div className="font-display text-[26px] font-extrabold text-white">NFPA</div>
                <div className="mt-1 text-xs text-muted">Fire Safety Compliance</div>
              </div>
            </div>
          </ServiceDetailHero>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="bg-navy px-6 py-20 sm:px-12 lg:px-20">
        <div className="mx-auto max-w-5xl">
          <StaggerGroup
            as="div"
            itemSelector="[data-stagger-item]"
            className="grid grid-cols-1 gap-[2px] overflow-hidden rounded-xl bg-border sm:grid-cols-3"
          >
            {PILLARS.map((pillar) => (
              <div
                key={pillar.letter}
                data-stagger-item
                className="bg-navy2 px-7 py-8 text-center transition-colors hover:bg-[#132030]"
              >
                <div className={`mb-2 font-display text-[72px] font-extrabold leading-none ${pillar.color}`}>
                  {pillar.letter}
                </div>
                <h3 className="mb-2 font-display text-lg font-bold text-white">{pillar.name}</h3>
                <p className="text-[13px] leading-[1.6] text-muted">{pillar.description}</p>
              </div>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Services List & Project Slider */}
      <section className="bg-navy2 px-6 py-24 sm:px-12 lg:px-20 lg:py-28">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-amber">
              Full Scope
            </div>
            <h2 className="mb-4 font-display text-[clamp(32px,3.6vw,44px)] font-extrabold leading-[1.1] text-white">
              What BTEL Delivers
            </h2>
            <p className="max-w-2xl text-base leading-[1.7] text-[#94A3B8]">
              Comprehensive MEP/EPC services under one roof — no
              subcontracting complexity, single point accountability. Select a
              service to see the products behind it.
            </p>
          </Reveal>

          <StaggerGroup
            as="div"
            itemSelector="[data-stagger-item]"
            className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            {SERVICES.map((service) => (
              <Link
                key={service.title}
                href={service.href}
                data-stagger-item
                data-cursor-interactive
                className="group relative flex items-start gap-4 overflow-hidden rounded-[10px] border border-border bg-card px-7 py-7 transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/60 focus-visible:ring-offset-2 focus-visible:ring-offset-navy2"
              >
                <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[3px] bg-amber" />
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-amber/10 text-amber">
                  <service.icon width={22} height={22} />
                </div>
                <div>
                  <h3 className="mb-1.5 font-display text-lg font-bold text-white">{service.title}</h3>
                  <p className="text-[13px] leading-[1.65] text-[#94A3B8]">{service.description}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-amber transition-transform duration-300 group-hover:translate-x-0.5">
                    View products
                    <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </StaggerGroup>

          {/* Interactive Project Slider (After Feature List) */}
          <div className="mt-16">
            <Reveal>
              <div className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-amber">
                Featured MEP / EPC Projects
              </div>
              <ServiceSlider slides={MEP_SLIDES} title="MEP Showcase" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Equipment Brands */}
      <section className="bg-navy px-6 py-20 sm:px-12 lg:px-20">
        <div className="mx-auto max-w-5xl text-center">
          <Reveal>
            <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-teal">
              Equipment Brands
            </div>
            <h2 className="mb-8 font-display text-2xl font-extrabold text-white">
              Global Brands Integrated in Our MEP Systems
            </h2>
          </Reveal>
          <div className="flex flex-wrap justify-center gap-3">
            {BRANDS.map((brand) => (
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

      <OtherServicesSection currentSlug="mep" />

      <SiteFooter />
    </main>
  );
}
