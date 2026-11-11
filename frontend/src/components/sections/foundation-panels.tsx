"use client";

import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import { motion, type Variants } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import { TargetIcon, LightbulbIcon, ShieldIcon, HandshakeIcon, type IconProps } from "@/components/ui/icons";
import type { Pillar, PillarAccent } from "@/data/content-types";

const AUTOPLAY_MS = 6000;

const ACCENT: Record<PillarAccent, { text: string; ring: string; glow: string; chip: string }> = {
  teal: { text: "text-teal", ring: "border-teal/40", glow: "rgba(10,158,136,0.45)", chip: "bg-teal/12" },
  blue: { text: "text-blue-light", ring: "border-blue-light/40", glow: "rgba(159,185,252,0.4)", chip: "bg-blue-light/12" },
  amber: { text: "text-amber", ring: "border-amber/40", glow: "rgba(224,138,0,0.4)", chip: "bg-amber/12" },
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

const EASE = [0.22, 1, 0.36, 1] as const;

// Shared "lift in with a blur" reveal reused for the big title letters and the
// content inside the focused card, so the whole section speaks one language.
const RISE: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: EASE } },
};

type CardAccent = (typeof ACCENT)[PillarAccent];

function PillarBody({
  pillar,
  accent,
  Icon,
  animateIn,
}: {
  pillar: Pillar;
  accent: CardAccent;
  Icon: ComponentType<IconProps>;
  animateIn: boolean;
}) {
  return (
    <motion.div
      className="flex h-full flex-col"
      initial={animateIn ? "hidden" : false}
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: animateIn ? 0.09 : 0, delayChildren: animateIn ? 0.14 : 0 } },
      }}
    >
      <motion.span
        variants={RISE}
        className={cn(
          "mb-6 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
          accent.chip,
          accent.text,
        )}
      >
        <Icon width={28} height={28} />
      </motion.span>

      {pillar.description ? (
        <motion.p
          variants={RISE}
          className="text-[clamp(16px,1.5vw,20px)] font-medium leading-[1.6] text-white/92"
        >
          {pillar.description}
        </motion.p>
      ) : null}

      {pillar.items.length > 0 ? (
        <motion.ul
          variants={{ hidden: {}, show: { transition: { staggerChildren: animateIn ? 0.07 : 0 } } }}
          className="mt-auto grid gap-x-8 gap-y-2.5 pt-6 text-[clamp(14px,1.3vw,16px)] leading-[1.7] text-[#CBD5E1] sm:grid-cols-2"
        >
          {pillar.items.map((item) => (
            <motion.li key={item.label} variants={RISE} className="flex items-center gap-2.5">
              <span className={cn("inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-current", accent.text)} />
              {item.label}
            </motion.li>
          ))}
        </motion.ul>
      ) : null}
    </motion.div>
  );
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

  const cardW = Math.min(width * 0.82, 480) || 440;
  const spacing = Math.min(width * 0.5, 300) || 280;

  return (
    <motion.div
      initial={reducedMotion ? undefined : "hidden"}
      whileInView={reducedMotion ? undefined : "show"}
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Header — centered. The big accent word doubles as the live title and the
          only place the pillar name appears, so the card below carries no
          duplicate heading. */}
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

      <div
        className="relative mt-6 flex h-[clamp(72px,11vw,140px)] items-center justify-center overflow-hidden"
        style={{ perspective: 900 }}
      >
        {reducedMotion ? (
          <span
            className={cn(
              "font-display font-extrabold uppercase leading-none tracking-[-2px] text-[clamp(56px,10vw,128px)]",
              activeAccent.text,
            )}
          >
            {activePillar.title}
          </span>
        ) : (
          <motion.h3
            key={active}
            aria-label={activePillar.title}
            className={cn(
              "flex font-display font-extrabold uppercase leading-none tracking-[-2px] text-[clamp(56px,10vw,128px)]",
              activeAccent.text,
            )}
            style={{ transformStyle: "preserve-3d", textShadow: `0 20px 60px ${activeAccent.glow}` }}
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.045 } } }}
          >
            {activePillar.title.split("").map((ch, idx) => (
              <motion.span
                key={idx}
                aria-hidden="true"
                className="inline-block will-change-transform"
                variants={{
                  hidden: { opacity: 0, y: 60, rotateX: -75, filter: "blur(10px)" },
                  show: {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    filter: "blur(0px)",
                    transition: { duration: 0.55, ease: EASE },
                  },
                }}
              >
                {ch === " " ? " " : ch}
              </motion.span>
            ))}
          </motion.h3>
        )}
      </div>

      {/* Coverflow carousel — the focused pillar reads as a large modal panel,
          neighbours are scaled, blurred and dimmed behind it. */}
      <div
        ref={containerRef}
        className="relative mt-2 select-none"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        <div className="relative mx-auto h-[420px] sm:h-[380px]" style={{ maxWidth: cardW + spacing * 2 }}>
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
                  scale: isActive ? 1 : Math.max(0.7, 1 - abs * 0.15),
                  opacity: visible ? (isActive ? 1 : 0.35) : 0,
                  filter: isActive ? "blur(0px)" : "blur(2px)",
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
                    "group flex h-[400px] w-full cursor-pointer flex-col rounded-3xl border p-8 text-left outline-none backdrop-blur-sm transition-colors sm:h-[360px] sm:p-9",
                    isActive
                      ? cn("bg-card/95 focus-visible:border-white/50", accent.ring)
                      : "border-border bg-card/70",
                  )}
                  style={
                    isActive
                      ? { boxShadow: `0 40px 90px -30px ${accent.glow}, inset 0 1px 0 rgba(255,255,255,0.06)` }
                      : undefined
                  }
                >
                  <PillarBody
                    key={`${i}-${isActive}`}
                    pillar={pillar}
                    accent={accent}
                    Icon={Icon}
                    animateIn={isActive && !reducedMotion}
                  />
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
