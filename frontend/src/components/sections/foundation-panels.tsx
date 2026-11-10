"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import { TargetIcon, LightbulbIcon, ShieldIcon, HandshakeIcon } from "@/components/ui/icons";
import type { Pillar, PillarAccent } from "@/data/content-types";

const AUTOPLAY_MS = 6000;

const ACCENT: Record<PillarAccent, { text: string; ring: string; glow: string; chip: string }> = {
  teal: { text: "text-teal", ring: "border-teal/35", glow: "rgba(10,158,136,0.45)", chip: "bg-teal/12" },
  blue: { text: "text-blue-light", ring: "border-blue-light/35", glow: "rgba(159,185,252,0.4)", chip: "bg-blue-light/12" },
  amber: { text: "text-amber", ring: "border-amber/35", glow: "rgba(224,138,0,0.4)", chip: "bg-amber/12" },
};

const ICONS = [TargetIcon, LightbulbIcon, ShieldIcon] as const;

// Map a pillar to an icon by its name, falling back to position so the carousel
// still shows a sensible glyph if the copy is edited in the admin.
function pillarIcon(title: string, index: number) {
  const t = title.toLowerCase();
  if (t.includes("vision")) return TargetIcon;
  if (t.includes("mission")) return LightbulbIcon;
  if (t.includes("value")) return ShieldIcon;
  if (t.includes("people") || t.includes("partner")) return HandshakeIcon;
  return ICONS[index % ICONS.length];
}

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [width, setWidth] = useState(0);

  const n = pillars.length;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => setWidth(entries[0].contentRect.width));
    ro.observe(el);
    setWidth(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  const go = useCallback((dir: number) => setActive((a) => (a + dir + n) % n), [n]);

  useEffect(() => {
    if (reducedMotion || paused || n <= 1) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % n), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [reducedMotion, paused, n]);

  if (n === 0) return null;

  const activePillar = pillars[Math.min(active, n - 1)];
  const activeAccent = ACCENT[activePillar.accent] ?? ACCENT.teal;

  const cardW = Math.min(width * 0.84, 460) || 440;
  const spacing = Math.min(width * 0.52, 340) || 320;

  return (
    <motion.div
      initial={reducedMotion ? undefined : "hidden"}
      whileInView={reducedMotion ? undefined : "show"}
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Header — centered, with the active pillar name rendered large and swapped
          in with a blur/slide as the carousel advances. */}
      <motion.div
        className="mx-auto max-w-xl text-center"
        variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="mb-3 text-[13px] font-bold uppercase tracking-[2px] text-teal">{eyebrow}</div>
        <h2 className="font-display text-[clamp(26px,3vw,38px)] font-extrabold leading-[1.1] text-white">
          {heading}
        </h2>
      </motion.div>

      <div className="relative mt-6 flex h-[clamp(64px,10vw,128px)] items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span
            key={active}
            className={cn(
              "font-display font-extrabold uppercase leading-none tracking-[-2px] text-[clamp(52px,9vw,116px)]",
              activeAccent.text,
            )}
            initial={reducedMotion ? false : { opacity: 0, y: 40, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -40, filter: "blur(10px)" }}
            transition={{ duration: reducedMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {activePillar.title}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Coverflow carousel — center pillar in focus, neighbours scaled, blurred
          and dimmed (same motion language as the testimonials slider). */}
      <div
        ref={containerRef}
        className="relative mt-2 select-none"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        <div className="relative mx-auto h-[380px] sm:h-[340px]" style={{ maxWidth: cardW + spacing * 2 }}>
          {pillars.map((pillar, i) => {
            let rel = i - active;
            if (rel > n / 2) rel -= n;
            if (rel < -n / 2) rel += n;
            const abs = Math.abs(rel);
            const isActive = rel === 0;
            const visible = abs <= 2;
            const accent = ACCENT[pillar.accent] ?? ACCENT.teal;
            const Icon = pillarIcon(pillar.title, i);

            return (
              <motion.div
                key={pillar.title}
                className="absolute left-1/2 top-0"
                style={{ width: cardW, zIndex: 20 - abs }}
                animate={{
                  x: rel * spacing - cardW / 2,
                  scale: isActive ? 1 : Math.max(0.72, 1 - abs * 0.14),
                  opacity: visible ? (isActive ? 1 : 0.4) : 0,
                  filter: isActive ? "blur(0px)" : "blur(1.5px)",
                }}
                transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 210, damping: 26 }}
                drag={isActive ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.18}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) go(1);
                  else if (info.offset.x > 60) go(-1);
                }}
                aria-hidden={!isActive}
              >
                <button
                  type="button"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => (isActive ? null : setActive(i))}
                  className={cn(
                    "group flex h-[360px] w-full cursor-pointer flex-col rounded-2xl border p-8 text-left outline-none transition-colors sm:h-[320px] sm:p-9",
                    isActive
                      ? cn("bg-card focus-visible:border-white/50", accent.ring)
                      : "border-border bg-card/70",
                  )}
                  style={isActive ? { boxShadow: `0 28px 70px -28px ${accent.glow}` } : undefined}
                >
                  <div className="mb-6 flex items-center gap-4">
                    <span
                      className={cn(
                        "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10",
                        accent.chip,
                        accent.text,
                      )}
                    >
                      <Icon width={28} height={28} />
                    </span>
                    <span className={cn("font-display text-[22px] font-bold uppercase tracking-[2px]", accent.text)}>
                      {pillar.title}
                    </span>
                  </div>

                  {pillar.description ? (
                    <p className="text-[clamp(16px,1.5vw,20px)] font-medium leading-[1.65] text-white/90">
                      {pillar.description}
                    </p>
                  ) : null}

                  {pillar.items.length > 0 ? (
                    <ul className="grid gap-x-8 gap-y-2 text-[clamp(15px,1.3vw,17px)] leading-[1.7] text-[#CBD5E1] sm:grid-cols-2">
                      {pillar.items.map((item) => (
                        <li key={item.label} className="flex items-center gap-2.5">
                          <span className={cn("inline-block h-1.5 w-1.5 shrink-0 rounded-full", accent.text, "bg-current")} />
                          {item.label}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </button>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 flex items-center justify-center gap-5">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous pillar"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-white/80 transition-colors hover:border-teal/50 hover:text-teal"
          >
            ←
          </button>
          <div className="flex items-center gap-2">
            {pillars.map((pillar, i) => (
              <button
                key={pillar.title}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show ${pillar.title}`}
                aria-current={i === active}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  i === active ? "w-7 bg-teal" : "w-2 bg-white/25 hover:bg-white/45",
                )}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next pillar"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-white/80 transition-colors hover:border-teal/50 hover:text-teal"
          >
            →
          </button>
        </div>
      </div>
    </motion.div>
  );
}
