import { getServices } from "@/data/services";
import { Reveal } from "@/components/ui/reveal";
import { StaggerGroup } from "@/components/ui/stagger-group";
import { ServiceListRow } from "@/components/sections/service-list-row";

export async function ServiceListSection() {
  const services = await getServices();

  return (
    <section id="services" className="bg-navy2 px-6 py-24 sm:px-12 lg:px-20 lg:py-28">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-teal">
            All Divisions
          </div>
          <h2 className="mb-4 font-display text-[clamp(32px,3.6vw,44px)] font-extrabold leading-[1.1] text-white">
            Five Service Divisions
          </h2>
          <p className="max-w-2xl text-base leading-[1.7] text-[#94A3B8]">
            Each division is staffed by factory-trained engineers and backed
            by BTEL&apos;s ISO 9001:2015 quality management system.
          </p>
        </Reveal>

        <StaggerGroup
          as="div"
          itemSelector="[data-stagger-item]"
          stagger={0.08}
          className="mt-12 overflow-hidden rounded-xl bg-border"
        >
          <ol className="flex flex-col gap-[2px]">
            {services.map((service) => (
              <ServiceListRow key={service.id} service={service} />
            ))}
          </ol>
        </StaggerGroup>
      </div>
    </section>
  );
}
