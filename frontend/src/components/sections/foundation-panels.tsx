"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Reveal } from "@/components/ui/reveal";
import { TargetIcon, LightbulbIcon, ShieldIcon, HandshakeIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import type { Pillar, PillarAccent } from "@/data/content-types";

registerGsap();

const ACCENT: Record<PillarAccent, { text: string; chip: string; border: string; shadow: string }> = {
  teal: {
    text: "text-teal",
    chip: "bg-teal/10",
    border: "hover:border-teal/30",
    shadow: "hover:shadow-[0_14px_32px_rgba(10,158,136,0.14)]",
  },
  blue: {
    text: "text-blue-light",
    chip: "bg-blue-light/10",
    border: "hover:border-blue-light/30",
    shadow: "hover:shadow-[0_14px_32px_rgba(159,185,252,0.14)]",
  },
  amber: {
    text: "text-amber",
    chip: "bg-amber/10",
    border: "hover:border-amber/30",
    shadow: "hover:shadow-[0_14px_32px_rgba(224,138,0,0.14)]",
  },
};

const ICONS = [TargetIcon, LightbulbIcon, ShieldIcon] as const;

// Map a pillar to an icon by its name, falling back to position so the grid
// still shows a sensible glyph if the copy is edited in the admin.
function pillarIcon(title: string, index: number) {
  const t = title.toLowerCase();
  if (t.includes("vision")) return TargetIcon;
  if (t.includes("mission")) return LightbulbIcon;
  if (t.includes("value")) return ShieldIcon;
  if (t.includes("people") || t.includes("partner")) return HandshakeIcon;
  return ICONS[index % ICONS.length];
}

export function FoundationPanels({
  eyebrow,
  heading,
  pillars,
}: {
  eyebrow: string;
  heading: string;
  pillars: Pillar[];
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const titleWrapRef = useRef<HTMLDivElement>(null);
  const titleRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const wordRefs = useRef<(HTMLSpanElement | null)[][]>([]);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const cards = cardRefs.current.filter((el): el is HTMLDivElement => Boolean(el));
      const track = trackRef.current;
      const stage = stageRef.current;
      if (reducedMotion || !track || !stage || cards.length === 0) return;

      // Same fade-up-on-scroll-into-view entrance as the rest of the site's
      // card grids (see StaggerGroup), kept inline here because the track
      // below also needs to become the pin target for the desktop slider.
      // No `clearProps` here: it would strip opacity/transform a beat after
      // the tween finishes, which can land after the pin's own onUpdate has
      // already written different values to those same properties — a race
      // that snaps the slider back to the entrance's resting state.
      gsap.fromTo(
        cards,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: track, start: "top 80%", toggleActions: "play none none none" },
        },
      );

      // Each description's words get their own quick cascade on the same
      // entrance — gives the (previously static-looking) card copy some
      // life on mobile/reduced-breakpoints, where there's no active-card
      // slider to carry that job (see the per-word reveal in onUpdate below
      // for the desktop version, tied to a card becoming active).
      const allWords = wordRefs.current.flatMap((words) => words.filter((el): el is HTMLSpanElement => Boolean(el)));
      if (allWords.length > 0) {
        gsap.fromTo(
          allWords,
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.02,
            scrollTrigger: { trigger: track, start: "top 80%", toggleActions: "play none none none" },
          },
        );
      }

      if (cards.length < 2) return;

      const titles = titleRefs.current.filter((el): el is HTMLSpanElement => Boolean(el));
      const mm = gsap.matchMedia();

      // Below 768px the cards stay a plain stacked grid (see the Tailwind
      // classes on the track/card elements) — only desktop gets the pinned,
      // step-through slider, so phones never deal with scroll-jacking.
      mm.add("(min-width: 768px)", () => {
        if (titleWrapRef.current) gsap.set(titleWrapRef.current, { visibility: "visible" });
        gsap.set(titles, { opacity: 0 });
        if (titles[0]) gsap.set(titles[0], { opacity: 1 });

        // Switch the grid into an absolute-centred stack once we know each
        // card's natural (flowed) height. Every card is then forced to that
        // same height — otherwise Vision's two-line description sits in a
        // visibly shorter box than Values' bullet list, even though they're
        // centred on the same point — so all three read as one consistent
        // card size as they swap in and out.
        const maxCardHeight = Math.max(...cards.map((card) => card.offsetHeight));
        gsap.set(track, { position: "relative", height: maxCardHeight + 24 });
        gsap.set(cards, {
          position: "absolute",
          top: "50%",
          left: "50%",
          yPercent: -50,
          width: "min(440px, 100%)",
          height: maxCardHeight,
        });

        // Cards also carry a Tailwind `transition-all` class for hover
        // states; left enabled, the browser tries to CSS-transition every
        // scrub-driven frame below, which stutters (see Reveal). Suspend it
        // for as long as the slider owns these cards.
        cards.forEach((card) => {
          card.style.transition = "none";
        });

        const last = cards.length - 1;
        // Pinned, but anchored at "center center" rather than "top top": the
        // stage locks at the viewport's vertical middle instead of snapping
        // to its very top edge, which splits the natural gap between the
        // (shorter) stage and the full viewport evenly above/below instead
        // of dumping all of it beneath the card as dead space. The scroll
        // distance is also tuned tight (0.55 viewport-heights per card, not
        // a full one) so each card gets just enough scrub to be read clearly
        // without dragging the lock out longer than it needs to be.
        const st = ScrollTrigger.create({
          trigger: stage,
          start: "center center",
          end: () => `+=${last * window.innerHeight * 0.55}`,
          pin: true,
          anticipatePin: 1,
          scrub: 0.5,
          snap: { snapTo: 1 / last, duration: 0.4, ease: "power2.inOut" },
          onUpdate: (self) => {
            const progress = self.progress * last;
            cards.forEach((card, i) => {
              const dist = i - progress;
              const abs = Math.min(Math.abs(dist), 1);
              // Ease-out the fade/scale curve (abs² inverted) instead of a
              // linear ramp, so a card arrives/leaves with a gentle settle
              // rather than a constant-speed slide.
              const eased = 1 - (1 - abs) * (1 - abs);
              gsap.set(card, {
                xPercent: -50 + dist * 108,
                scale: 1 - eased * 0.16,
                opacity: 1 - eased * 0.85,
                zIndex: 10 - Math.round(abs * 5),
              });
              card.setAttribute("aria-hidden", abs > 0.5 ? "true" : "false");

              // Word-by-word fade-up as this card becomes active: "focus"
              // ramps 0→1 while it slides into the centre, and each word's
              // own reveal window is offset along that ramp (by its index,
              // spread across `span`) so they cascade in left-to-right
              // rather than popping in together — purely a function of the
              // same scrub progress already driving the card itself, so it
              // stays perfectly in sync with no extra ScrollTrigger.
              const words = wordRefs.current[i];
              if (words && words.length > 0) {
                const focus = 1 - abs;
                const span = 0.6;
                const revealDuration = 1 - span;
                words.forEach((word, wi) => {
                  if (!word) return;
                  const delay = words.length > 1 ? (wi / (words.length - 1)) * span : 0;
                  const wordProgress = Math.min(1, Math.max(0, (focus - delay) / revealDuration));
                  gsap.set(word, { opacity: wordProgress, y: (1 - wordProgress) * 10 });
                });
              }
            });
            titles.forEach((title, i) => {
              const dist = Math.abs(i - progress);
              gsap.set(title, { opacity: Math.max(0, 1 - dist * dist * 1.6) });
            });
          },
        });

        return () => {
          st.kill();
          gsap.set(track, { clearProps: "all" });
          gsap.set(cards, { clearProps: "all" });
          cards.forEach((card) => {
            card.removeAttribute("aria-hidden");
            card.style.transition = "";
          });
          if (titleWrapRef.current) gsap.set(titleWrapRef.current, { clearProps: "all" });
          gsap.set(titles, { clearProps: "all" });
          gsap.set(allWords, { clearProps: "all" });
        };
      });

      return () => mm.revert();
    },
    { scope: stageRef, dependencies: [reducedMotion, pillars.length] },
  );

  if (pillars.length === 0) return null;

  return (
    <div>
      <Reveal className="mx-auto max-w-xl text-center">
        <div className="mb-3 text-[13px] font-bold uppercase tracking-[2px] text-teal">{eyebrow}</div>
        <h2 className="font-display text-[clamp(26px,3vw,38px)] font-extrabold leading-[1.1] text-white">
          {heading}
        </h2>
      </Reveal>

      {/* Both the giant pillar title and the card track are pinned together
          as one unit (see useGSAP above) — pinning the track alone would
          freeze it at the viewport top while the title, sitting above it in
          flow, scrolled out from under it. */}
      <div ref={stageRef} className="flow-root">
        {/* Decorative, oversized pillar title — hidden until the desktop
            slider's effect makes it visible; plain-grid / reduced-motion
            visitors never see a title stuck on "Vision" while only the
            Values card is in view. */}
        <div
          ref={titleWrapRef}
          aria-hidden="true"
          className="relative mx-auto mt-20 hidden h-[56px] max-w-5xl md:block lg:h-[72px]"
          style={{ visibility: "hidden" }}
        >
          {pillars.map((pillar, i) => (
            <span
              key={pillar.title}
              ref={(el) => {
                titleRefs.current[i] = el;
              }}
              className="absolute inset-x-0 top-0 select-none text-center font-display text-[clamp(40px,6vw,72px)] font-extrabold uppercase leading-none tracking-tight text-teal [text-shadow:0_0_50px_rgba(10,158,136,0.5)]"
            >
              {pillar.title}
            </span>
          ))}
        </div>

        <div ref={trackRef} className="mx-auto mt-6 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">
          {pillars.map((pillar, i) => {
            const accent = ACCENT[pillar.accent] ?? ACCENT.teal;
            const Icon = pillarIcon(pillar.title, i);

            return (
              <div
                key={pillar.title}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className={cn(
                  "group flex flex-col rounded-2xl border border-border bg-card px-7 py-8 transition-all duration-300 hover:-translate-y-1",
                  accent.border,
                  accent.shadow,
                )}
              >
                <div className="relative mb-4 flex h-12 items-center">
                  <div
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
                      accent.chip,
                      accent.text,
                    )}
                  >
                    <Icon width={24} height={24} />
                  </div>
                  {/* Centred on the full card width via absolute + inset-x-0,
                      independent of the icon sitting in flow on the left. */}
                  <h3 className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-display text-xl font-bold text-white">
                    {pillar.title}
                  </h3>
                </div>

                <div className="flex flex-1 flex-col justify-center">
                  {pillar.description ? (
                    <p className="text-center text-[15px] leading-[1.65] text-[#CBD5E1]">
                      {pillar.description.split(" ").map((word, wi, words) => (
                        <span
                          key={wi}
                          ref={(el) => {
                            if (!wordRefs.current[i]) wordRefs.current[i] = [];
                            wordRefs.current[i][wi] = el;
                          }}
                          className="inline-block"
                        >
                          {word}
                          {wi < words.length - 1 ? " " : ""}
                        </span>
                      ))}
                    </p>
                  ) : null}

                  {pillar.items.length > 0 ? (
                    // Column-major split: the first half of the items fill the
                    // left column top-to-bottom, the rest fill the right — not
                    // an interleaved 2-per-row grid.
                    <div
                      className="mt-5 grid grid-flow-col grid-cols-2 gap-x-6 gap-y-2 border-t border-border pt-5"
                      style={{ gridTemplateRows: `repeat(${Math.ceil(pillar.items.length / 2)}, auto)` }}
                    >
                      {pillar.items.map((item) => (
                        <div key={item.label} className="flex items-center gap-2.5 text-[14px] text-[#CBD5E1]">
                          <span className={cn("inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-current", accent.text)} />
                          {item.label}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
