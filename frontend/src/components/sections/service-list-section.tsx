import { getProductsServicesContent } from "@/data/pages";
import { Reveal } from "@/components/ui/reveal";
import { StaggerGroup } from "@/components/ui/stagger-group";
import { ServiceListRow } from "@/components/sections/service-list-row";

export async function ServiceListSection() {
  const content = await getProductsServicesContent();
  const c = content?.serviceList;
  if (!c) return null;

  return (
    <section id="services" className="bg-navy2 px-6 py-24 sm:px-12 lg:px-20 lg:py-28">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-teal">
            {c.eyebrow}
          </div>
          <h2 className="mb-4 font-display text-[clamp(32px,3.6vw,44px)] font-extrabold leading-[1.1] text-white">
            {c.heading}
          </h2>
          <p className="max-w-2xl text-base leading-[1.7] text-[#94A3B8]">{c.intro}</p>
        </Reveal>

        <StaggerGroup
          as="div"
          itemSelector="[data-stagger-item]"
          stagger={0.08}
          className="mt-12 overflow-hidden rounded-xl bg-border"
        >
          <ol className="flex flex-col gap-[2px]">
            {c.services.map((service, i) => (
              <ServiceListRow key={`${service.title}-${i}`} service={service} />
            ))}
          </ol>
        </StaggerGroup>
      </div>
    </section>
  );
}
