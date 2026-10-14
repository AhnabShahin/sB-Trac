import Image from "next/image";
import Link from "next/link";
import type { PortfolioCard } from "@/data/content-types";
import { StaggerGroup } from "@/components/ui/stagger-group";
import { cn } from "@/lib/utils";

const ACCENT_TEXT = {
  blue: "text-blue-light",
  amber: "text-amber-dark",
  teal: "text-teal",
  purple: "text-purple-dark",
  cyan: "text-cyan",
} as const;

const ACCENT_BORDER = {
  blue: "border-t-blue",
  amber: "border-t-amber",
  teal: "border-t-teal",
  purple: "border-t-purple",
  cyan: "border-t-cyan",
} as const;

export function PortfolioTiles({ cards }: { cards: PortfolioCard[] }) {
  return (
    <StaggerGroup
      as="div"
      itemSelector="[data-stagger-item]"
      className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {cards.map((card, i) => (
        <Link
          key={`${card.categoryLabel}-${i}`}
          href={card.href || "#"}
          data-stagger-item
          data-cursor-interactive
          aria-label={`View all ${card.categoryLabel} projects`}
          className={cn(
            "group relative block overflow-hidden rounded-lg border border-border border-t-[3px] bg-card px-6 py-6 transition-all duration-300 hover:-translate-y-1 hover:border-teal/30 hover:shadow-[0_16px_36px_rgba(0,0,0,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/60 focus-visible:ring-offset-2 focus-visible:ring-offset-navy2",
            ACCENT_BORDER[card.accent],
          )}
        >
          {card.image ? (
            <div className="pointer-events-none absolute inset-0 opacity-15 transition-opacity duration-500 group-hover:opacity-25">
              <Image
                src={card.image}
                alt=""
                fill
                sizes="400px"
                className="object-cover object-center"
                loading="lazy"
                decoding="async"
              />
            </div>
          ) : null}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card via-card/85 to-card/60"
          />

          <div className="relative z-10">
            <div className="mb-1 text-[11px] font-bold uppercase tracking-[1.5px] text-muted">
              {card.categoryLabel}
            </div>
            <div className={cn("mb-4 font-display text-3xl font-extrabold", ACCENT_TEXT[card.accent])}>
              {card.count} <span className="text-base font-semibold text-muted">{card.countSuffix}</span>
            </div>
            {card.title ? (
              <div className="border-t border-border/80 pt-3">
                <div className="mb-1 text-[10px] font-bold uppercase tracking-[1.5px] text-muted">
                  {card.highlightLabel}
                </div>
                <div className="text-sm font-semibold text-white">{card.title}</div>
                {card.metric && <div className="mt-0.5 text-[13px] text-muted">{card.metric}</div>}
              </div>
            ) : (
              <div className="border-t border-border/80 pt-3 text-[13px] text-muted">
                Value details available on request
              </div>
            )}
          </div>
        </Link>
      ))}
    </StaggerGroup>
  );
}
