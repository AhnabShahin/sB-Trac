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
  DropletIcon,
  FlaskIcon,
  RecycleIcon,
  ShieldIcon,
  type IconProps,
} from "@/components/ui/icons";

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



/**
 * Each advantage points at the matching sub-category in the product catalogue on
 * `/products-services`, so a visitor can go from the capability straight to the
 * products that deliver it.
 */
const FEATURES: {
  icon: (props: IconProps) => React.JSX.Element;
  title: string;
  description: string;
  href: string;
}[] = [
  {
    icon: FlaskIcon,
    title: "100% Genuine NALCO Chemistry",
    description:
      "Direct import from NALCO / Ecolab manufacturing facilities with full Certificate of Analysis (COA) compliance.",
    href: "/products-services#nalco-chemicals",
  },
  {
    icon: ShieldIcon,
    title: "On-Site Water Testing & Dosages",
    description:
      "BTEL chemical engineers perform routine water analysis, dosing calibration, and monthly system reports.",
    href: "/products-services#nalco-testing",
  },
  {
    icon: RecycleIcon,
    title: "Effluent & Wastewater Optimization",
    description:
      "Coagulants and flocculants designed to improve ETP performance, sludge dewatering, and compliance.",
    href: "/products-services#nalco-chemicals",
  },
  {
    icon: DropletIcon,
    title: "Custom Formulation Programs",
    description:
      "Tailored chemical treatment regimens designed around your specific raw water characteristics.",
    href: "/products-services#nalco-chemicals",
  },
];

const WATER_SLIDES = [
  { src: "/assets/slider/water/01.jpg", webpSrc: "/assets/slider/water/01.webp", alt: "BTEL NALCO Water Treatment Project Photo 01", caption: "Industrial Cooling Tower Water Treatment System" },
  { src: "/assets/slider/water/02.jpg", webpSrc: "/assets/slider/water/02.webp", alt: "BTEL Industrial Boiler Treatment Photo 02", caption: "High-Pressure Steam Boiler Chemical Dosing Station" },
  { src: "/assets/slider/water/03.jpg", webpSrc: "/assets/slider/water/03.webp", alt: "BTEL Reverse Osmosis Membrane Care Photo 03", caption: "Reverse Osmosis Membrane Antiscalant & Filtration Care" },
  { src: "/assets/slider/water/04.jpg", webpSrc: "/assets/slider/water/04.webp", alt: "BTEL Water Quality Testing Lab Photo 04", caption: "On-Site Water Chemistry Testing & COA Verification" },
];

export default function WaterTreatmentServicePage() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative flex min-h-[85vh] items-center overflow-hidden pt-20 bg-navy">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <picture className="relative block h-full w-full">
            <source srcSet="/assets/hero/water.webp" type="image/webp" />
            <Image
              src="/assets/hero/water.jpg"
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
              <span className="text-[#94A3B8]">Water Treatment Chemicals</span>
            </nav>

            <div className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-purple/30 bg-purple/[0.1] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
              <span className="h-1.5 w-1.5 rounded-full bg-purple" />
              Authorized Distributor · NALCO — Ecolab USA
            </div>

            <h1 className="mb-6 font-display text-[clamp(40px,5.5vw,64px)] font-extrabold leading-[1.05] text-white">
              NALCO Water
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-purple to-teal bg-clip-text text-transparent">
                Treatment Chemicals
              </span>
            </h1>

            <p className="mb-8 max-w-lg text-lg leading-[1.75] text-[#C3CDDB]">
              Authorized distributor of NALCO (Ecolab) water treatment chemistry in Bangladesh — protecting boilers, cooling towers, RO plants, and engine cooling systems.
            </p>
          </ServiceDetailHero>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-navy2 px-6 py-24 sm:px-12 lg:px-20 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mx-auto max-w-xl text-center">
            <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-purple">
              Key Advantages
            </div>
            <h2 className="mb-4 font-display text-[clamp(32px,3.6vw,44px)] font-extrabold leading-[1.1] text-white">
              Comprehensive Water Chemistry Solutions
            </h2>
            <p className="mx-auto text-base leading-[1.7] text-[#94A3B8]">
              Select an advantage to see the products behind it.
            </p>
          </Reveal>

          <StaggerGroup
            as="div"
            itemSelector="[data-stagger-item]"
            className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {FEATURES.map((feature) => (
              <Link
                key={feature.title}
                href={feature.href}
                data-stagger-item
                data-cursor-interactive
                className="group rounded-lg border border-border bg-card p-6 transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple/60 focus-visible:ring-offset-2 focus-visible:ring-offset-navy2"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-purple/15 text-[#A78BFA]">
                  <feature.icon width={22} height={22} />
                </div>
                <h3 className="mb-1.5 font-display text-base font-bold text-white">{feature.title}</h3>
                <p className="text-xs leading-[1.6] text-[#94A3B8]">{feature.description}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#A78BFA] transition-transform duration-300 group-hover:translate-x-0.5">
                  View products
                  <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </StaggerGroup>

          {/* Interactive Project Slider (After Feature Section) */}
          <div className="mt-16">
            <Reveal>
              <div className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-purple">
                NALCO Water Treatment Installations
              </div>
              <ServiceSlider slides={WATER_SLIDES} title="Water Treatment Showcase" />
            </Reveal>
          </div>
        </div>
      </section>

      <OtherServicesSection currentSlug="water-treatment" />

      <SiteFooter />
    </main>
  );
}
