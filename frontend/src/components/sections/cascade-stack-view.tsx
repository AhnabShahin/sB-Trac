"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Reveal } from "@/components/ui/reveal";
import { ChecklistIcon, ArrowUpRightIcon, ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";
import { CascadeDetailModal } from "@/components/sections/cascade-detail-modal";
import { cn } from "@/lib/utils";
import type { CascadeContent, CascadeSlideContent } from "@/data/content-types";

registerGsap();

/**
 * "Cascade" stack: each pillar pins full-screen, opaque edge-to-edge (the
 * panel's own background spans the full viewport even though its text column
 * keeps the site's usual left page gutter — see CascadeSlide), and the next
 * one slides straight up over it — once covered, the previous panel is not
 * visible at all (the reference, doummar.com's services section, does this
 * with CSS `position: sticky`; that's not usable here because Lenis scrolls a
 * transformed container, which breaks sticky tracking — see PinnedSidebar.
 * GSAP ScrollTrigger.pin does the same job and stays in sync with Lenis). No
 * recede/scale/fade on the covered panel — the handoff is a flat cut,
 * matching the reference exactly rather than adding a depth effect on top of
 * it.
 */
export function CascadeStackView({ content }: { content: CascadeContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const panels = panelRefs.current.filter((el): el is HTMLDivElement => Boolean(el));
      if (reducedMotion || panels.length < 2) return;

      const mm = gsap.matchMedia();

      // Only pin at desktop widths. Below that, panels stack as a plain
      // vertical list (see the reference's own mobile layout).
      mm.add("(min-width: 1024px)", () => {
        // Every pinned panel borrows its scroll distance from the next
        // panel's own 100vh of document flow — that's what "nothing happens
        // on screen until the covering panel has fully risen" actually is.
        // The last panel has nothing after it to be covered BY, so it does
        // not pin at all: giving it a spacer of its own (so the maths still
        // worked) just held the frame frozen for a full viewport of scroll
        // with no visible motion before the ISO band section suddenly
        // appeared, which read as the scroll "sticking". Left unpinned, it
        // simply scrolls in like ordinary content once the previous panel
        // releases it — continuous motion the whole way, same as every
        // other handoff in the stack.
        const triggers = panels.slice(0, -1).map((panel) =>
          ScrollTrigger.create({
            trigger: panel,
            start: "top top",
            end: "bottom top",
            pin: true,
            pinSpacing: false,
          }),
        );

        return () => triggers.forEach((t) => t.kill());
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  return (
    <section ref={sectionRef} id="cascade" className="relative overflow-hidden bg-white">
      <div className="relative">
        {content.slides.map((slide, i) => (
          <CascadeSlide
            key={`${slide.index}-${slide.title}`}
            slide={slide}
            eager={i === 0}
            index={i}
            total={content.slides.length}
            panelRef={(el) => {
              panelRefs.current[i] = el;
            }}
          />
        ))}
      </div>
    </section>
  );
}

function CascadeSlide({
  slide,
  eager,
  index,
  total,
  panelRef,
}: {
  slide: CascadeSlideContent;
  eager: boolean;
  index: number;
  total: number;
  panelRef: (el: HTMLDivElement | null) => void;
}) {
  const textRef = useRef<HTMLDivElement>(null);
  const [clamped, setClamped] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const check = () => setClamped(el.scrollHeight > el.clientHeight + 1);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    window.addEventListener("resize", check);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", check);
    };
  }, []);

  return (
    <div ref={panelRef} className="relative overflow-hidden bg-white lg:h-[600px]">
      {/* One blueprint image sliced across every panel (sprite-style): each panel
          shows its own horizontal band of the single image, so down the whole
          section it reads as one continuous backdrop instead of the same crop
          repeated per slide. Panels stay opaque so the pinned handoff is a clean
          cut (translucent panels ghosted the covered slide's text). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[url('/assets/cascade-blueprint-bg.jpg')] bg-no-repeat opacity-[0.12]"
        style={{
          backgroundSize: `100% ${total * 100}%`,
          backgroundPositionY: total > 1 ? `${(index / (total - 1)) * 100}%` : "center",
        }}
      />
      <div className="relative z-10 mx-auto lg:grid lg:h-full lg:max-w-[1440px] lg:grid-cols-[1fr_1.15fr] lg:items-center">
        <div className="relative z-10 flex flex-col justify-center gap-4 px-6 py-16 sm:px-12 lg:px-20 lg:py-10">
          <Reveal start="top 88%">
            <div className="mb-1 flex items-center gap-4">
              <span className="font-display text-sm font-bold tracking-[2px] text-teal-dark">
                {slide.index}
              </span>
              <span className="h-px w-full max-w-[60px] bg-teal-dark/40" />
            </div>

            <h3 className="mb-5 max-w-xl font-display text-[clamp(24px,2.6vw,34px)] font-extrabold leading-[1.15] text-[#0E2A47]">
              {slide.title}
            </h3>

            <div className="relative max-w-xl">
              <div ref={textRef} className="max-h-[260px] overflow-hidden lg:max-h-[200px]">
                {slide.lead ? (
                  <p className="mb-5 text-lg font-semibold leading-[1.5] text-teal-dark">
                    {slide.lead}
                  </p>
                ) : null}

                {slide.description ? (
                  <p className="text-base leading-[1.8] text-[#475569]">{slide.description}</p>
                ) : null}

                {slide.items?.length ? (
                  <ul className="mt-2 grid gap-3 sm:grid-cols-2">
                    {slide.items.map((item, j) => (
                      <li
                        key={j}
                        className={cn(
                          "flex items-start gap-3",
                          slide.itemsVariant === "stats" &&
                            "rounded-xl border border-teal-dark/15 bg-teal-dark/5 px-4 py-3.5",
                        )}
                      >
                        <ChecklistIcon width={18} height={18} className="mt-0.5 shrink-0 text-teal-dark" />
                        <span className="text-[15px] leading-[1.6] text-[#334155]">
                          {item.title ? (
                            <strong className="font-semibold text-[#0E2A47]">{item.title}: </strong>
                          ) : null}
                          {item.description}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>

              {clamped ? (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent"
                />
              ) : null}
            </div>

            {clamped ? (
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                data-cursor-interactive
                className="group mt-5 inline-flex w-fit items-center gap-2 rounded-[4px] border border-teal-dark/40 px-6 py-3 text-sm font-medium text-teal-dark transition-all hover:border-teal-dark hover:bg-teal-dark/10"
              >
                Learn more
                <ArrowUpRightIcon
                  width={16}
                  height={16}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </button>
            ) : null}
          </Reveal>
        </div>

        <div className="relative h-64 overflow-hidden sm:h-80 lg:h-[460px]">
          <CascadeImages
            images={slide.images?.length ? slide.images : slide.image ? [slide.image] : []}
            eager={eager}
          />
        </div>
      </div>

      <CascadeDetailModal slide={modalOpen ? slide : null} onClose={() => setModalOpen(false)} />
    </div>
  );
}

const CASCADE_SLIDE_INTERVAL = 4000;

// One slide = one image half. With a single image it's a plain fill photo; with
// several it becomes a left-to-right auto-slideshow. The track translates by
// whole viewport-widths so only transform animates (GPU), and auto-advance is
// skipped under reduced-motion (manual dots still work).
function CascadeImages({ images, eager }: { images: string[]; eager: boolean }) {
  const reducedMotion = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const dragStartX = useRef<number | null>(null);
  const multiple = images.length > 1;

  // Wrap both ways so the loop is continuous (…3 → 1, and 1 → 3 backwards).
  const go = (dir: 1 | -1) => setIdx((i) => (i + dir + images.length) % images.length);

  useEffect(() => {
    if (!multiple || reducedMotion || paused) return;
    const id = window.setInterval(() => go(1), CASCADE_SLIDE_INTERVAL);
    return () => window.clearInterval(id);
    // go() only closes over images.length, which is in the deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [multiple, reducedMotion, paused, images.length]);

  if (images.length === 0) return <div className="h-full w-full bg-[#E2E8F0]" />;

  if (!multiple) {
    return (
      <Image
        src={images[0]}
        alt=""
        fill
        sizes="(min-width: 1024px) 55vw, 100vw"
        className="object-cover"
        loading={eager ? "eager" : "lazy"}
      />
    );
  }

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label="Slide images"
      tabIndex={0}
      className="group/slider absolute inset-0 cursor-grab touch-pan-y select-none overflow-hidden outline-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/70"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          go(-1);
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          go(1);
        }
      }}
      // Pointer events cover mouse drag AND touch swipe with one path. Skip when
      // the gesture starts on a control so arrow/dot clicks still work (pointer
      // capture would otherwise swallow their click).
      onPointerDown={(e) => {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        if ((e.target as HTMLElement).closest("button")) return;
        dragStartX.current = e.clientX;
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerUp={(e) => {
        if (dragStartX.current === null) return;
        const dx = dragStartX.current - e.clientX;
        dragStartX.current = null;
        try {
          e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {}
        if (Math.abs(dx) > 40) go(dx > 0 ? 1 : -1);
      }}
      onDragStart={(e) => e.preventDefault()}
    >
      <div
        className="flex h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
        style={{ transform: `translateX(-${idx * 100}%)` }}
      >
        {images.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="relative h-full w-full shrink-0 grow-0 basis-full"
            aria-hidden={i !== idx}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover"
              loading={eager && i === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => go(-1)}
        data-cursor-interactive
        aria-label="Previous image"
        className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white opacity-0 backdrop-blur-sm transition-all hover:bg-black/55 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 group-hover/slider:opacity-100"
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        data-cursor-interactive
        aria-label="Next image"
        className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white opacity-0 backdrop-blur-sm transition-all hover:bg-black/55 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 group-hover/slider:opacity-100"
      >
        <ChevronRightIcon className="h-5 w-5" />
      </button>

      <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIdx(i)}
            data-cursor-interactive
            aria-label={`Show image ${i + 1} of ${images.length}`}
            className={cn(
              "h-1.5 rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.4)] transition-all",
              i === idx ? "w-5 bg-white" : "w-1.5 bg-white/55 hover:bg-white/85",
            )}
          />
        ))}
      </div>
    </div>
  );
}
