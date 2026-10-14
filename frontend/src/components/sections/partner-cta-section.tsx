import Link from "next/link";
import { getHomeContent } from "@/data/pages";
import { Reveal } from "@/components/ui/reveal";
import { Magnetic } from "@/components/ui/magnetic";

export async function PartnerCtaSection() {
  const content = await getHomeContent();
  const c = content?.partnerCta;
  if (!c) return null;

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
          {c.eyebrow}
        </div>
        <h2 className="mb-5 font-display text-[clamp(28px,3.4vw,40px)] font-extrabold leading-[1.15] text-white">
          {c.headingLine1}
          <br />
          {c.headingLine2}
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-base leading-[1.75] text-muted">
          {c.body}
        </p>

        {c.ctaLabel ? (
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Magnetic>
              <Link
                href={c.ctaHref || "#"}
                data-cursor-interactive
                className="inline-block rounded-[4px] bg-blue-light px-8 py-3.5 text-[15px] font-semibold text-navy transition-colors hover:bg-blue2"
              >
                {c.ctaLabel}
              </Link>
            </Magnetic>
          </div>
        ) : null}
      </Reveal>
    </section>
  );
}
