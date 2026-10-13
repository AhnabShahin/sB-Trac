import Link from "next/link";
import { getServices, SERVICE_CATEGORIES, type ServiceCategorySlug } from "@/data/services";
import { Reveal } from "@/components/ui/reveal";
import { StaggerGroup } from "@/components/ui/stagger-group";
import { BoltIcon, SunIcon, WrenchIcon, DropletIcon, ClockIcon, ArrowRightIcon } from "@/components/ui/icons";

const ICON_MAP = {
  bolt: BoltIcon,
  sun: SunIcon,
  wrench: WrenchIcon,
  droplet: DropletIcon,
  clock: ClockIcon,
} as const;

const TONE_CLASSES = {
  blue: {
    border: "hover:border-blue-light/50",
    iconBg: "bg-blue-light/10 text-blue-light",
    iconBgHover: "group-hover:bg-blue-light/20",
    title: "group-hover:text-blue-light",
    arrow: "text-blue-light",
  },
  amber: {
    border: "hover:border-amber/50",
    iconBg: "bg-amber/10 text-amber",
    iconBgHover: "group-hover:bg-amber/20",
    title: "group-hover:text-amber",
    arrow: "text-amber",
  },
  teal: {
    border: "hover:border-teal/50",
    iconBg: "bg-teal/10 text-teal",
    iconBgHover: "group-hover:bg-teal/20",
    title: "group-hover:text-teal",
    arrow: "text-teal",
  },
  purple: {
    border: "hover:border-purple/50",
    iconBg: "bg-purple/10 text-purple",
    iconBgHover: "group-hover:bg-purple/20",
    title: "group-hover:text-purple",
    arrow: "text-purple",
  },
  cyan: {
    border: "hover:border-cyan/50",
    iconBg: "bg-cyan/10 text-cyan",
    iconBgHover: "group-hover:bg-cyan/20",
    title: "group-hover:text-cyan",
    arrow: "text-cyan",
  },
} as const;

export async function OtherServicesSection({ currentSlug }: { currentSlug: ServiceCategorySlug }) {
  const services = (await getServices()).filter((service) => service.categorySlug !== currentSlug);

  return (
    <section className="bg-navy px-6 py-24 sm:px-12 lg:px-20 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-blue-light">
            Explore More
          </div>
          <h2 className="mb-10 font-display text-[clamp(28px,3.2vw,38px)] font-extrabold leading-[1.1] text-white">
            Other Service Divisions
          </h2>
        </Reveal>

        <StaggerGroup
          as="div"
          itemSelector="[data-stagger-item]"
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          {services.map((service) => {
            const accent = SERVICE_CATEGORIES[service.categorySlug].accent;
            const tone = TONE_CLASSES[accent];
            const Icon = ICON_MAP[service.icon];
            return (
              <Link
                key={service.href}
                href={service.href}
                data-stagger-item
                data-cursor-interactive
                className={`group relative block rounded-lg border border-border bg-card px-6 py-7 no-underline transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.04] hover:shadow-[0_12px_32px_rgba(0,0,0,0.25)] ${tone.border}`}
              >
                <div
                  className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-300 ${tone.iconBg} ${tone.iconBgHover}`}
                >
                  <Icon width={22} height={22} />
                </div>
                <h3
                  className={`mb-1.5 font-display text-lg font-bold text-white transition-colors duration-300 ${tone.title}`}
                >
                  {SERVICE_CATEGORIES[service.categorySlug].label}
                </h3>
                <p className="mb-1 text-[13px] leading-[1.5] text-muted">{service.description}</p>
                <span
                  aria-hidden="true"
                  className={`absolute bottom-6 right-6 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100 ${tone.arrow}`}
                >
                  <ArrowRightIcon width={16} height={16} />
                </span>
              </Link>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
