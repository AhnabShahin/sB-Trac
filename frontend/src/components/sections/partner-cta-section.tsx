import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { Magnetic } from "@/components/ui/magnetic";

export function PartnerCtaSection() {
  return (
    <section className="relative overflow-hidden border-t border-border bg-navy px-6 py-24 text-center sm:px-12 lg:px-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 100% at 50% 0%, rgba(10,158,136,0.1) 0%, transparent 70%)",
        }}
      />

      <Reveal className="relative z-1 mx-auto max-w-3xl">
        <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-teal">
          Ready to Partner?
        </div>
        <h2 className="mb-5 font-display text-[clamp(28px,3.4vw,40px)] font-extrabold leading-[1.15] text-white">
          Let&apos;s Engineer Your Next Project
          <br />
          From Design to Commissioning
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-base leading-[1.75] text-muted">
          Five engineering divisions under one roof — substation &amp;
          switchgear, solar power, MEP/EPC, water treatment, and lifetime
          after-sales support. Since 2009, BTEL has delivered BDT 500 Cr+ in
          projects for 60+ of Bangladesh&apos;s most demanding industrial
          clients, with design, procurement, installation, and commissioning
          handled entirely in-house.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6">
          <Magnetic>
            <Link
              href="/products-services"
              data-cursor-interactive
              className="inline-block rounded-[4px] bg-blue-light px-8 py-3.5 text-[15px] font-semibold text-navy transition-colors hover:bg-blue2"
            >
              Explore Products &amp; Services →
            </Link>
          </Magnetic>
        </div>
      </Reveal>
    </section>
  );
}
