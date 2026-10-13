import { getStrengthPillars } from "@/data/company";
import { Reveal } from "@/components/ui/reveal";
import { StaggerGroup } from "@/components/ui/stagger-group";
import { HardHatIcon, CoinsIcon, FactoryIcon, TruckIcon } from "@/components/ui/icons";

const ICON_MAP = {
  hardhat: HardHatIcon,
  coins: CoinsIcon,
  factory: FactoryIcon,
  truck: TruckIcon,
} as const;

export async function StrengthSection() {
  const pillars = await getStrengthPillars();

  return (
    <section className="bg-navy2 px-6 py-20 sm:px-12 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-14">
          <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-teal">
            Operational Excellence
          </div>
          <h2 className="mb-4 font-display text-[clamp(32px,3.6vw,44px)] font-extrabold leading-[1.1] text-white">
            Our Strength
          </h2>
          <p className="max-w-xl text-base leading-[1.7] text-muted">
            Four pillars of operational capability that enable BTEL to
            deliver complex, large-scale engineering projects with precision.
          </p>
        </Reveal>

        <StaggerGroup
          className="grid grid-cols-1 gap-5 sm:grid-cols-2"
          itemSelector="[data-stagger-item]"
        >
          {pillars.map((pillar) => {
            const Icon = ICON_MAP[pillar.icon];
            return (
              <div
                key={pillar.title}
                data-stagger-item
                className="group flex gap-4 rounded-lg border border-border bg-card px-6 py-6 transition-all duration-300 hover:-translate-y-1 hover:border-teal/30 hover:shadow-[0_12px_32px_rgba(10,158,136,0.12)]"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-teal/[0.1] text-teal transition-all duration-300 group-hover:scale-110 group-hover:bg-teal group-hover:text-navy">
                  <Icon width={22} height={22} />
                </div>
                <div>
                  <div className="mb-1.5 font-display text-[15px] font-bold text-white">
                    {pillar.title}
                  </div>
                  <p className="text-[13px] leading-[1.65] text-muted">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
