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
  BoltIcon,
  PanelIcon,
  TransformerIcon,
  BroadcastIcon,
  AnchorIcon,
  GlobeIcon,
  LightbulbIcon,
  FactoryIcon,
  HardHatIcon,
  FlaskIcon,
  type IconProps,
} from "@/components/ui/icons";

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

/**
 * Each capability points at the matching sub-category in the product catalogue on
 * `/products-services`, so a visitor can go from "what we do" straight to the
 * products that deliver it.
 */
const CAPABILITIES: {
  icon: (props: IconProps) => React.JSX.Element;
  title: string;
  description: string;
  href: string;
}[] = [
  {
    icon: BoltIcon,
    title: "33kV & 11kV Sub-Stations",
    description: "Complete turnkey substation systems for industrial and commercial power delivery",
    href: "/products-services#scp-substation-systems",
  },
  {
    icon: PanelIcon,
    title: "HV/LV Switchgear",
    description: "High & low voltage electrical panels, synchronization and control systems",
    href: "/products-services#scp-switchgear",
  },
  {
    icon: TransformerIcon,
    title: "Power Transformers",
    description: "Transformer supply up to 20MVA for diverse industrial applications",
    href: "/products-services#scp-substation-systems",
  },
  {
    icon: BroadcastIcon,
    title: "SCADA Systems",
    description: "Remote monitoring & fuel optimization syncing conventional and renewable sources",
    href: "/products-services#scp-automation",
  },
  {
    icon: AnchorIcon,
    title: "Marine Power",
    description: "Electrical panels and synchronization systems for industrial & marine applications",
    href: "/products-services#scp-deif",
  },
  {
    icon: GlobeIcon,
    title: "DEIF Power Control",
    description: "World-class power control and management solutions as authorized DEIF distributor",
    href: "/products-services#scp-deif",
  },
];

const FEATURES: { icon: (props: IconProps) => React.JSX.Element; title: string; description: string }[] = [
  {
    icon: LightbulbIcon,
    title: "Leading Gateway of Power to Industries",
    description:
      "Complete 33kV & 11kV electrical substation systems, transformers & HV/LV switchgears designed and installed to the highest standards.",
  },
  {
    icon: FactoryIcon,
    title: "Diverse Industrial Solutions",
    description:
      "Transformer range extends up to 20MVA — ensuring reliable power solutions for even the most demanding industrial needs.",
  },
  {
    icon: HardHatIcon,
    title: "Engineering Mastery & Craftsmanship",
    description:
      "Precise & efficient turnkey substation solutions delivered by our senior engineering team with decades of field experience.",
  },
  {
    icon: FlaskIcon,
    title: "R&D for Power Optimization",
    description:
      "One-stop solution for high and low voltage electrical panels and switchgears, backed by continuous research and development.",
  },
  {
    icon: AnchorIcon,
    title: "Industrial & Marine Applications",
    description:
      "Manufacture of electrical panels and synchronization systems for both industrial facilities and marine power applications.",
  },
  {
    icon: BroadcastIcon,
    title: "Advanced SCADA Monitoring",
    description:
      "Remote monitoring system for sub-stations, sync systems, and fuel consumption to optimize operation costs.",
  },
];

const SPECS = [
  { label: "Voltage Classes", value: "33kV · 11kV · 0.415kV (LV)" },
  { label: "Transformer Capacity", value: "Up to 20 MVA" },
  { label: "Switchgear Types", value: "VCB · LBS · ACB · MCCB Panels" },
  { label: "Control Systems", value: "DEIF AGC-4 · SCADA · PLC Synchronizing" },
  { label: "Standards Compliance", value: "IEC 62271 · IEC 61439 · BNBC" },
  { label: "Key Global Brand Partners", value: "DEIF · ABB · SGB-SMIT · Schneider" },
];

const SUBSTATION_SLIDES = [
  { src: "/assets/slider/substation/01.jpg", webpSrc: "/assets/slider/substation/01.webp", alt: "BTEL 33kV Substation Installation Photo 01", caption: "High Voltage 33kV Substation System Installation" },
  { src: "/assets/slider/substation/02.jpg", webpSrc: "/assets/slider/substation/02.webp", alt: "BTEL Power Transformer Installation Photo 02", caption: "Heavy Industrial Power Transformer & HV Switchgear" },
  { src: "/assets/slider/substation/03.jpg", webpSrc: "/assets/slider/substation/03.webp", alt: "BTEL Switchgear & Panel Assembly Photo 03", caption: "Custom HV/LV Synchronization & Control Panel Assembly" },
  { src: "/assets/slider/substation/04.jpg", webpSrc: "/assets/slider/substation/04.webp", alt: "BTEL SCADA Substation Monitoring Photo 04", caption: "Digital Substation SCADA & Remote Control Room" },
];

export default function SubstationServicePage() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative flex min-h-[85vh] items-center overflow-hidden pt-20 bg-navy">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <picture className="relative block h-full w-full">
            <source srcSet="/assets/hero/substation.webp" type="image/webp" />
            <Image
              src="/assets/hero/substation.jpg"
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
              <span className="text-[#94A3B8]">Substation & Switchgear</span>
            </nav>

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-light/30 bg-blue-light/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-light">
              Service Division 01 · 33kV & 11kV Substation EPC
            </div>

            <h1 className="mb-6 font-display text-[clamp(40px,5.5vw,64px)] font-extrabold leading-[1.05] text-white">
              Substation &
              <br />
              <span className="bg-gradient-to-r from-blue-light to-teal bg-clip-text text-transparent">
                Switchgear Systems
              </span>
            </h1>

            <p className="mb-9 max-w-xl text-lg leading-[1.75] text-[#C3CDDB]">
              Complete 33kV & 11kV electrical substation systems, power transformers up to 20MVA,
              and HV/LV switchgear panels — delivering reliable power infrastructure across Bangladesh.
            </p>

            <div className="flex flex-wrap gap-10">
              <div>
                <div className="font-display text-[28px] font-extrabold text-white">
                  20<span className="text-base text-blue-light">MVA</span>
                </div>
                <div className="mt-1 text-xs text-muted">Max Transformer Range</div>
              </div>
              <div>
                <div className="font-display text-[28px] font-extrabold text-white">
                  33<span className="text-base text-blue-light">kV</span>
                </div>
                <div className="mt-1 text-xs text-muted">Max Voltage Capability</div>
              </div>
              <div>
                <div className="font-display text-[28px] font-extrabold text-white">DEIF</div>
                <div className="mt-1 text-xs text-muted">Authorized Distributor</div>
              </div>
            </div>
          </ServiceDetailHero>
        </div>
      </section>

      {/* Capabilities Overview Section — each card deep-links to its product category */}
      <section className="bg-navy2 px-6 py-20 sm:px-12 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="mb-2 text-[11px] font-bold uppercase tracking-[2px] text-blue-light">
                Core Capabilities
              </div>
              <h2 className="font-display text-[clamp(26px,3vw,36px)] font-extrabold leading-[1.1] text-white">
                What We Supply
              </h2>
            </div>
            <p className="max-w-md text-[13px] leading-[1.6] text-[#94A3B8]">
              Select a capability to jump to the matching product category in
              our full catalogue.
            </p>
          </Reveal>

          <StaggerGroup
            as="div"
            itemSelector="[data-stagger-item]"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {CAPABILITIES.map((cap) => (
              <Link
                key={cap.title}
                href={cap.href}
                data-stagger-item
                data-cursor-interactive
                className="group rounded-lg border border-white/10 bg-white/[0.04] p-6 transition-colors hover:border-blue-light/40 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-light/60 focus-visible:ring-offset-2 focus-visible:ring-offset-navy2"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-light/15 text-blue-light">
                  <cap.icon width={22} height={22} />
                </div>
                <h3 className="mb-1.5 font-display text-base font-bold text-white">{cap.title}</h3>
                <p className="text-xs leading-[1.6] text-[#94A3B8]">{cap.description}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-blue-light transition-transform duration-300 group-hover:translate-x-0.5">
                  View products
                  <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Full-Scope Features & Project Slider */}
      <section className="bg-offwhite px-6 py-24 sm:px-12 lg:px-20 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mx-auto max-w-2xl text-center">
            <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-blue">
              What We Deliver
            </div>
            <h2 className="mb-4 font-display text-[clamp(32px,3.6vw,44px)] font-extrabold leading-[1.1] text-navy">
              Full-Scope Substation Capability
            </h2>
            <p className="mx-auto max-w-2xl text-base leading-[1.7] text-[#4A5568]">
              From design and engineering to installation, commissioning and
              after-sales support — BTEL owns the entire project lifecycle.
            </p>
          </Reveal>

          <StaggerGroup
            as="div"
            itemSelector="[data-stagger-item]"
            className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {FEATURES.map((feature) => (
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
                <div className="mb-3.5 flex h-11 w-11 items-center justify-center rounded-lg bg-blue/10 text-blue">
                  <feature.icon width={22} height={22} />
                </div>
                <h3 className="mb-2 font-display text-lg font-extrabold text-navy">{feature.title}</h3>
                <p className="text-[13px] leading-[1.65] text-[#4A5568]">{feature.description}</p>
              </div>
            ))}
          </StaggerGroup>

          {/* Interactive Project Slider (After Feature List) */}
          <div className="mt-16">
            <Reveal>
              <div className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-blue">
                Delivered Substation Projects
              </div>
              <ServiceSlider slides={SUBSTATION_SLIDES} title="Substation Showcase" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Specifications Section */}
      <section className="bg-navy px-6 py-24 sm:px-12 lg:px-20 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mx-auto max-w-2xl text-center">
            <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-blue-light">
              Technical Specifications
            </div>
            <h2 className="mb-4 font-display text-[clamp(32px,3.6vw,44px)] font-extrabold leading-[1.1] text-white">
              Substation System Parameters
            </h2>
          </Reveal>

          <div className="mt-12 overflow-hidden rounded-[10px] border border-border bg-card">
            <table className="w-full border-collapse">
              <StaggerGroup as="tbody" itemSelector="[data-stagger-item]" stagger={0.05} y={8}>
                {SPECS.map((spec) => (
                  <tr key={spec.label} data-stagger-item className="border-b border-border last:border-none">
                    <td className="w-2/5 px-6 py-4 text-sm font-medium text-muted">
                      {spec.label}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-white">{spec.value}</td>
                  </tr>
                ))}
              </StaggerGroup>
            </table>
          </div>
        </div>
      </section>

      <OtherServicesSection currentSlug="substation" />

      <SiteFooter />
    </main>
  );
}
