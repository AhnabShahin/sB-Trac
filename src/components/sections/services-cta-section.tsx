import { Reveal } from "@/components/ui/reveal";
import { AnimatedGlow } from "@/components/ui/animated-glow";
import { ServicesCtaButton } from "@/components/sections/services-cta-button";

export function ServicesCtaSection() {
  return (
    <section
      className="relative overflow-hidden px-6 py-24 text-center sm:px-12 lg:px-20"
      style={{
        background: "linear-gradient(135deg, #101729 0%, #182037 60%, #141e40 100%)",
      }}
    >
      <AnimatedGlow />

      <Reveal className="relative z-1 mx-auto max-w-2xl">
        <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-teal">
          Get Started
        </div>
        <h2 className="mb-4 font-display text-[clamp(32px,4vw,48px)] font-extrabold leading-[1.1] text-white">
          Tell Us About
          <br />
          Your Project
        </h2>
        <p className="mx-auto mb-8 max-w-lg text-base leading-[1.7] text-[#94A3B8]">
          Discuss your engineering requirements with BTEL&apos;s team.
          We&apos;ll provide a technical proposal tailored to your project
          scope.
        </p>
        <ServicesCtaButton />
      </Reveal>
    </section>
  );
}
