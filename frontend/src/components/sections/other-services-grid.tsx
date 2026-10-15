import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { StaggerGroup } from "@/components/ui/stagger-group";
import { ArrowRightIcon } from "@/components/ui/icons";
import { SERVICE_ICON_COMPONENTS } from "@/lib/service-icons";
import { iconChip } from "@/lib/color";
import type { OtherServicesSectionContent } from "@/data/content-types";

// Content-driven replacement for the old `OtherServicesSection` (which derived
// its cards from the static `data/services.ts` list). Each sub-page now keeps
// its own admin-editable copy of the other divisions' cross-links, so this
// grid has no read dependency on its sibling pages' content.
export function OtherServicesGrid({ content }: { content: OtherServicesSectionContent }) {
  if (!content.cards.length) return null;

  return (
    <section className="bg-navy px-6 py-24 sm:px-12 lg:px-20 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-blue-light">
            {content.eyebrow}
          </div>
          <h2 className="mb-10 font-display text-[clamp(28px,3.2vw,38px)] font-extrabold leading-[1.1] text-white">
            {content.heading}
          </h2>
        </Reveal>

        <StaggerGroup
          as="div"
          itemSelector="[data-stagger-item]"
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          {content.cards.map((card) => {
            const Icon = SERVICE_ICON_COMPONENTS[card.icon];
            return (
              <Link
                key={card.title}
                href={card.href || "#"}
                data-stagger-item
                data-cursor-interactive
                className="group relative block rounded-lg border border-border bg-card px-6 py-7 no-underline transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.04] hover:shadow-[0_12px_32px_rgba(0,0,0,0.25)]"
              >
                <div
                  className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-300"
                  style={{ background: iconChip(card.accentColor), color: card.accentColor }}
                >
                  <Icon width={22} height={22} />
                </div>
                <h3
                  className="mb-1.5 font-display text-lg font-bold text-white transition-colors duration-300 group-hover:[color:var(--hover-accent)]"
                  style={{ ["--hover-accent" as string]: card.accentColor }}
                >
                  {card.title}
                </h3>
                <p className="mb-1 text-[13px] leading-[1.5] text-muted">{card.description}</p>
                <span
                  aria-hidden="true"
                  className="absolute bottom-6 right-6 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
                  style={{ color: card.accentColor }}
                >
                  <ArrowRightIcon width={16} height={16} />
                </span>
              </Link>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
