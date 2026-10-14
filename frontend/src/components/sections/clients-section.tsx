import { getIndustryLeaders } from "@/data/company";
import { Reveal } from "@/components/ui/reveal";
import { ClientIndustryBands } from "@/components/sections/client-industry-bands";

export async function ClientsSection() {
  const leaders = await getIndustryLeaders();
  const industryCount = new Set(leaders.map((client) => client.industry)).size;

  return (
    <section id="clients" className="border-t border-border bg-navy">
      <div className="px-6 pb-14 pt-24 sm:px-12 lg:px-20">
        <Reveal className="mx-auto max-w-xl text-center">
          <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-teal">
            Trusted By
          </div>
          <h2 className="font-display text-[clamp(36px,4vw,52px)] font-extrabold leading-[1.05] text-white">
            {leaders.length}+ Industry Leaders
          </h2>
          <p className="mx-auto mt-4 max-w-[520px] text-base leading-[1.7] text-[#94A3B8]">
            From multinationals to government institutions — Bangladesh&apos;s
            most demanding engineering clients trust BTEL, across{" "}
            {industryCount} industries.
          </p>
        </Reveal>
      </div>

      <ClientIndustryBands />
    </section>
  );
}
