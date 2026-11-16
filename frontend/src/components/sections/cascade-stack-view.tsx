"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Reveal } from "@/components/ui/reveal";
import { ChecklistIcon, ArrowUpRightIcon } from "@/components/ui/icons";
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
    <section ref={sectionRef} id="cascade" className="relative overflow-hidden bg-navy">
      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-24 pb-10 sm:px-12 lg:px-20 lg:pt-28 lg:pb-14">
        <Reveal>
          <div className="mb-3 text-[13px] font-bold uppercase tracking-[2px] text-teal">
            {content.eyebrow}
          </div>
          <h2 className="max-w-[640px] font-display text-[clamp(30px,3.4vw,42px)] font-extrabold leading-[1.1] text-white">
            {content.heading}
          </h2>
          <p className="mt-4 max-w-xl text-base leading-[1.7] text-slate-300">
            {content.intro}
          </p>
        </Reveal>
      </div>

      <div className="relative">
        {content.slides.map((slide, i) => (
          <CascadeSlide
            key={`${slide.index}-${slide.title}`}
            slide={slide}
            eager={i === 0}
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
  panelRef,
}: {
  slide: CascadeSlideContent;
  eager: boolean;
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
    <div ref={panelRef} className="relative bg-navy2 lg:mb-10 lg:h-[600px]">
      <div className="mx-auto lg:grid lg:h-full lg:max-w-[1440px] lg:grid-cols-[1fr_1.15fr] lg:items-center">
        <div className="relative z-10 flex flex-col justify-center gap-4 px-6 py-16 sm:px-12 lg:px-20 lg:py-10">
          <Reveal start="top 88%">
            <div className="mb-1 flex items-center gap-4">
              <span className="font-display text-sm font-bold tracking-[2px] text-teal">
                {slide.index}
              </span>
              <span className="h-px w-full max-w-[60px] bg-teal/40" />
            </div>

            <h3 className="mb-5 max-w-xl font-display text-[clamp(24px,2.6vw,34px)] font-extrabold leading-[1.15] text-white">
              {slide.title}
            </h3>

            <div className="relative max-w-xl">
              <div ref={textRef} className="max-h-[260px] overflow-hidden lg:max-h-[200px]">
                {slide.lead ? (
                  <p className="mb-5 text-lg font-semibold leading-[1.5] text-teal-light">
                    {slide.lead}
                  </p>
                ) : null}

                {slide.description ? (
                  <p className="text-base leading-[1.8] text-slate-300">{slide.description}</p>
                ) : null}

                {slide.items?.length ? (
                  <ul className="mt-2 grid gap-3 sm:grid-cols-2">
                    {slide.items.map((item, j) => (
                      <li
                        key={j}
                        className={cn(
                          "flex items-start gap-3",
                          slide.itemsVariant === "stats" &&
                            "rounded-xl border border-teal/15 bg-white/[0.03] px-4 py-3.5",
                        )}
                      >
                        <ChecklistIcon width={18} height={18} className="mt-0.5 shrink-0 text-teal" />
                        <span className="text-[15px] leading-[1.6] text-slate-200">
                          {item.title ? (
                            <strong className="font-semibold text-white">{item.title}: </strong>
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
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-navy2 to-transparent"
                />
              ) : null}
            </div>

            {clamped ? (
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                data-cursor-interactive
                className="group mt-5 inline-flex w-fit items-center gap-2 rounded-[4px] border border-teal/40 px-6 py-3 text-sm font-medium text-teal-light transition-all hover:border-teal hover:bg-teal/10"
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

        <div className="relative h-64 sm:h-80 lg:h-[460px]">
          {slide.image ? (
            <Image
              src={slide.image}
              alt=""
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover"
              loading={eager ? "eager" : "lazy"}
            />
          ) : (
            <div className="h-full w-full bg-navy3" />
          )}
        </div>
      </div>

      <CascadeDetailModal slide={modalOpen ? slide : null} onClose={() => setModalOpen(false)} />
    </div>
  );
}
