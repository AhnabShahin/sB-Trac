"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { ClientTestimonialItem } from "@/data/content-types";

const AUTOPLAY_MS = 5000;

export function TestimonialsSlider({ items }: { items: ClientTestimonialItem[] }) {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [width, setWidth] = useState(0);

  const n = items.length;

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

  const cardW = Math.min(width * 0.84, 460) || 440;
  const spacing = Math.min(width * 0.52, 340) || 320;

  return (
    <div
      ref={containerRef}
      className="relative mt-16 select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="relative mx-auto h-[360px] sm:h-[320px]" style={{ maxWidth: cardW + spacing * 2 }}>
        {items.map((t, i) => {
          let rel = i - active;
          if (rel > n / 2) rel -= n;
          if (rel < -n / 2) rel += n;
          const abs = Math.abs(rel);
          const isActive = rel === 0;
          const visible = abs <= 2;

          return (
            <motion.div
              key={t.author + t.role}
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
                className={`group block w-full cursor-pointer rounded-2xl border p-8 text-left outline-none transition-colors sm:p-9 ${
                  isActive
                    ? "border-teal/35 bg-card shadow-[0_28px_70px_-28px_rgba(10,158,136,0.45)] focus-visible:border-teal"
                    : "border-border bg-card/70"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="mb-3 block font-serif text-6xl leading-none text-teal/30"
                >
                  &rdquo;
                </span>
                <p className="mb-6 text-[clamp(15px,1.5vw,18px)] leading-[1.75] text-[#C3CDDB]">
                  {t.quote}
                </p>
                <div className="font-display text-[18px] font-bold text-white">{t.author}</div>
                <div className="mt-0.5 text-[15px] text-muted">{t.role}</div>
              </button>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-center gap-5">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous testimonial"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-white/80 transition-colors hover:border-teal/50 hover:text-teal"
        >
          ←
        </button>
        <div className="flex items-center gap-2">
          {items.map((t, i) => (
            <button
              key={t.author + t.role}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show testimonial ${i + 1}`}
              aria-current={i === active}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === active ? "w-7 bg-teal" : "w-2 bg-white/25 hover:bg-white/45"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next testimonial"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-white/80 transition-colors hover:border-teal/50 hover:text-teal"
        >
          →
        </button>
      </div>
    </div>
  );
}
