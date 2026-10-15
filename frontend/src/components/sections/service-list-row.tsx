"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
  useReducedMotion as useFramerReducedMotion,
} from "motion/react";
import Link from "next/link";
import Image from "next/image";
import type { ServiceRow } from "@/data/content-types";
import { BoltIcon, SunIcon, WrenchIcon, DropletIcon, ClockIcon, ArrowRightIcon } from "@/components/ui/icons";

const ICON_MAP = {
  bolt: BoltIcon,
  sun: SunIcon,
  wrench: WrenchIcon,
  droplet: DropletIcon,
  clock: ClockIcon,
} as const;

const GLOW = "rgba(10,158,136,0.16)";

export function ServiceListRow({ service }: { service: ServiceRow }) {
  const Icon = ICON_MAP[service.icon] ?? BoltIcon;
  const rowRef = useRef<HTMLLIElement>(null);
  const reducedMotion = useFramerReducedMotion();

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const glowX = useSpring(mouseX, { stiffness: 200, damping: 30 });
  const glowY = useSpring(mouseY, { stiffness: 200, damping: 30 });
  const glowBackground = useMotionTemplate`radial-gradient(480px circle at ${glowX}00% ${glowY}00%, ${GLOW}, transparent 65%)`;

  const iconX = useSpring(0, { stiffness: 250, damping: 18 });
  const iconY = useSpring(0, { stiffness: 250, damping: 18 });

  function handleMouseMove(e: React.MouseEvent<HTMLLIElement>) {
    if (reducedMotion || !rowRef.current) return;
    const rect = rowRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    mouseX.set(px);
    mouseY.set(py);
    iconX.set((px - 0.5) * 8);
    iconY.set((py - 0.5) * 8);
  }

  function handleMouseLeave() {
    mouseX.set(0.5);
    mouseY.set(0.5);
    iconX.set(0);
    iconY.set(0);
  }

  return (
    <motion.li
      ref={rowRef}
      data-stagger-item
      data-cursor-interactive
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={reducedMotion ? undefined : { y: -4, boxShadow: "0 16px 40px rgba(0,0,0,0.25)" }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      className="group/row relative z-1 overflow-hidden bg-card transition-colors duration-300 hover:bg-white/[0.02]"
    >
      {/* Hover Image Reveal */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 ease-out group-hover/row:opacity-100"
      >
        <Image
          src={service.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 800px, 100vw"
          className="scale-110 object-cover transition-transform duration-[1200ms] ease-out group-hover/row:scale-100 motion-reduce:scale-100 motion-reduce:transition-none"
          loading="lazy"
          decoding="async"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(100deg, rgba(6,15,26,0.94) 20%, rgba(6,15,26,0.78) 55%, rgba(6,15,26,0.5) 100%)",
          }}
        />
      </div>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/row:opacity-100"
        style={{ background: glowBackground }}
      />

      <Link
        href={service.href}
        className="relative grid grid-cols-[56px_1fr_auto] items-center gap-5 px-6 py-6 no-underline sm:gap-7 sm:px-9 sm:py-8"
      >
        <motion.div
          style={{ x: iconX, y: iconY }}
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-teal/20 bg-teal/[0.12] text-teal transition-transform duration-300 group-hover/row:scale-110"
        >
          <motion.div
            initial={false}
            whileHover={reducedMotion ? undefined : { rotate: 8 }}
            transition={{ type: "spring", stiffness: 300, damping: 12 }}
          >
            <Icon width={24} height={24} />
          </motion.div>
        </motion.div>

        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-baseline gap-2 sm:gap-3">
            <span className="font-display text-[10px] font-bold tracking-[0.5px] text-muted">
              {service.index}
            </span>
            <h3 className="font-display text-lg font-extrabold leading-tight text-white transition-colors duration-300 group-hover/row:text-teal sm:text-[22px]">
              {service.title}
            </h3>
          </div>
          <p className="mb-3 max-w-[600px] text-sm leading-[1.6] text-[#94A3B8]">
            {service.description}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {service.tags.map((tag, tagIndex) => (
              <motion.span
                key={tag}
                initial={reducedMotion ? false : { opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, delay: 0.1 + tagIndex * 0.05, ease: "easeOut" }}
                className="rounded-[3px] border border-teal/15 bg-teal/[0.08] px-2 py-[3px] text-[11px] font-semibold text-teal"
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </div>

        <motion.span
          aria-hidden="true"
          whileHover={reducedMotion ? undefined : { x: 4 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="shrink-0 font-display text-xl font-bold text-teal transition-transform duration-300 group-hover/row:translate-x-1"
        >
          <ArrowRightIcon width={20} height={20} />
        </motion.span>
      </Link>
    </motion.li>
  );
}
