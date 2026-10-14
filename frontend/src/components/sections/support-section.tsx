import { getHomeContent } from "@/data/pages";
import { Reveal } from "@/components/ui/reveal";
import { StaggerGroup } from "@/components/ui/stagger-group";
import { WrenchIcon, RefreshIcon, TargetIcon, ClockIcon } from "@/components/ui/icons";

const ICON_MAP = {
  wrench: WrenchIcon,
  refresh: RefreshIcon,
  target: TargetIcon,
  clock: ClockIcon,
} as const;

export async function SupportSection() {
  const content = await getHomeContent();
  const c = content?.support;
  if (!c) return null;

  return (
    <section id="aftersales" className="bg-navy px-6 py-20 sm:px-12 lg:px-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <Reveal>
          <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-teal">
            {c.eyebrow}
          </div>
          <h2 className="mb-4 whitespace-pre-line font-display text-[clamp(36px,4vw,52px)] font-extrabold leading-[1.05] text-white">
            {c.heading}
          </h2>
          <p className="max-w-[520px] text-base leading-[1.7] text-muted">{c.intro}</p>
        </Reveal>

        <StaggerGroup className="grid grid-cols-2 gap-4" itemSelector="[data-stagger-item]">
          {c.features.map((feature) => {
            const Icon = ICON_MAP[feature.icon] ?? WrenchIcon;
            return (
              <div
                key={feature.title}
                data-stagger-item
                className="group rounded-lg border border-border bg-card px-5 py-6 transition-all duration-300 hover:-translate-y-1 hover:border-teal/30 hover:shadow-[0_14px_32px_rgba(10,158,136,0.14)]"
              >
                <div className="mb-2.5 flex h-8 w-8 items-center justify-center text-teal transition-transform duration-300 group-hover:scale-110">
                  <Icon width={22} height={22} />
                </div>
                <div className="mb-1.5 font-display text-[15px] font-bold text-white">
                  {feature.title}
                </div>
                <div className="text-[13px] leading-[1.6] text-muted">
                  {feature.description}
                </div>
              </div>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
