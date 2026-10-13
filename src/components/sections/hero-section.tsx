import Link from "next/link";
import { getHeroStats, getHeroSlides } from "@/data/site";
import { Reveal } from "@/components/ui/reveal";
import { StaggerGroup } from "@/components/ui/stagger-group";
import { Counter } from "@/components/ui/counter";
import { Magnetic } from "@/components/ui/magnetic";
import { HeroServiceStack } from "@/components/sections/hero-service-stack";
import { HeroBackgroundSlider } from "@/components/sections/hero-background-slider";

export async function HeroSection() {
  const [stats, slides] = await Promise.all([getHeroStats(), getHeroSlides()]);

  return (
    <section className="relative grid grid-cols-1 overflow-hidden pt-16 lg:min-h-screen lg:grid-cols-2">
      <HeroBackgroundSlider slides={slides} />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(14,21,40,0.35) 0%, rgba(14,21,40,0.55) 50%, rgba(14,21,40,0.85) 100%), linear-gradient(90deg, rgba(14,21,40,0.75) 0%, rgba(14,21,40,0.3) 55%, rgba(14,21,40,0.6) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 70% 50%, rgba(159,185,252,0.12) 0%, transparent 70%), radial-gradient(ellipse 40% 60% at 20% 80%, rgba(10,158,136,0.08) 0%, transparent 60%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* The client logo band is its own full-width section below the hero, so the
          hero no longer has to reserve room for a rail straddling its bottom edge.
          The generous bottom padding (pb-40 on desktop) that used to clear that
          overlap is gone, which brings the stat row back to a normal breath. */}
      <div className="relative z-1 flex flex-col justify-center px-6 pt-20 pb-20 sm:px-12 sm:pb-24 lg:py-20 lg:pl-20 lg:pr-12 lg:pb-28">
        <Reveal y={20}>
          <div className="mb-7 inline-flex w-fit items-center gap-2 rounded-full border border-teal/30 bg-teal/[0.12] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-teal">
            <span className="h-1.5 w-1.5 shrink-0 animate-[var(--animate-pulse-dot)] rounded-full bg-teal" />
            ISO 9001:2015 Certified · Since 2009
          </div>
        </Reveal>

        <Reveal y={20} delay={0.1}>
          <h1
            className="mb-6 font-display text-[clamp(52px,6vw,78px)] font-extrabold leading-[0.95] tracking-[-1px] text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.45)]"
          >
            ENGINEERING
            <br />
            YOUR{" "}
            <span className="bg-gradient-to-br from-blue-light to-teal bg-clip-text text-transparent">
              GROWTH
            </span>
          </h1>
        </Reveal>

        <Reveal y={20} delay={0.2}>
          <p className="mb-10 max-w-[480px] text-[17px] leading-[1.7] text-[#C3CDDB] [text-shadow:0_1px_12px_rgba(0,0,0,0.4)]">
            Complete EPC and engineering solutions — from 33KV substations and
            megawatt-scale solar plants to MEP systems and water treatment.
            Trusted by 60+ industry leaders.
          </p>
        </Reveal>

        <Reveal y={20} delay={0.3}>
          <div className="flex flex-wrap items-center gap-4">
            <Magnetic>
              <Link
                href="/products-services"
                data-cursor-interactive
                className="inline-block rounded-[4px] bg-blue-light px-8 py-3.5 text-[15px] font-semibold text-navy transition-colors hover:bg-blue2"
              >
                Explore Our Services
              </Link>
            </Magnetic>
            <Magnetic strength={0.15}>
              <a
                href="#projects"
                data-cursor-interactive
                className="group flex items-center gap-2 border-b border-white/20 pb-0.5 text-[15px] font-medium text-white transition-colors hover:border-teal hover:text-teal"
              >
                View Projects <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            </Magnetic>
          </div>
        </Reveal>

        <StaggerGroup
          className="mt-14 flex flex-wrap gap-10 border-t border-border pt-8"
          itemSelector="[data-stagger-item]"
        >
          {stats.map((stat) => (
            <div key={stat.label} data-stagger-item>
              <Counter
                value={stat.value}
                suffix={stat.suffix}
                className="font-display text-[38px] font-extrabold leading-none text-white"
                suffixClassName="text-teal"
              />
              <div className="mt-1 text-xs uppercase tracking-wide text-muted">
                {stat.label}
              </div>
            </div>
          ))}
        </StaggerGroup>
      </div>

      <div className="relative z-1 flex items-center justify-center px-6 pb-16 sm:px-12 lg:py-20 lg:pl-12 lg:pr-20">
        <HeroServiceStack />
      </div>
    </section>
  );
}
