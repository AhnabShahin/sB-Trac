"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
// Smaller hub => thicker ring band, giving the curved labels room between the arcs.
const R_IN = 90;
const R_MID = (R_OUT + R_IN) / 2;
const GAP = 2.2;

// Concentric radii the slice label is laid out on (outermost first). The icon sits
// near the outer arc, the title curves below it, the subtitle on the innermost arc.
const R_ICON = 193;
const R_TITLE = 170;
const R_SUB = 149;
// Angular spans (deg) each curved line is allowed to occupy inside its ~69.8deg wedge.
const TITLE_SPAN = 58;
const SUB_SPAN = 64;
const TITLE_FS = 13;
const SUB_FS = 8.5;

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

// Arc used as a <textPath> baseline. For slices on the bottom half (90..270deg) the
// arc is drawn in the reverse angular direction so the glyphs stay upright instead of
// hanging upside-down under the ring.
function arcPath(r: number, mid: number, spanDeg: number, flip: boolean): string {
  const half = spanDeg / 2;
  const dStart = flip ? mid + half : mid - half;
  const dEnd = flip ? mid - half : mid + half;
  const [x0, y0] = polar(r, dStart);
  const [x1, y1] = polar(r, dEnd);
  const sweep = flip ? 0 : 1;
  return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 0 ${sweep} ${x1.toFixed(2)} ${y1.toFixed(2)}`;
}

interface Slice {
  card: HeroServiceCard;
  path: string;
  mid: number;
  cxPct: number;
  cyPct: number;
  lx: number;
  ly: number;
  titleArc: string;
  subArc: string;
  iconX: number;
  iconY: number;
  titleLen?: number;
  subLen?: number;
  Icon: (typeof ICON_MAP)[keyof typeof ICON_MAP];
}

function buildSlices(cards: HeroServiceCard[]): Slice[] {
  const seg = 360 / cards.length;
  const titleAvail = R_TITLE * ((TITLE_SPAN * Math.PI) / 180);
  const subAvail = R_SUB * ((SUB_SPAN * Math.PI) / 180);
  return cards.map((card, i) => {
    const a0 = i * seg + GAP / 2;
    const a1 = (i + 1) * seg - GAP / 2;
    const mid = (a0 + a1) / 2;
    const [mx, my] = polar(R_MID, mid);
    const rad = ((mid - 90) * Math.PI) / 180;
    const lx = Math.cos(rad);
    const ly = Math.sin(rad);
    const flip = mid > 90 && mid < 270;
    const [iconX, iconY] = polar(R_ICON, mid);

    // Rough rendered width of each line; when it would overrun the arc we pin
    // textLength so the glyphs condense to fit instead of spilling into the gap.
    const titleEst = card.title.length * TITLE_FS * 0.56;
    const subEst = card.subtitle.length * SUB_FS * 0.52;

    return {
      card,
      path: sectorPath(a0, a1),
      mid,
      cxPct: (mx / (CX * 2)) * 100,
      cyPct: (my / (CY * 2)) * 100,
      lx,
      ly,
      titleArc: arcPath(R_TITLE, mid, TITLE_SPAN, flip),
      subArc: arcPath(R_SUB, mid, SUB_SPAN, flip),
      iconX,
      iconY,
      titleLen: titleEst > titleAvail * 0.98 ? titleAvail * 0.98 : undefined,
      subLen: subEst > subAvail * 0.98 ? subAvail * 0.98 : undefined,
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
            {slices.map((s, i) => (
              <g key={`arcs-${i}`}>
                <path id={`title-arc-${i}`} d={s.titleArc} fill="none" />
                <path id={`sub-arc-${i}`} d={s.subArc} fill="none" />
              </g>
            ))}
            <filter id="label-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0.5" stdDeviation="0.8" floodColor="#060b16" floodOpacity="0.9" />
            </filter>
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

          {/* Curved labels — one group per slice, laid along concentric arcs so the
              text wraps around the ring. Decorative (slices already carry the
              aria-label + the sr-only link list below), and click-through so the
              slice beneath still handles hover/open. */}
          {slices.map((s, i) => {
            const isActive = i === active;
            const Icon = s.Icon;
            return (
              <motion.g
                key={`label-${i}`}
                aria-hidden="true"
                filter="url(#label-shadow)"
                style={{
                  pointerEvents: "none",
                  transformBox: "view-box",
                  transformOrigin: `${CX}px ${CY}px`,
                }}
                initial={reducedMotion ? false : { opacity: 0 }}
                animate={{
                  opacity: 1,
                  scale: isActive ? 1.05 : 1,
                  x: isActive ? s.lx * 8 : 0,
                  y: isActive ? s.ly * 8 : 0,
                }}
                transition={
                  reducedMotion
                    ? { duration: 0 }
                    : { opacity: { duration: 0.5, delay: 0.25 + i * 0.08 }, default: { type: "spring", stiffness: 260, damping: 22 } }
                }
              >
                <Icon x={s.iconX - 9} y={s.iconY - 9} width={18} height={18} stroke="#ffffff" />
                <text
                  className="font-display"
                  fontSize={TITLE_FS}
                  fontWeight={700}
                  fill="#ffffff"
                  textAnchor="middle"
                  letterSpacing="0.2"
                >
                  <textPath href={`#title-arc-${i}`} startOffset="50%" textLength={s.titleLen} lengthAdjust="spacingAndGlyphs">
                    {s.card.title}
                  </textPath>
                </text>
                <text
                  fontSize={SUB_FS}
                  fill="#ffffff"
                  fillOpacity={isActive ? 0.95 : 0.8}
                  textAnchor="middle"
                  letterSpacing="0.1"
                >
                  <textPath href={`#sub-arc-${i}`} startOffset="50%" textLength={s.subLen} lengthAdjust="spacingAndGlyphs">
                    {s.card.subtitle}
                  </textPath>
                </text>
              </motion.g>
            );
          })}
        </svg>

        {/* Center hub — brand mark + CTA, meeting the ring's inner edge. */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <button
            type="button"
            data-cursor-interactive
            onClick={() => open(activeSlice)}
            aria-label={`Open ${activeCard.title}`}
            className="pointer-events-auto flex aspect-square w-[40%] cursor-pointer flex-col items-center justify-center gap-2 rounded-full border-2 bg-navy/85 text-center backdrop-blur-sm transition-colors"
            style={{ borderColor: `${activeCard.accent}66` }}
          >
            <Image
              src="/brand-mark.png"
              alt="B-TEL Engineering"
              width={64}
              height={64}
              // The mark is navy-on-transparent (built for a light browser tab); reverse
              // it to white so it reads on the dark hub.
              className="h-[34%] w-auto object-contain opacity-95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] [filter:brightness(0)_invert(1)]"
              priority
            />
            <span className="inline-flex items-center gap-1 text-[12px] font-bold uppercase tracking-[0.14em] text-teal">
              View <span aria-hidden="true">→</span>
            </span>
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
