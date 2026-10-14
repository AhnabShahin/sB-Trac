import { getTimeline } from "@/data/company";
import { TimelineTrack } from "@/components/sections/timeline-track";
import { Reveal } from "@/components/ui/reveal";

export async function TimelineSection() {
  const milestones = await getTimeline();

  return (
    <section className="border-t border-border bg-navy2 px-6 py-20 sm:px-12 lg:px-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-20">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-teal">
            Our Journey
          </div>
          <h2 className="mb-4 font-display text-[clamp(32px,3.6vw,44px)] font-extrabold leading-[1.1] text-white">
            16 Years of
            <br />
            <span className="text-teal">Engineering Growth</span>
          </h2>
          <p className="text-base leading-[1.7] text-muted">
            From a single-division startup to a multi-division EPC
            powerhouse — here&apos;s how BTEL grew.
          </p>
        </Reveal>

        <TimelineTrack milestones={milestones} />
      </div>
    </section>
  );
}
