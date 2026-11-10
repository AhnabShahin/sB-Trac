"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { BoltIcon, SunIcon, CraneIcon, DropletIcon, WrenchIcon } from "@/components/ui/icons";
import type { HeroServiceCard } from "@/data/content-types";

const ICON_MAP = {
  bolt: BoltIcon,
  sun: SunIcon,
  crane: CraneIcon,
  droplet: DropletIcon,
  wrench: WrenchIcon,
} as const;

const CX = 220;
const CY = 220;
const R_OUT = 212;
const R_IN = 102;
const R_MID = (R_OUT + R_IN) / 2;
const GAP = 2.2;

// 0deg = 12 o'clock, clockwise — so the wheel reads like a clock/pizza.
function polar(r: number, deg: number): [number, number] {
  const a = ((deg - 90) * Math.PI) / 180;
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
}

function sectorPath(a0: number, a1: number): string {
  const [x0o, y0o] = polar(R_OUT, a0);
  const [x1o, y1o] = polar(R_OUT, a1);
  const [x1i, y1i] = polar(R_IN, a1);
  const [x0i, y0i] = polar(R_IN, a0);
  const large = a1 - a0 <= 180 ? 0 : 1;
  return `M ${x0o} ${y0o} A ${R_OUT} ${R_OUT} 0 ${large} 1 ${x1o} ${y1o} L ${x1i} ${y1i} A ${R_IN} ${R_IN} 0 ${large} 0 ${x0i} ${y0i} Z`;
}

interface Slice {
  card: HeroServiceCard;
  path: string;
  mid: number;
  cxPct: number;
  cyPct: number;
  lx: number;
  ly: number;
  Icon: (typeof ICON_MAP)[keyof typeof ICON_MAP];
}

function buildSlices(cards: HeroServiceCard[]): Slice[] {
  const seg = 360 / cards.length;
  return cards.map((card, i) => {
    const a0 = i * seg + GAP / 2;
    const a1 = (i + 1) * seg - GAP / 2;
    const mid = (a0 + a1) / 2;
    const [mx, my] = polar(R_MID, mid);
    const rad = ((mid - 90) * Math.PI) / 180;
    return {
      card,
      path: sectorPath(a0, a1),
      mid,
      cxPct: (mx / (CX * 2)) * 100,
      cyPct: (my / (CY * 2)) * 100,
      lx: Math.cos(rad),
      ly: Math.sin(rad),
      Icon: ICON_MAP[card.icon] ?? BoltIcon,
    };
  });
}

type Expanding = { href: string; accent: string; title: string; x: number; y: number; scale: number } | null;

export function HeroServiceStack({ cards }: { cards: HeroServiceCard[] }) {
  const reducedMotion = useReducedMotion();
  const router = useRouter();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [expanding, setExpanding] = useState<Expanding>(null);

  if (cards.length === 0) return null;

  const slices = buildSlices(cards);
  const activeSlice = slices[Math.min(active, slices.length - 1)];
  const activeCard = activeSlice.card;

  const open = (slice: Slice) => {
    if (reducedMotion || !wrapRef.current) {
      router.push(slice.card.href || "#");
      return;
    }
    const rect = wrapRef.current.getBoundingClientRect();
    const x = rect.left + (slice.cxPct / 100) * rect.width;
    const y = rect.top + (slice.cyPct / 100) * rect.height;
    const corners = [
      [0, 0],
      [window.innerWidth, 0],
      [0, window.innerHeight],
      [window.innerWidth, window.innerHeight],
    ];
    const maxDist = Math.max(...corners.map(([cx, cy]) => Math.hypot(cx - x, cy - y)));
    const base = 48;
    const scale = Math.ceil((2 * maxDist) / base) + 1;
    setExpanding({ href: slice.card.href || "#", accent: slice.card.accent, title: slice.card.title, x, y, scale });
  };

  return (
    <div className="relative w-full">
      <div ref={wrapRef} className="relative mx-auto aspect-square w-full max-w-[520px]">
        <svg viewBox={`0 0 ${CX * 2} ${CY * 2}`} className="absolute inset-0 h-full w-full overflow-visible">
          <defs>
            {slices.map((s, i) => (
              <radialGradient key={i} id={`slice-grad-${i}`} cx="50%" cy="50%" r="78%">
                <stop offset="0%" stopColor={s.card.accent} stopOpacity={0.3} />
                <stop offset="100%" stopColor={s.card.accent} stopOpacity={0.92} />
              </radialGradient>
            ))}
          </defs>

          <circle cx={CX} cy={CY} r={R_IN - 6} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth={1} />

          {slices.map((s, i) => {
            const isActive = i === active;
            return (
              <motion.path
                key={`${s.card.title}-${i}`}
                d={s.path}
                role="link"
                tabIndex={0}
                aria-label={`${s.card.title} — ${s.card.subtitle}`}
                data-cursor-interactive
                fill={`url(#slice-grad-${i})`}
                stroke={s.card.accent}
                strokeWidth={isActive ? 2 : 1}
                strokeOpacity={isActive ? 0.95 : 0.4}
                className="cursor-pointer outline-none focus-visible:stroke-white"
                style={{
                  transformBox: "view-box",
                  transformOrigin: `${CX}px ${CY}px`,
                  filter: isActive ? `drop-shadow(0 0 16px ${s.card.accent}bb)` : "none",
                }}
                initial={reducedMotion ? false : { opacity: 0, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  scale: isActive ? 1.055 : 1,
                  x: isActive ? s.lx * 8 : 0,
                  y: isActive ? s.ly * 8 : 0,
                  fillOpacity: isActive ? 1 : 0.8,
                }}
                transition={
                  reducedMotion
                    ? { duration: 0 }
                    : { opacity: { duration: 0.5, delay: 0.15 + i * 0.08 }, default: { type: "spring", stiffness: 260, damping: 22 } }
                }
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => open(s)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    open(s);
                  }
                }}
              />
            );
          })}
        </svg>

        {/* Icon + title per slice — HTML overlay at each centroid, clicks fall through. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {slices.map((s, i) => {
            const isActive = i === active;
            const Icon = s.Icon;
            return (
              <div
                key={i}
                className="absolute flex w-[96px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 text-center transition-transform duration-300"
                style={{
                  left: `${s.cxPct}%`,
                  top: `${s.cyPct}%`,
                  transform: `translate(-50%, -50%) translate(${isActive ? s.lx * 8 : 0}px, ${isActive ? s.ly * 8 : 0}px) scale(${isActive ? 1.08 : 1})`,
                }}
              >
                <Icon width={24} height={24} className="text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.55)]" />
                <span
                  className={`font-display text-[12.5px] font-bold leading-[1.15] drop-shadow-[0_1px_3px_rgba(0,0,0,0.65)] ${
                    isActive ? "text-white" : "text-white/85"
                  }`}
                >
                  {s.card.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Center hub — subtitle detail + CTA for the active division. */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <button
            type="button"
            data-cursor-interactive
            onClick={() => open(activeSlice)}
            aria-label={`Open ${activeCard.title}`}
            className="pointer-events-auto flex aspect-square w-[42%] cursor-pointer flex-col items-center justify-center rounded-full border border-white/12 bg-navy/75 px-4 text-center backdrop-blur-sm transition-colors hover:border-white/25"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={active}
                initial={reducedMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col items-center"
              >
                <span className="font-display text-[16px] font-bold leading-tight text-white">
                  {activeCard.title}
                </span>
                <span className="mt-1.5 max-w-[150px] text-[13px] leading-[1.4] text-slate-300">
                  {activeCard.subtitle}
                </span>
                <span className="mt-2 inline-flex items-center gap-1 text-[13px] font-bold uppercase tracking-[0.12em] text-teal">
                  View <span aria-hidden="true">→</span>
                </span>
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Progressive-enhancement / SEO: real links to every division. */}
      <ul className="sr-only">
        {cards.map((card, i) => (
          <li key={i}>
            <Link href={card.href || "#"}>{card.title}</Link>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {expanding ? (
          <motion.div className="pointer-events-none fixed inset-0 z-[70]" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              className="absolute rounded-full"
              style={{
                left: expanding.x,
                top: expanding.y,
                width: 48,
                height: 48,
                marginLeft: -24,
                marginTop: -24,
                background: expanding.accent,
              }}
              initial={{ scale: 1 }}
              animate={{ scale: expanding.scale }}
              transition={{ duration: 0.72, ease: [0.7, 0, 0.25, 1] }}
              onAnimationComplete={() => router.push(expanding.href)}
            />
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <span className="font-display text-[clamp(28px,5vw,56px)] font-extrabold tracking-tight text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.4)]">
                {expanding.title}
              </span>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
