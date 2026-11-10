"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import type { Pillar, PillarAccent } from "@/data/content-types";

const ACCENT: Record<PillarAccent, { text: string; bar: string; glow: string; ring: string }> = {
  teal: { text: "text-teal", bar: "bg-teal", glow: "rgba(10,158,136,0.22)", ring: "group-hover:border-teal/40" },
  blue: { text: "text-blue-light", bar: "bg-blue-light", glow: "rgba(159,185,252,0.22)", ring: "group-hover:border-blue-light/40" },
  amber: { text: "text-amber", bar: "bg-amber", glow: "rgba(224,138,0,0.22)", ring: "group-hover:border-amber/40" },
};

export function FoundationPanels({
  eyebrow,
  heading,
  pillars,
}: {
  eyebrow: string;
  heading: string;
  pillars: Pillar[];
}) {
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(0);

  return (
    <motion.div
      initial={reducedMotion ? undefined : "hidden"}
      whileInView={reducedMotion ? undefined : "show"}
      viewport={{ once: true, amount: 0.25 }}
    >
      <motion.div
        className="mb-12"
        variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="mb-3 text-[13px] font-bold uppercase tracking-[2px] text-teal">{eyebrow}</div>
        <h2 className="font-display text-[clamp(32px,3.6vw,44px)] font-extrabold leading-[1.1] text-white">
          {heading}
        </h2>
      </motion.div>

      <div className="flex flex-col gap-4 md:h-[400px] md:flex-row">
        {pillars.map((pillar, i) => {
          const isActive = i === active;
          const accent = ACCENT[pillar.accent] ?? ACCENT.teal;
          return (
            <motion.article
              key={pillar.title}
              variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 + i * 0.12 }}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              tabIndex={0}
              aria-expanded={isActive}
              style={{ flexGrow: reducedMotion ? 1 : isActive ? 2.8 : 1, boxShadow: isActive ? `0 24px 60px -24px ${accent.glow}` : "none" }}
              className={cn(
                "group relative flex min-h-[220px] cursor-pointer overflow-hidden rounded-2xl border border-border bg-card outline-none transition-colors duration-300 focus-visible:border-white/40 md:min-h-0",
                accent.ring,
              )}
            >
              {/* animated accent bar + number watermark */}
              <span className={cn("absolute inset-x-0 top-0 h-[3px] origin-left transition-transform duration-500", accent.bar, isActive ? "scale-x-100" : "scale-x-100 md:scale-x-[0.25]")} />
              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute -right-2 -top-6 font-display text-[120px] font-extrabold leading-none transition-all duration-500",
                  accent.text,
                  isActive ? "opacity-[0.10]" : "opacity-[0.05]",
                )}
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="relative flex w-full min-w-[260px] flex-col justify-between p-7 sm:p-8">
                <div>
                  <div className={cn("mb-4 font-display text-[15px] font-bold uppercase tracking-[3px]", accent.text)}>
                    {pillar.title}
                  </div>
                  <motion.div
                    animate={reducedMotion ? undefined : { scale: isActive ? 1 : 0.96 }}
                    transition={{ type: "spring", stiffness: 240, damping: 24 }}
                    style={{ transformOrigin: "left top" }}
                    className={cn(
                      "transition-opacity duration-500 max-md:opacity-100",
                      isActive ? "opacity-100" : "opacity-55 md:opacity-40",
                    )}
                  >
                    {pillar.description ? (
                      <p className="max-w-[38ch] text-[clamp(16px,1.5vw,21px)] font-medium leading-[1.6] text-white/90">
                        {pillar.description}
                      </p>
                    ) : null}
                    {pillar.items.length > 0 ? (
                      <ul className="grid gap-x-8 gap-y-1.5 text-[clamp(15px,1.3vw,18px)] leading-[1.9] text-[#CBD5E1] sm:grid-cols-2">
                        {pillar.items.map((item) => (
                          <li key={item.label} className="flex items-center gap-2">
                            <span className={cn("inline-block h-1.5 w-1.5 shrink-0 rounded-full", accent.bar)} />
                            {item.label}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </motion.div>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </motion.div>
  );
}
