"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import type { ClientTestimonialItem } from "@/data/content-types";

const AUTOPLAY_MS = 5000;

export function TestimonialsSlider({
  eyebrow,
  headingLine1,
  headingHighlight,
  items,
}: {
  eyebrow: string;
  headingLine1: string;
  headingHighlight: string;
  items: ClientTestimonialItem[];
}) {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [narrow, setNarrow] = useState(false);

  const n = items.length;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => setNarrow(entries[0].contentRect.width < 640));
    ro.observe(el);
    setNarrow(el.getBoundingClientRect().width < 640);
    return () => ro.disconnect();
  }, []);

  const go = useCallback((dir: number) => setActive((a) => (a + dir + n) % n), [n]);

  useEffect(() => {
    if (reducedMotion || paused || n <= 1) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % n), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [reducedMotion, paused, n]);

  if (n === 0) return null;

  const cardH = narrow ? 440 : 480;

  return (
    <div
      ref={containerRef}
      className="select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Header row — heading left, controls right. */}
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <div className="mb-3 text-[13px] font-bold uppercase tracking-[2px] text-teal">{eyebrow}</div>
          <h2 className="font-display text-[clamp(32px,4vw,52px)] font-extrabold leading-[1.05] text-white">
            {headingLine1}
            {headingHighlight ? (
              <>
                {" "}
                <span className="text-teal">{headingHighlight}</span>
              </>
            ) : null}
          </h2>
        </motion.div>

        {n > 1 ? (
          <div className="flex shrink-0 items-center gap-3">
            <ArrowButton dir={-1} onClick={() => go(-1)} label="Previous testimonial" />
            <ArrowButton dir={1} onClick={() => go(1)} label="Next testimonial" />
          </div>
        ) : null}
      </div>

      {/* Full-width strip — the active card expands, the rest stay as a slim
          photo column that only reveals the author. */}
      <div className="flex w-full items-stretch gap-4" style={{ height: cardH }}>
        {items.map((t, i) => {
          const isActive = i === active;
          return (
            <motion.div
              key={t.author + t.role + i}
              className={cn("relative min-w-0", narrow && !isActive && "hidden")}
              style={{ flexBasis: 0, height: cardH }}
              animate={{ flexGrow: isActive ? (narrow ? 1 : 3.2) : 1 }}
              transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 180, damping: 28 }}
              drag={isActive && !reducedMotion ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.14}
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
                  "group relative block h-full w-full overflow-hidden rounded-[20px] text-left outline-none ring-1 transition-[box-shadow] focus-visible:ring-2 focus-visible:ring-teal",
                  isActive
                    ? "cursor-default ring-teal/30 shadow-[0_34px_80px_-32px_rgba(10,158,136,0.5)]"
                    : "cursor-pointer ring-white/10",
                )}
              >
                {t.image ? (
                  <Image
                    src={t.image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 90vw, 55vw"
                    className={cn(
                      "object-cover object-center transition-[filter,transform] duration-500 group-hover:scale-[1.03]",
                      isActive ? "" : "scale-105 brightness-[0.5] saturate-[0.85]",
                    )}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-navy2 to-navy" />
                )}

                {/* Legibility gradient — heavier toward the bottom where text sits. */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(6,11,21,0.15) 0%, rgba(6,11,21,0.55) 55%, rgba(6,11,21,0.92) 100%)",
                  }}
                />

                <div className="absolute inset-x-0 bottom-0 flex flex-col p-6 sm:p-8">
                  <AnimatePresence initial={false}>
                    {isActive ? (
                      <motion.div
                        key="quote"
                        initial={reducedMotion ? false : { opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                        transition={{ duration: 0.4, ease: "easeOut", delay: reducedMotion ? 0 : 0.12 }}
                        className="mb-5 max-w-[520px] overflow-hidden"
                      >
                        <span aria-hidden="true" className="mb-1 block font-serif text-5xl leading-none text-teal">
                          &ldquo;
                        </span>
                        <p className="font-serif text-[clamp(17px,1.5vw,23px)] leading-[1.6] text-white [text-shadow:0_2px_14px_rgba(0,0,0,0.6)]">
                          {t.quote}
                        </p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  <div className={cn("font-display font-bold text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.7)]", isActive ? "text-[18px]" : "text-[15px]")}>
                    {t.author}
                  </div>
                  <div className={cn("mt-0.5 text-white/70 [text-shadow:0_1px_8px_rgba(0,0,0,0.7)]", isActive ? "text-[15px]" : "text-[13px]")}>
                    {t.role}
                  </div>
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Progress dots. */}
      {n > 1 ? (
        <div className="mt-8 flex items-center gap-2">
          {items.map((t, i) => (
            <button
              key={t.author + t.role + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show testimonial ${i + 1}`}
              aria-current={i === active}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === active ? "w-7 bg-teal" : "w-2 bg-white/25 hover:bg-white/45",
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ArrowButton({ dir, onClick, label }: { dir: 1 | -1; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-12 w-12 items-center justify-center rounded-full border border-border text-white/80 transition-colors hover:border-teal/50 hover:text-teal"
    >
      {dir === -1 ? "←" : "→"}
    </button>
  );
}
