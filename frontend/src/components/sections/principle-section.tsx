import Image from "next/image";
import { getHomeContent } from "@/data/pages";
import { Reveal } from "@/components/ui/reveal";
import { StaggerGroup } from "@/components/ui/stagger-group";
import { Counter } from "@/components/ui/counter";
import { cn } from "@/lib/utils";

const PILLAR_BORDER = {
  teal: "border-t-teal",
  blue: "border-t-blue",
  amber: "border-t-amber",
} as const;

const PILLAR_TEXT = {
  teal: "text-teal",
  blue: "text-blue-light",
  amber: "text-amber",
} as const;

const PILLAR_SHADOW = {
  teal: "hover:shadow-[0_16px_36px_rgba(10,158,136,0.16)]",
  blue: "hover:shadow-[0_16px_36px_rgba(159,185,252,0.16)]",
  amber: "hover:shadow-[0_16px_36px_rgba(224,138,0,0.16)]",
} as const;

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
      <section id="about" className="relative z-10 overflow-hidden bg-navy2 px-6 pt-24 pb-24 sm:px-12 sm:pt-28 sm:pb-28 lg:px-20 lg:pt-32 lg:pb-32">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,14,26,0.94)_0%,rgba(9,16,30,0.89)_32%,rgba(11,19,34,0.83)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,11,21,0.72)_0%,rgba(8,14,26,0.45)_28%,rgba(6,11,21,0.62)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(9,140,128,0.13),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(140,168,255,0.10),transparent_30%)]" />
          <picture className="relative block h-full w-full">
            <source srcSet="/assets/hero/who-we-are.webp" type="image/webp" />
            <Image
              src="/assets/hero/who-we-are.jpg"
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-center opacity-25 saturate-60 brightness-75"
              loading="lazy"
              decoding="async"
            />
          </picture>
        </div>
        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="mb-16 grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-start">
            <Reveal>
              <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-teal drop-shadow-[0_0_18px_rgba(10,158,136,0.35)]">
                {c.eyebrow}
              </div>
              <h2 className="mb-4 max-w-[620px] whitespace-pre-line font-display text-[clamp(32px,3.6vw,44px)] font-extrabold leading-[1.1] text-white drop-shadow-[0_12px_28px_rgba(0,0,0,0.38)]">
                {c.heading}
              </h2>
              {c.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className={cn(
                    "max-w-[620px] text-[15px] leading-[1.8] text-slate-200/90 drop-shadow-[0_6px_18px_rgba(0,0,0,0.35)]",
                    i === c.paragraphs.length - 1 ? "mb-7" : "mb-4",
                  )}
                >
                  {p}
                </p>
              ))}
              {c.ctaLabel ? (
                <a
                  href={c.ctaHref || "#"}
                  data-cursor-interactive
                  className="inline-block rounded-[4px] bg-blue-light/95 px-7 py-3 text-sm font-semibold text-navy shadow-[0_10px_26px_rgba(0,0,0,0.22)] transition-all hover:-translate-y-0.5 hover:bg-blue2"
                >
                  {c.ctaLabel}
                </a>
              ) : null}
            </Reveal>

            <Reveal delay={0.1}>
              <div className="rounded-[10px] border border-white/10 bg-white/6 px-7 py-7 shadow-[0_18px_48px_rgba(0,0,0,0.38)] backdrop-blur-md transition-all duration-300 hover:border-teal/30 hover:shadow-[0_20px_60px_rgba(0,0,0,0.42)]">
                <div className="mb-5 text-[11px] font-bold uppercase tracking-[2px] text-teal">
                  {c.glanceTitle}
                </div>
                <dl className="divide-y divide-white/10">
                  {c.facts.map((fact) => (
                    <div
                      key={fact.label}
                      className="group flex items-center justify-between gap-4 py-3 transition-colors duration-200 first:pt-0 last:pb-0"
                    >
                      <dt className="text-[13px] text-slate-200/80 transition-colors duration-200 group-hover:text-white/90">
                        {fact.label}
                      </dt>
                      <dd
                        className={cn(
                          "text-right text-sm font-semibold transition-transform duration-200 group-hover:scale-105",
                          fact.accent ? "text-teal" : "text-white",
                        )}
                      >
                        {fact.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

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
              <div className="mt-2 text-[13px] leading-[1.5] text-muted">
                {stat.description}
              </div>
            </div>
          );
        })}
      </StaggerGroup>

      <section id="foundation" className="bg-navy px-6 py-20 sm:px-12 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-14">
            <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-teal">
              {c.foundationEyebrow}
            </div>
            <h2 className="font-display text-[clamp(32px,3.6vw,44px)] font-extrabold leading-[1.1] text-white">
              {c.foundationHeading}
            </h2>
          </Reveal>

          <StaggerGroup
            className="grid grid-cols-1 gap-6 md:grid-cols-3"
            itemSelector="[data-stagger-item]"
          >
            {c.pillars.map((pillar) => (
              <div
                key={pillar.title}
                data-stagger-item
                className={cn(
                  "group rounded-[10px] border border-border border-t-[3px] bg-card px-7 py-9 transition-all duration-300 hover:-translate-y-1.5",
                  PILLAR_BORDER[pillar.accent],
                  PILLAR_SHADOW[pillar.accent],
                )}
              >
                <div
                  className={cn(
                    "mb-4 font-display text-[13px] font-bold uppercase tracking-[3px] transition-transform duration-300 group-hover:translate-x-0.5",
                    PILLAR_TEXT[pillar.accent],
                  )}
                >
                  {pillar.title}
                </div>
                {pillar.description && (
                  <p className="text-[15px] leading-[1.7] text-[#CBD5E1]">
                    {pillar.description}
                  </p>
                )}
                {pillar.items.length > 0 && (
                  <ul className="space-y-0 text-sm leading-[2] text-[#CBD5E1]">
                    {pillar.items.map((item) => (
                      <li key={item.label}>▸ {item.label}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </StaggerGroup>
        </div>
      </section>
    </>
  );
}
