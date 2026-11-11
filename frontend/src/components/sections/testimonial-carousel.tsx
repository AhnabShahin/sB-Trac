"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import type { ClientTestimonialItem } from "@/data/content-types";

const GAP = 24;
const SLIDE = { duration: 0.72, ease: [0.22, 1, 0.36, 1] } as const;

// A full-bleed, peeking carousel: the focused card sits at the content gutter
// (aligned with the heading) and reveals its quote, while neighbouring cards
// stay smaller/dimmed and bleed into the page gutters — the Glide treatment.
function metricsFor(w: number) {
  const gutter = w >= 1024 ? 80 : w >= 640 ? 48 : 24;
  const cardW = w >= 1024 ? 440 : w >= 640 ? 360 : Math.max(240, w - 24 - 46);
  const cardH = w >= 1024 ? 500 : w >= 640 ? 460 : 420;
  return { gutter, cardW, cardH, step: cardW + GAP };
}

export function TestimonialCarousel({
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
  const viewportRef = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);

  const n = items.length;
  const loops = n > 1;

  // `active` is a virtual index. With looping we render three copies and keep
  // `active` inside the middle copy; a wrap just re-seats it onto the identical
  // card in an adjacent copy with no transition, so the slide reads as endless.
  const [active, setActive] = useState(loops ? n : 0);
  const [animate, setAnimate] = useState(false);

  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const apply = (width: number) => {
      setAnimate(false);
      setW(width);
    };
    const ro = new ResizeObserver((entries) => apply(entries[0].contentRect.width));
    ro.observe(el);
    apply(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  const { gutter, cardW, cardH, step } = metricsFor(w || 1024);

  const go = useCallback(
    (dir: 1 | -1) => {
      if (!loops) return;
      setAnimate(true);
      setActive((a) => a + dir);
    },
    [loops],
  );

  const settle = () => {
    if (!loops) return;
    if (active >= 2 * n) {
      setAnimate(false);
      setActive(active - n);
    } else if (active < n) {
      setAnimate(false);
      setActive(active + n);
    }
  };

  if (n === 0) return null;

  const slides = loops ? [...items, ...items, ...items] : items;
  const trackX = gutter - active * step;
  const activeDot = loops ? ((active % n) + n) % n : active;
  const ready = w > 0;

  return (
    <div className="select-none">
      {/* Heading left, controls right — the Glide header row. */}
      <div className="mb-10 flex flex-col gap-6 px-6 sm:flex-row sm:items-end sm:justify-between sm:px-12 lg:px-20">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-2xl"
        >
          {eyebrow ? (
            <div className="mb-3 text-[13px] font-bold uppercase tracking-[2px] text-teal">{eyebrow}</div>
          ) : null}
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

        {loops ? (
          <div className="flex shrink-0 items-center gap-3">
            <ArrowButton dir={-1} onClick={() => go(-1)} label="Previous testimonial" />
            <ArrowButton dir={1} onClick={() => go(1)} label="Next testimonial" />
          </div>
        ) : null}
      </div>

      {/* Full-bleed viewport — fixed height reserves space (no CLS). */}
      <div ref={viewportRef} className="w-full overflow-hidden" style={{ height: cardH }}>
        <div
          className="flex items-start will-change-transform"
          style={{
            gap: GAP,
            height: cardH,
            opacity: ready ? 1 : 0,
            transform: `translate3d(${trackX}px, 0, 0)`,
            transition: animate && !reducedMotion ? "transform 0.72s cubic-bezier(0.22, 1, 0.36, 1)" : "none",
          }}
          onTransitionEnd={(e) => {
            if (e.propertyName === "transform") settle();
          }}
        >
          {slides.map((t, i) => {
            const focused = loops ? i === active : i === activeDot;
            const isClone = loops && Math.floor(i / n) !== 1;
            return (
              <article
                key={`${t.author}-${t.role}-${i}`}
                aria-hidden={isClone || undefined}
                data-cursor-interactive={focused ? undefined : true}
                onClick={focused ? undefined : () => {
                  setAnimate(true);
                  setActive(i);
                }}
                className={cn(
                  "relative shrink-0 origin-top overflow-hidden rounded-[22px] ring-1 ring-white/10 shadow-[0_34px_80px_-40px_rgba(10,158,136,0.5)] will-change-transform",
                  focused ? "" : "cursor-pointer",
                )}
                style={{
                  flex: `0 0 ${cardW}px`,
                  height: cardH,
                  // Side cards shrink from the top edge, so their tops stay aligned
                  // with the focused card while the bottoms sit higher (Glide look).
                  transform: focused || reducedMotion ? "scale(1)" : "scale(0.86)",
                  transition: reducedMotion ? "none" : "transform 0.72s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                {t.image ? (
                  <Image
                    src={t.image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 86vw, 440px"
                    className="object-cover object-center"
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
                      "linear-gradient(180deg, rgba(6,11,21,0.10) 0%, rgba(6,11,21,0.52) 48%, rgba(6,11,21,0.94) 100%)",
                  }}
                />

                {/* Gentle dim on unfocused cards — focus hierarchy without changing size. */}
                <motion.div
                  aria-hidden="true"
                  className="absolute inset-0 bg-navy"
                  animate={{ opacity: focused || reducedMotion ? 0 : 0.24 }}
                  transition={reducedMotion ? { duration: 0 } : SLIDE}
                />

                <div className="absolute inset-x-0 bottom-0 flex flex-col p-6 sm:p-8">
                  {/* Quote reveals only on the focused card. */}
                  <motion.div
                    animate={{
                      opacity: focused ? 1 : 0,
                      y: focused ? 0 : 14,
                    }}
                    transition={reducedMotion ? { duration: 0 } : { duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    className="mb-5 max-w-[520px]"
                    aria-hidden={!focused || undefined}
                  >
                    <span aria-hidden="true" className="mb-1 block font-serif text-5xl leading-none text-teal">
                      &ldquo;
                    </span>
                    <p className="font-serif text-[clamp(16px,1.35vw,21px)] leading-[1.6] text-white [text-shadow:0_2px_14px_rgba(0,0,0,0.6)]">
                      {t.quote}
                    </p>
                  </motion.div>

                  <div className="font-display text-[18px] font-bold text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.7)]">
                    {t.author}
                  </div>
                  <div className="mt-0.5 text-[15px] text-white/70 [text-shadow:0_1px_8px_rgba(0,0,0,0.7)]">
                    {t.role}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Progress dots — one per real item. */}
      {loops ? (
        <div className="mt-8 flex items-center gap-2 px-6 sm:px-12 lg:px-20">
          {items.map((t, i) => (
            <button
              key={`${t.author}-${t.role}-${i}`}
              type="button"
              onClick={() => {
                setAnimate(true);
                setActive(n + i);
              }}
              aria-label={`Show testimonial ${i + 1}`}
              aria-current={i === activeDot}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === activeDot ? "w-7 bg-teal" : "w-2 bg-white/25 hover:bg-white/45",
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
      data-cursor-interactive
      className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-lg text-white/80 transition-colors hover:border-teal/50 hover:bg-teal/10 hover:text-teal"
    >
      {dir === -1 ? "←" : "→"}
    </button>
  );
}
