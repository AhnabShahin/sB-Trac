import { getProjects } from "@/data/company";
import { Reveal } from "@/components/ui/reveal";
import { ProjectShowcaseTiles } from "@/components/sections/project-showcase-tiles";

export async function ProjectsSection() {
  const projects = await getProjects();

  return (
    <section id="projects" className="bg-navy2 px-6 py-24 sm:px-12 lg:px-20">
      <Reveal className="mb-12">
        <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-teal">
          Project Portfolio
        </div>
        <h2 className="font-display text-[clamp(36px,4vw,52px)] font-extrabold leading-[1.05] text-white">
          Work That Speaks
          <br />
          For Itself
        </h2>
      </Reveal>

      <ProjectShowcaseTiles projects={projects} />
    </section>
  );
}
