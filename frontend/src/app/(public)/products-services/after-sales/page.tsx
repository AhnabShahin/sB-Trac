import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ServiceDetailHero } from "@/components/sections/service-detail-hero";
import { Reveal } from "@/components/ui/reveal";
import { StaggerGroup } from "@/components/ui/stagger-group";
import { SiteFooter } from "@/components/sections/site-footer";
import {
  WrenchIcon,
  HandshakeIcon,
  TargetIcon,
  ClockIcon,
  BoltIcon,
  ChecklistIcon,
  PhoneIcon,
  WhatsappIcon,
  TargetIcon as SearchIcon,
  WrenchIcon as RepairIcon,
  ShieldIcon,
  FactoryIcon,
  SunIcon,
  MailIcon,
  type IconProps,
} from "@/components/ui/icons";

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

const STATS = [
  { value: "24", accent: "/7", description: "Round-the-clock support nationwide" },
  { value: "<24", accent: "h", description: "Emergency response dispatch time target" },
  { value: "145", accent: "+", description: "Field engineers & technicians across Bangladesh" },
  { value: "60", accent: "+", description: "Active clients with support agreements" },
];

const SERVICES: { icon: (props: IconProps) => React.JSX.Element; title: string; description: string; highlight?: boolean }[] = [
  {
    icon: WrenchIcon,
    title: "Unparalleled Technical Expertise",
    description:
      "Our service engineers are factory-trained on every solution BTEL delivers — from substation protection systems to solar inverters. You get the same expertise post-delivery as during installation.",
  },
  {
    icon: HandshakeIcon,
    title: "Embracing Commitments",
    description:
      "We safeguard every sale with extensive after-sales service coverage. AMC agreements, spare parts provisioning, and scheduled maintenance visits keep your assets in peak operating condition.",
  },
  {
    icon: TargetIcon,
    title: "Precision Engineering",
    description:
      "BTEL's service team pursues work perfection relentlessly — diagnosing root causes, not just symptoms. We close every ticket only when the client confirms satisfaction.",
  },
  {
    icon: ClockIcon,
    title: "24/7 Effortless Vigilance",
    description:
      "Emergency calls receive immediate dispatch from our nearest field team. Service excellence is measured round the clock — nights, weekends, and public holidays included.",
  },
  {
    icon: BoltIcon,
    title: "Resolute Emergency Response",
    description:
      "Critical failures demand immediate action. BTEL's emergency response protocol ensures breakdowns are attended on the same day — preventing production loss and safety hazards.",
  },
  {
    icon: ChecklistIcon,
    title: "Annual Maintenance Contracts",
    description:
      "Planned, predictive, and preventive maintenance under structured AMC agreements — with defined SLAs, response times, and compliance reporting. Budget with certainty.",
    highlight: true,
  },
];

const PROCESS = [
  {
    icon: PhoneIcon,
    step: "1",
    color: "border-teal",
    dot: "bg-teal",
    title: "Log a Request",
    description:
      "Call, email, or fill the online form. Your request is logged immediately in our service system and acknowledged within 1 hour.",
  },
  {
    icon: SearchIcon,
    step: "2",
    color: "border-blue-light",
    dot: "bg-blue-light",
    title: "Assessment & Dispatch",
    description:
      "A technical lead evaluates the issue and dispatches the right engineer with the right tools — within agreed response timelines.",
  },
  {
    icon: RepairIcon,
    step: "3",
    color: "border-amber",
    dot: "bg-amber",
    title: "On-Site Resolution",
    description:
      "Our field engineer diagnoses, repairs, and tests to confirm full restoration. Emergency spare parts are stocked centrally for rapid deployment.",
  },
  {
    icon: ShieldIcon,
    step: "4",
    color: "border-teal",
    dot: "bg-teal",
    title: "Closure & Report",
    description:
      "A service report is issued confirming root cause, work done, and recommendations. Ticket closes only on client sign-off.",
  },
];

const REGIONS = [
  "Dhaka",
  "Chittagong",
  "Gazipur",
  "Narayanganj",
  "Sylhet",
  "Khulna",
  "Rajshahi",
  "Comilla",
  "Narsingdi",
  "All EPZs",
];

const COVERAGE_POINTS: { icon: (props: IconProps) => React.JSX.Element; title: string; description: string }[] = [
  {
    icon: FactoryIcon,
    title: "Industrial Zones",
    description:
      "All EPZs, SEZs, and private industrial parks. Our engineers are familiar with on-site protocols for multinational factory environments.",
  },
  {
    icon: SunIcon,
    title: "Solar Plant O&M",
    description:
      "Scheduled operations and maintenance visits for all BTEL-installed solar plants — inverter checks, panel cleaning, string testing, and yield optimization.",
  },
  {
    icon: BoltIcon,
    title: "Substation & Switchgear AMC",
    description:
      "Preventive maintenance programs for 11kV/33kV substations, transformers, HV/LV panels, and SCADA systems — keeping your power infrastructure reliable.",
  },
];

export default function AfterSalesServicePage() {
  return (
    <main className="flex-1">
      <section className="relative flex min-h-[80vh] items-center overflow-hidden pt-20 bg-navy">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <picture className="relative block h-full w-full">
            <source srcSet="/assets/hero/after-sales.webp" type="image/webp" />
            <Image
              src="/assets/hero/after-sales.jpg"
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
              <span className="text-[#94A3B8]">After Sales Support</span>
            </nav>

            <div
              data-hero-item
              className="mb-7 inline-flex w-fit items-center gap-2 rounded-full border border-cyan/30 bg-cyan/[0.1] px-4 py-1.5 text-xs font-bold uppercase tracking-[1px] text-cyan"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
              24/7 · Nationwide Coverage
            </div>

            <h1
              data-hero-item
              className="mb-6 font-display text-[clamp(40px,5.5vw,64px)] font-extrabold leading-[0.95] tracking-[-1px] text-white"
            >
              After Sales
              <br />
              <span className="text-cyan">Support</span> &<br />
              Service
            </h1>

            <p data-hero-item className="mb-8 max-w-xl text-base leading-[1.75] text-[#94A3B8]">
              Our commitment doesn&apos;t end at project handover. BTEL
              provides nationwide, round-the-clock after-sales support
              ensuring reliable operation, timely service, and lasting
              customer confidence — for every solution we deliver.
            </p>

            {/* <div data-hero-item className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                data-cursor-interactive
                className="inline-flex items-center gap-2 rounded bg-cyan px-8 py-3.5 text-[15px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-cyan-dark"
              >
                Log a Service Request →
              </Link>
              <Link
                href="tel:+8801755515151"
                data-cursor-interactive
                className="inline-flex items-center gap-2 border-b border-white/20 pb-0.5 text-[15px] font-medium text-white transition-colors hover:border-teal hover:text-teal"
              >
                Call Emergency Line →
              </Link>
            </div> */}
          </ServiceDetailHero>
        </div>
      </section>

      <div className="border-y border-border bg-card px-6 py-14 sm:px-12 lg:px-20">
        <StaggerGroup
          as="div"
          itemSelector="[data-stagger-item]"
          className="mx-auto grid max-w-6xl grid-cols-2 gap-y-8 lg:grid-cols-4 lg:gap-y-0"
        >
          {STATS.map((stat, i) => (
            <div
              key={stat.value + stat.description}
              data-stagger-item
              className={`px-4 text-center sm:px-6 ${
                i !== STATS.length - 1 ? "lg:border-r lg:border-border" : ""
              }`}
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

      <section className="bg-navy px-6 py-24 sm:px-12 lg:px-20 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-cyan">
              What We Offer
            </div>
            <h2 className="mb-4 font-display text-[clamp(32px,3.6vw,44px)] font-extrabold leading-[1.1] text-white">
              Five Pillars of
              <br />
              After-Sales Excellence
            </h2>
            <p className="max-w-2xl text-base leading-[1.7] text-[#94A3B8]">
              From planned maintenance to emergency response — BTEL&apos;s
              post-delivery service team is built to keep your systems
              running at peak performance.
            </p>
          </Reveal>

          <StaggerGroup
            as="div"
            itemSelector="[data-stagger-item]"
            className="mt-12 grid grid-cols-1 gap-[2px] overflow-hidden rounded-xl bg-border sm:grid-cols-2 lg:grid-cols-3"
          >
            {SERVICES.map((service, i) => (
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
                <div className="relative mb-5 flex h-12 w-12 items-center justify-center rounded-lg border border-cyan/20 bg-cyan/[0.12] text-cyan">
                  <service.icon width={22} height={22} />
                </div>
                <h3 className="relative mb-2.5 font-display text-xl font-extrabold leading-[1.1] text-white">
                  {service.title}
                </h3>
                <p className="relative text-sm leading-[1.65] text-[#94A3B8]">{service.description}</p>
              </div>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <section className="bg-navy2 px-6 py-24 sm:px-12 lg:px-20 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mx-auto max-w-xl text-center">
            <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-cyan">
              How We Work
            </div>
            <h2 className="mb-4 font-display text-[clamp(32px,3.6vw,44px)] font-extrabold leading-[1.1] text-white">
              Our Service Process
            </h2>
            <p className="mx-auto max-w-md text-base leading-[1.7] text-[#94A3B8]">
              From the moment you log a request to confirmed resolution —
              BTEL&apos;s service process is structured, transparent, and
              accountable.
            </p>
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
            {PROCESS.map((step) => (
              <div key={step.step} data-stagger-item className="px-5 text-center">
                <div
                  className={`relative z-1 mx-auto mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-full border-2 bg-card text-white ${step.color}`}
                >
                  <step.icon width={26} height={26} />
                  <span
                    className={`absolute -right-1.5 -top-1.5 flex h-[22px] w-[22px] items-center justify-center rounded-full font-display text-[11px] font-extrabold text-white ${step.dot}`}
                  >
                    {step.step}
                  </span>
                </div>
                <h3 className="mb-2 font-display text-[17px] font-bold text-white">{step.title}</h3>
                <p className="text-[13px] leading-[1.6] text-muted">{step.description}</p>
              </div>
            ))}
          </StaggerGroup>
        </div>
      </section>

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
                NATIONWIDE COVERAGE
              </div>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-[1.7] text-[#94A3B8]">
                BTEL field engineers are positioned across Bangladesh&apos;s
                major industrial zones and cities — ensuring rapid response
                anywhere in the country.
              </p>
              <StaggerGroup
                as="div"
                itemSelector="[data-stagger-item]"
                stagger={0.04}
                y={10}
                className="mt-5 flex flex-wrap justify-center gap-2"
              >
                {REGIONS.map((region) => (
                  <span
                    key={region}
                    data-stagger-item
                    className="rounded-[4px] border border-teal/20 bg-teal/[0.1] px-3 py-1.5 text-xs font-semibold text-teal"
                  >
                    {region}
                  </span>
                ))}
              </StaggerGroup>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-cyan">
              Coverage Details
            </div>
            <h2 className="mb-4 font-display text-[clamp(32px,3.6vw,44px)] font-extrabold leading-[1.1] text-white">
              Wherever Your Facility,
              <br />
              We&apos;re There
            </h2>
            <p className="mb-9 max-w-2xl text-base leading-[1.7] text-[#94A3B8]">
              BTEL&apos;s service network covers all major industrial belts
              in Bangladesh — from the Dhaka Export Processing Zone to the
              Chittagong port industrial corridor and beyond.
            </p>
            <StaggerGroup
              as="div"
              itemSelector="[data-stagger-item]"
              stagger={0.08}
              y={16}
              className="flex flex-col gap-5"
            >
              {COVERAGE_POINTS.map((point) => (
                <div key={point.title} data-stagger-item className="flex items-start gap-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-blue-light/20 bg-blue-light/[0.12] text-blue-light">
                    <point.icon width={20} height={20} />
                  </div>
                  <div>
                    <h3 className="mb-1 font-display text-[17px] font-bold text-white">{point.title}</h3>
                    <p className="text-sm leading-[1.6] text-muted">{point.description}</p>
                  </div>
                </div>
              ))}
            </StaggerGroup>
          </Reveal>
        </div>
      </section>

      <section
        className="px-6 py-20 text-center sm:px-12 lg:px-20"
        style={{ background: "linear-gradient(135deg, var(--color-navy2), var(--color-navy))" }}
      >
        <Reveal className="mx-auto max-w-2xl">
          <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-cyan">
            Contact Our Service Team
          </div>
          <h2 className="mb-4 font-display text-[clamp(32px,4vw,48px)] font-extrabold leading-[1.1] text-white">
            Need Service Support?
            <br />
            We Respond Fast.
          </h2>
          <p className="mx-auto text-base leading-[1.75] text-[#94A3B8]">
            Log a service request online, call our direct service line, or
            reach out for an AMC agreement.
          </p>

          <StaggerGroup
            as="div"
            itemSelector="[data-stagger-item]"
            stagger={0.1}
            className="mx-auto mt-12 grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-2"
          >
            <div
              data-stagger-item
              className="group rounded-[10px] border border-border bg-card px-6 py-7 text-center transition-colors hover:border-[#25D366]"
            >
              {/* WhatsApp brand green rather than the teal used by the sibling
                  "Service Email" card. This tile is now a WhatsApp action, and the
                  contact page's WhatsApp buttons are already keyed to #25D366, so
                  the two read as the same thing. */}
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-[#25D366]/10 text-[#25D366] transition-colors group-hover:bg-[#25D366] group-hover:text-white">
                <WhatsappIcon width={20} height={20} />
              </div>
              <div className="mb-1 font-display text-[17px] font-bold text-white">Emergency Line</div>
              <div className="mb-4 text-[13px] text-muted">Available 24/7 for critical failures</div>
              {/* Opens WhatsApp in a new tab rather than the dialer. `waId` is the
                  same 8801755515151 already published in `WHATSAPP_LINKS` on the
                  contact page, so the two routes into the line stay in step.
                  `noopener noreferrer` because this leaves the site. */}
              <a
                href="https://wa.me/8801755515151"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-interactive
                className="inline-block border-b border-[#25D366]/40 pb-px text-[13px] font-semibold text-[#25D366] transition-colors hover:border-[#25D366] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]/60"
              >
                +88 01755-515151
              </a>
            </div>
            <div data-stagger-item className="rounded-[10px] border border-border bg-card px-6 py-7 text-center transition-colors hover:border-teal">
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-teal/10 text-teal">
                <MailIcon width={20} height={20} />
              </div>
              <div className="mb-1 font-display text-[17px] font-bold text-white">Service Email</div>
              <div className="mb-4 text-[13px] text-muted">Log a non-urgent request</div>
              <a
                href="mailto:info@btraceng.com"
                className="border-b border-teal/30 pb-px text-[13px] font-semibold text-teal"
              >
                info@btraceng.com
              </a>
            </div>
          </StaggerGroup>

          <div className="mt-8">
            <Link
              href="/contact"
              data-cursor-interactive
              className="inline-flex items-center gap-2 rounded bg-teal px-8 py-3.5 text-[15px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-teal-dark"
            >
              Submit a Service Request Online →
            </Link>
          </div>
        </Reveal>
      </section>

      <SiteFooter />
    </main>
  );
}
