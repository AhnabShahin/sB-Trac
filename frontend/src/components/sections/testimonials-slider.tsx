"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import type { ClientTestimonialItem } from "@/data/content-types";

const AUTOPLAY_MS = 5000;
const GAP = 20;
const SLIDE = { duration: 0.7, ease: [0.22, 1, 0.36, 1] } as const;

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
  const trackRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [perView, setPerView] = useState(2);
  // pos = index of the left-most visible slide in the (cloned) track.
  const [pos, setPos] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);
  // Suppresses the forward-wrap teleport while the prev button stages its jump.
  const wrapGuard = useRef(false);

  const n = items.length;

  useLayoutEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const apply = (w: number) => {
      setAnimate(false);
      setWidth(w);
      setPerView(w < 560 ? 1 : 2);
    };
    const ro = new ResizeObserver((entries) => apply(entries[0].contentRect.width));
    ro.observe(el);
    apply(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  const loops = n > perView;
  const cardW = perView > 0 ? (width - GAP * (perView - 1)) / perView : width;
  const step = cardW + GAP;

  const go = useCallback(
    (dir: 1 | -1) => {
      if (!loops) return;
      if (dir === 1) {
        setAnimate(true);
        setPos((p) => p + 1);
        return;
      }
      setPos((p) => {
        if (p > 0) {
          setAnimate(true);
          return p - 1;
        }
        // At the start: jump (no transition) onto the cloned tail, then slide one
        // step back so a backward wrap reads as a normal slide.
        wrapGuard.current = true;
        setAnimate(false);
        requestAnimationFrame(() => {
          wrapGuard.current = false;
          setAnimate(true);
          setPos(n - 1);
        });
        return n;
      });
    },
    [loops, n],
  );

  useEffect(() => {
    if (reducedMotion || paused || !loops) return;
    const id = window.setInterval(() => go(1), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [reducedMotion, paused, loops, go]);

  if (n === 0) return null;

  // Clone the first `perView` slides onto the end so a forward wrap is seamless.
  const slides = loops ? [...items, ...items.slice(0, perView)] : items;
  const cardH = perView === 1 ? 440 : 470;
  const activeDot = ((pos % n) + n) % n;

  return (
    <div
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

        {loops ? (
          <div className="flex shrink-0 items-center gap-3">
            <ArrowButton dir={-1} onClick={() => go(-1)} label="Previous testimonials" />
            <ArrowButton dir={1} onClick={() => go(1)} label="Next testimonials" />
          </div>
        ) : null}
      </div>

      {/* Viewport — fixed height reserves space (no CLS); the track slides inside. */}
      <div className="w-full overflow-hidden" style={{ height: cardH }}>
        <motion.div
          ref={trackRef}
          className="flex"
          style={{ gap: GAP, height: cardH }}
          animate={{ x: -pos * step }}
          transition={animate && !reducedMotion ? SLIDE : { duration: 0 }}
          onAnimationComplete={() => {
            if (!loops || wrapGuard.current) return;
            if (pos >= n) {
              setAnimate(false);
              setPos(pos - n);
            }
          }}
        >
          {slides.map((t, i) => {
            const visible = i >= pos && i < pos + perView;
            return (
              <article
                key={`${t.author}-${t.role}-${i}`}
                aria-hidden={!visible}
                className="relative shrink-0 overflow-hidden rounded-[20px] ring-1 ring-white/10 shadow-[0_30px_70px_-34px_rgba(10,158,136,0.45)]"
                style={{ flex: `0 0 calc((100% - ${(perView - 1) * GAP}px) / ${perView})`, height: cardH }}
              >
                {t.image ? (
                  <Image
                    src={t.image}
                    alt=""
                    fill
                    sizes="(max-width: 560px) 90vw, 46vw"
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
                      "linear-gradient(180deg, rgba(6,11,21,0.12) 0%, rgba(6,11,21,0.55) 52%, rgba(6,11,21,0.93) 100%)",
                  }}
                />

                <div className="absolute inset-x-0 bottom-0 flex flex-col p-6 sm:p-8">
                  <div className="mb-5 max-w-[520px]">
                    <span aria-hidden="true" className="mb-1 block font-serif text-5xl leading-none text-teal">
                      &ldquo;
                    </span>
                    <p className="font-serif text-[clamp(16px,1.4vw,21px)] leading-[1.6] text-white [text-shadow:0_2px_14px_rgba(0,0,0,0.6)]">
                      {t.quote}
                    </p>
                  </div>

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
        </motion.div>
      </div>

      {/* Progress dots — one per real item. */}
      {loops ? (
        <div className="mt-8 flex items-center gap-2">
          {items.map((t, i) => (
            <button
              key={`${t.author}-${t.role}-${i}`}
              type="button"
              onClick={() => {
                setAnimate(true);
                setPos(i);
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
      className="flex h-12 w-12 items-center justify-center rounded-full border border-border text-white/80 transition-colors hover:border-teal/50 hover:text-teal"
    >
      {dir === -1 ? "←" : "→"}
    </button>
  );
}
