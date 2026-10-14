import { getHomeContent } from "@/data/pages";
import { Reveal } from "@/components/ui/reveal";
import { PortfolioTiles } from "@/components/sections/portfolio-tiles";

export async function ProjectsSection() {
  const content = await getHomeContent();
  const c = content?.projects;
  if (!c) return null;

  return (
    <section id="projects" className="bg-navy2 px-6 py-24 sm:px-12 lg:px-20">
      <Reveal className="mb-12">
        <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-teal">
          {c.eyebrow}
        </div>
        <h2 className="font-display text-[clamp(36px,4vw,52px)] font-extrabold leading-[1.05] text-white">
          {c.headingLine1}
          <br />
          {c.headingLine2}
        </h2>
      </Reveal>

      <PortfolioTiles cards={c.cards} />
    </section>
  );
}
