"use client";

import { useState } from "react";
import {
  PORTFOLIO_FILTER_EVENT,
  type ProjectFilterValue,
} from "@/components/sections/project-portfolio-grid";
import { cn } from "@/lib/utils";

export interface TrackRecordCard {
  tag: string;
  accent: string;
  border: string;
  /** Portfolio filter this card jumps to. */
  filter: ProjectFilterValue;
  title: string;
  description: string;
}

/**
 * The Track Record cards above the portfolio. Each one is a button: activating it
 * filters the portfolio below to that division and scrolls to it, so the summary
 * and the evidence are the same click apart.
 *
 * The grid owns the filter state, so these dispatch an event rather than holding
 * their own — see `PORTFOLIO_FILTER_EVENT`. Local state here is only for showing
 * which card was last activated.
 */
export function TrackRecordCards({
  items,
  counts,
}: {
  items: TrackRecordCard[];
  counts: Record<string, number>;
}) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  return (
    <>
      {items.map((item) => {
        const count = counts[item.filter] ?? 0;
        return (
          <button
            key={item.title}
            type="button"
            data-stagger-item
            data-cursor-interactive
            aria-label={`Show the ${count} ${item.title} projects`}
            onClick={() => {
              setActiveTag(item.title);
              window.dispatchEvent(
                new CustomEvent<ProjectFilterValue>(PORTFOLIO_FILTER_EVENT, {
                  detail: item.filter,
                })
              );
            }}
            className={cn(
              "group relative flex flex-col rounded-[10px] border border-border border-t-[3px] bg-card px-7 py-9 text-left transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/60 focus-visible:ring-offset-2 focus-visible:ring-offset-navy",
              item.border,
              activeTag === item.title && "-translate-y-1 border-white/30 shadow-lg"
            )}
          >
            <div className={cn("mb-2 font-display text-[44px] font-extrabold leading-none", item.accent)}>
              {item.tag}
            </div>
            <h3 className="mb-2 font-display text-[17px] font-bold text-white">{item.title}</h3>
            <p className="text-[13px] leading-[1.65] text-muted">{item.description}</p>

            {/* Makes the card's purpose explicit — it is a jump to a filtered
                list, not a dead-end summary. */}
            <span className="mt-6 inline-flex items-center gap-2 text-[12px] font-semibold text-white/70 transition-colors group-hover:text-white">
              View {count} project{count !== 1 ? "s" : ""}
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </span>
          </button>
        );
      })}
    </>
  );
}