"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useMotionValue, useTransform, animate } from "motion/react";
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

// Asymmetric 3x3 mosaic tuned to the 5 standard BTEL divisions in their usual
// data order (Substation, Solar, MEP, Water Treatment, After Sales). Solar
// runs tall down the right column, Water Treatment runs tall down the left,
// and After Sales/MEP fill the middle — this is what gives the grid its
// "photo collage" shape instead of a plain uniform grid. Any other card count
// falls back to a plain responsive grid below.
const MOSAIC_AREAS = ["substation", "solar", "mep", "water", "after"] as const;
const MOSAIC_TEMPLATE = `
  "substation substation solar"
  "water after solar"
  "water mep mep"
`;

// On load, each tile flies in from its own scattered start point rather than
// fading in place. The golden-angle step decorrelates a tile's launch
// direction from its final grid position, so pieces visibly cross paths
// instead of just sliding straight in from one side.
const SCATTER_DISTANCE = 360;
const GOLDEN_ANGLE_DEG = 137.508;
const ENTRANCE_STAGGER = 0.1;
const ENTRANCE_BASE_DELAY = 0.1;

function scatterOffset(i: number) {
  const angle = (i * GOLDEN_ANGLE_DEG + 40) % 360;
  const rad = (angle * Math.PI) / 180;
  return {
    x: Math.round(Math.cos(rad) * SCATTER_DISTANCE),
    y: Math.round(Math.sin(rad) * SCATTER_DISTANCE),
    rotate: i % 2 === 0 ? -140 - i * 18 : 140 + i * 18,
  };
}

type Expanding = {
  href: string;
  accent: string;
  title: string;
  image?: string;
  x: number;
  y: number;
  radius: number;
} | null;

export function HeroServiceStack({ cards }: { cards: HeroServiceCard[] }) {
  const reducedMotion = useReducedMotion();
  const router = useRouter();
  const [expanding, setExpanding] = useState<Expanding>(null);

  // clipPath circle() isn't interpolated by the animation engine, so drive the
  // iris radius through a motion value and build the string ourselves each frame.
  const geomRef = useRef<{ x: number; y: number; radius: number } | null>(null);
  const progress = useMotionValue(0);
  const clipPath = useTransform(progress, (p) => {
    const g = geomRef.current;
    return g
      ? `circle(${(p * g.radius).toFixed(1)}px at ${g.x.toFixed(1)}px ${g.y.toFixed(1)}px)`
      : "circle(0px at 50% 50%)";
  });

  if (cards.length === 0) return null;

  const useMosaic = cards.length === 5;

  const open = (card: HeroServiceCard, rect: DOMRect) => {
    const href = card.href || "#";
    if (reducedMotion) {
      router.push(href);
      return;
    }
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const corners = [
      [0, 0],
      [window.innerWidth, 0],
      [0, window.innerHeight],
      [window.innerWidth, window.innerHeight],
    ];
    const maxDist = Math.max(...corners.map(([cx, cy]) => Math.hypot(cx - x, cy - y)));
    const radius = Math.ceil(maxDist) + 40;
    geomRef.current = { x, y, radius };
    setExpanding({ href, accent: card.accent, title: card.title, image: card.image, x, y, radius });
    progress.set(0);
    animate(progress, 1, {
      duration: 0.72,
      ease: [0.7, 0, 0.25, 1],
      onComplete: () => router.push(href),
    });
  };

  return (
    <div className="relative w-full">
      <div
        className="relative mx-auto grid aspect-square w-full max-w-[520px] gap-2"
        style={
          useMosaic
            ? { gridTemplateAreas: MOSAIC_TEMPLATE, gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "1.3fr 1fr 1.3fr" }
            : { gridTemplateColumns: "repeat(2, 1fr)", gridAutoRows: "1fr" }
        }
      >
        {cards.map((card, i) => {
          const scatter = scatterOffset(i);
          const entryDelay = ENTRANCE_BASE_DELAY + i * ENTRANCE_STAGGER;
          const Icon = ICON_MAP[card.icon] ?? BoltIcon;
          return (
            <motion.div
              key={`${card.title}-${i}`}
              style={{
                gridArea: useMosaic ? MOSAIC_AREAS[i] : undefined,
                gridColumn: !useMosaic && card.wide ? "span 2" : undefined,
              }}
              className="relative"
              initial={
                reducedMotion
                  ? false
                  : { opacity: 0, scale: 0.3, x: scatter.x, y: scatter.y, rotate: scatter.rotate }
              }
              animate={{ opacity: 1, scale: 1, x: 0, y: 0, rotate: 0 }}
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : {
                      opacity: { duration: 0.4, delay: entryDelay },
                      rotate: { duration: 0.75, delay: entryDelay, ease: [0.16, 1, 0.3, 1] },
                      default: { type: "spring", stiffness: 140, damping: 16, delay: entryDelay },
                    }
              }
              whileHover={reducedMotion ? undefined : { scale: 1.025, y: -3, transition: { type: "spring", stiffness: 300, damping: 20 } }}
              whileTap={reducedMotion ? undefined : { scale: 0.97, transition: { duration: 0.1 } }}
            >
              <Link
                href={card.href || "#"}
                data-cursor-interactive
                aria-label={`${card.title} — ${card.subtitle}`}
                onClick={(e) => {
                  if (reducedMotion) return;
                  e.preventDefault();
                  open(card, e.currentTarget.getBoundingClientRect());
                }}
                className="group relative block h-full w-full overflow-hidden rounded-lg"
              >
                {card.image ? (
                  <Image
                    src={card.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 260px, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : null}
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{ background: `linear-gradient(165deg, ${card.accent}80, ${card.accent}40 55%, rgba(6,11,21,0.32))` }}
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-black/32 via-transparent to-transparent"
                />
                <div className="relative z-10 flex h-full flex-col items-center justify-center gap-2 p-4 text-center">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
                    <Icon className="h-[18px] w-[18px]" stroke="#ffffff" />
                  </span>
                  <div>
                    <div className="font-display text-[15px] font-extrabold leading-tight text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)] sm:text-[17px]">
                      {card.title}
                    </div>
                    <div className="mt-1 text-[11.5px] leading-snug text-white/85 drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
                      {card.subtitle}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {expanding ? (
          <motion.div
            // Iris reveal from the clicked tile: the division's own image floods the
            // viewport (tinted toward its accent) so the click reads as that service's
            // image taking over, then routes to its page. Radius is driven by a motion
            // value (see clipPath above) because the engine won't tween circle() itself.
            className="pointer-events-none fixed inset-0 z-[70] overflow-hidden"
            style={{ clipPath }}
            exit={{ opacity: 0 }}
          >
            {expanding.image ? (
              <motion.div
                className="absolute inset-0"
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.9, ease: [0.7, 0, 0.25, 1] }}
              >
                <Image src={expanding.image} alt="" fill sizes="100vw" className="object-cover" priority />
              </motion.div>
            ) : null}
            <div
              className="absolute inset-0"
              style={{
                background: expanding.image
                  ? `linear-gradient(135deg, ${expanding.accent}cc, ${expanding.accent}66)`
                  : expanding.accent,
              }}
            />
            <div
              className="absolute inset-0"
              style={{ background: "radial-gradient(circle at center, transparent 28%, rgba(6,11,21,0.55) 100%)" }}
            />
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="font-display text-[clamp(28px,5vw,56px)] font-extrabold tracking-tight text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.5)]">
                {expanding.title}
              </span>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
