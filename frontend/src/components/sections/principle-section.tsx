import { getHomeContent } from "@/data/pages";
import { StaggerGroup } from "@/components/ui/stagger-group";
import { Counter } from "@/components/ui/counter";
import { FoundationPanels } from "@/components/sections/foundation-panels";
import { cn } from "@/lib/utils";

function parseStatValue(raw: string) {
  const match = raw.match(/^(\D*)(\d+(?:\.\d+)?)$/);
  if (!match) return { prefix: raw, number: 0 };
  return { prefix: match[1], number: parseFloat(match[2]) };
}

export async function PrincipleSection() {
  const content = await getHomeContent();
  const c = content?.principle;
  if (!c) return null;

  return (
    <>
      <StaggerGroup
        as="div"
        className="grid grid-cols-2 gap-0 border-y border-border bg-navy px-6 py-16 sm:px-12 lg:grid-cols-4 lg:px-20"
        itemSelector="[data-stagger-item]"
      >
        {c.stats.map((stat, i) => {
          const { prefix, number } = parseStatValue(stat.value);
          return (
            <div
              key={stat.description}
              data-stagger-item
              className={cn(
                "group px-4 py-4 text-center transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.03] sm:px-8",
                i !== c.stats.length - 1 && "border-border sm:border-r",
              )}
            >
              <Counter
                value={number}
                prefix={prefix}
                suffix={stat.accent}
                className="font-display text-[42px] font-extrabold leading-none text-white transition-colors duration-300 group-hover:text-teal sm:text-[56px]"
                suffixClassName="text-teal"
              />
              <div className="mt-2 text-sm font-medium leading-[1.5] text-slate-300">
                {stat.description}
              </div>
            </div>
          );
        })}
      </StaggerGroup>

      <section id="foundation" className="bg-navy px-6 py-20 sm:px-12 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <FoundationPanels
            eyebrow={c.foundationEyebrow}
            heading={c.foundationHeading}
            pillars={c.pillars}
          />
        </div>
      </section>
    </>
  );
}
