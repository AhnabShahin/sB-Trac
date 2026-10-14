"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { STRENGTH_AREAS, STRENGTH_VALUES } from "@/data/strength-cloud";
import { CLOUD_GLYPH_PATHS, CLOUD_WORDS } from "@/data/strength-cloud-words";
import { BTRAC_MARK_PATH } from "@/data/strength-cloud-mark";
import {
  CoinsIcon,
  FactoryIcon,
  TargetIcon,
  TruckIcon,
} from "@/components/ui/icons";

registerGsap();

/** Icon per capability area, keyed to match `STRENGTH_AREAS`. */
const AREA_ICONS = {
  target: TargetIcon,
  coins: CoinsIcon,
  factory: FactoryIcon,
  truck: TruckIcon,
} as const;

/** The design's own coordinates: the PDF artboard is 1000 x 1000. */
const ARTBOARD = 1000;

/** How far outside its edge a word starts before flying into place. */
const EDGE_TRAVEL = 300;

/** The centre of the B-Trac monogram, used to order the focus beat's sweep. */
const MARK_CENTER = { x: 499, y: 500 };

/**
 * Scroll smoothing, in seconds, before the timeline catches the scroll.
 *
 * GSAP's numeric `scrub` is how long the animation takes to ease toward wherever
 * the scroll actually is, so it trades responsiveness for steadiness. This was 0.6,
 * which tracked the wheel closely enough that fast flicks and trackpad flings
 * arrived as visible jolts: the cloud would lurch forward, then take several
 * frames to settle, then lurch again on the next flick.
 *
 * 1.0 lets the build fall a little behind the scroll instead of chasing it, which
 * is what makes it read as one continuous motion rather than a series of starts
 * and stops. The cost is up to ~1s of lag between the wheel and the artwork at the
 * moment a fling ends, which is the usual and acceptable trade for a decorative
 * scroll-scrubbed section.
 */
const SCRUB = 1;

/**
 * The accent the artwork's yellow words are repainted in.
 *
 * The approved PDF set "Our Strength" and its accent words in yellow, which is
 * not a colour this site uses anywhere else. `teal` is the established accent,
 * but at #0a9e88 it is a mid-tone that sinks into the navy artboard, so the
 * artwork takes the lighter `--color-teal-light` tint instead — the same
 * relationship `blue` / `blue-light` already has. The hex is spelled out here
 * because SVG `fill` cannot read a CSS custom property from a data file.
 */
const CLOUD_ACCENT = "#3ad3b2";

/** The two yellows the PDF drew with, which both stand in for "the accent". */
const SOURCE_ACCENTS = new Set(["#fff000", "#fbec1e"]);

/**
 * Swaps the design's yellow for the theme accent, leaving the grey/white value
 * words untouched. The cloud data is generated from the PDF, so the
 * substitution happens here rather than by editing the extraction.
 */
function fillFor(source: string) {
  return SOURCE_ACCENTS.has(source.toLowerCase()) ? CLOUD_ACCENT : source;
}

type Edge = "left" | "right" | "top" | "bottom";

/**
 * The edge a word flies in from, and how far outside it the word starts.
 *
 * Every word enters from whichever edge it sits closest to, so the cloud
 * assembles inwards from all four sides at once rather than sweeping in from a
 * single direction. The distance to that edge also sets the word's place in the
 * arrival order, which keeps the build reading as one wave.
 */
function entranceFor(cx: number, cy: number) {
  const sides: [Edge, number][] = [
    ["left", cx],
    ["right", ARTBOARD - cx],
    ["top", cy],
    ["bottom", ARTBOARD - cy],
  ];

  let edge: Edge = "left";
  let dist = Number.POSITIVE_INFINITY;
  for (const [name, d] of sides) {
    if (d < dist) {
      dist = d;
      edge = name;
    }
  }

  const travel = {
    left: { x: -EDGE_TRAVEL, y: 0 },
    right: { x: EDGE_TRAVEL, y: 0 },
    top: { x: 0, y: -EDGE_TRAVEL },
    bottom: { x: 0, y: EDGE_TRAVEL },
  }[edge];

  /* A slight cross-tilt on the way in, so each word swings into place rather
     than sliding in flat. Flattened onto a single axis to stay one rotation;
     horizontal entries get less of it than vertical ones. */
  const spin = (travel.y / EDGE_TRAVEL) * 10 - (travel.x / EDGE_TRAVEL) * 6;

  return { edge, dist, x: travel.x, y: travel.y, spin };
}

/**
 * "Our Strength" word-cloud section, rebuilt in code from
 * `Asset/stregthg section.pdf`.
 *
 * The design is the PDF's square artboard: the large grey words trace the
 * B-T-R-A-C letterforms, packed with white/grey value-words and yellow accents,
 * with "Our Strength" in yellow across the lower third. The yellow is the
 * source PDF's own accent; the section repaints those words in the site's
 * theme accent instead (see `CLOUD_ACCENT` below), which happens on render
 * rather than in the data.
 *
 * The cloud is not an image. The PDF outlines every letter to a vector path, so
 * the artwork ships as 44 reusable outlines plus a placement for each of the
 * 1172 instances, and each word is its own <g>. That is what makes a
 * word-by-word entrance possible: on scroll the words fly in from all four edges
 * in a single outside-in wave and settle on their exact original positions, so
 * the finished frame is the approved design rather than an approximation of it.
 *
 * Layout puts the cloud on the left and a content column on the right. The section
 * does not pin: it used to hold the viewport still on desktop while the words
 * assembled, but it now scrolls straight through and the cloud scrubs as it passes,
 * so nothing on the page locks while you scroll. After the words assemble, the cloud
 * dims from the outside in so only the ones inside the B-Trac monogram stay lit (the
 * "melt into the favicon" beat), then resolves back from the inside out to the full
 * design. The highlight is a second pass over the
 * same outlines under an SVG mask of the monogram, so the section ships no raster
 * artwork at all -- and it fades out completely at the end of the beat, because
 * leaving it resting at a low opacity parked a permanent glow over the artwork
 * once the words had settled.
 */
export function StrengthCloudSection() {
  const rootRef = useRef<HTMLElement>(null);
  const cloudRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const cloud = cloudRef.current;
      if (!cloud) return;

      const prefersReduced =
        reducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const groups = Array.from(cloud.querySelectorAll<SVGGElement>("[data-cloud-word]"));
      const mark = cloud.querySelector<SVGGElement>("[data-cloud-mark]");

      if (prefersReduced) {
        // No motion: the approved design is simply shown as it stands. The
        // highlight is left switched off, so nothing glows over the artwork.
        gsap.set(groups, { clearProps: "all", opacity: 1 });
        if (mark) gsap.set(mark, { clearProps: "all", opacity: 0 });
        return;
      }

      // Decide where each word comes from, then order the words by how close they
      // start to their edge, so the cloud builds inwards from the border.
      const plan = groups.map((el, i) => {
        const word = CLOUD_WORDS[i];
        // Rotating about the word's own centre keeps the scale-in from drifting.
        gsap.set(el, { svgOrigin: `${word.cx} ${word.cy}` });
        return {
          el,
          cx: word.cx,
          cy: word.cy,
          radius: Math.hypot(word.cx - MARK_CENTER.x, word.cy - MARK_CENTER.y),
          ...entranceFor(word.cx, word.cy),
        };
      });
      plan.sort((a, b) => a.dist - b.dist);

      // The same words ordered from the outside in, which is the order the
      // focus beat dims them: the cloud falls away towards the logo instead of
      // the whole thing going dark at once.
      const outerFirst = [...plan].sort((a, b) => b.radius - a.radius);
      const innerFirst = [...outerFirst].reverse();



      // The beats themselves, built into whichever ScrollTrigger the current
      // width calls for. Only the scroll mapping around the animation changes;
      // what plays is identical everywhere.
      const build = (vars: ScrollTrigger.Vars) => {
        const tl = gsap.timeline({
          scrollTrigger: { scrub: SCRUB, ...vars },
        });

        const fly = 0.5;
        const stagger = 0.009;
        // Per-word offset for the focus beat, small enough that the 155 words
        // overlap into a sweep rather than firing as a block.
        const sweep = 0.0016;

        // 1. The words arrive. Each starts off whichever edge it is nearest to,
        //    swings into place and lands on its exact position, so the settled
        //    frame is the real design.
        //
        //    This used to ease `back.out(1.15)`, an overshoot: each word travelled
        //    past its target and sprang back. With ~155 words and a stagger of 0.009
        //    against a 0.5 duration, roughly 55 of them are mid-flight at any
        //    instant, so at any scroll position a large share of the cloud was
        //    simultaneously overshooting and being pulled back. Scrubbing through
        //    that reads as jitter rather than as motion.
        //
        //    `power3.out` decelerates into the target instead. The stagger still
        //    carries the wave, but no word now corrects itself mid-flight, so the
        //    whole cloud settles cleanly rather than twitching on the way.
        tl.fromTo(
          plan.map((p) => p.el),
          {
            // resolved per word, so each one leaves from its own side
            x: (i: number) => plan[i].x,
            y: (i: number) => plan[i].y,
            rotation: (i: number) => plan[i].spin,
            opacity: 0,
            scale: 0.86,
          },
          {
            x: 0,
            y: 0,
            rotation: 0,
            opacity: 1,
            scale: 1,
            ease: "power3.out",
            duration: fly,
            stagger: { each: stagger },
          },
          0
        );

        // 2. The "melt into the favicon" beat. It waits until the last word has
        //    actually landed -- starting it earlier fights the tail of the wave.
        const dim = plan.length * stagger + fly + 0.08;
        const beat = 0.34;

        tl.to(
          outerFirst.map((p) => p.el),
          {
            opacity: 0.14,
            ease: "power2.in",
            duration: beat,
            stagger: { each: sweep },
          },
          dim
        ).fromTo(
          mark,
          { opacity: 0, scale: 0.94 },
          { opacity: 1, scale: 1, ease: "power2.inOut", duration: beat },
          dim
        );

        // 3. Resolve. The design returns from the inside out, mirroring the dim,
        //    and the highlight leaves completely -- it used to rest at 0.22,
        //    which parked a permanent glow over the monogram once the words had
        //    settled.
        const resolve = dim + beat;
        tl.to(
          innerFirst.map((p) => p.el),
          {
            opacity: 1,
            ease: "power2.out",
            duration: 0.42,
            stagger: { each: sweep },
          },
          resolve
        ).to(mark, { opacity: 0, ease: "power2.in", duration: 0.42 }, resolve);

        return tl;
      };

      /* One trigger for every width, and it does not pin.
         This used to pin the section on desktop (`pin: true` + `PINNED_SCROLL`),
         which held the viewport still for ~1100px of scroll while the words
         assembled. Pinning is gone: the page now scrolls straight through the
         section, and the cloud scrubs as it passes instead of locking the screen.

         What is left is what the mobile branch always did, applied at every width:
         the cloud builds once the section is properly on screen and has finished by
         the time it leaves the top. `trigger: rootRef.current` rather than the cloud,
         so the whole section -- artwork and content column together -- governs the
         range. With only one branch left there is nothing to switch on, so
         `matchMedia` is gone and the ScrollTrigger is created directly; it still
         returns a teardown, so `useGSAP`'s `gsap.context` kills it on unmount.

         (`PinnedSidebar` still pins elsewhere on the site, and for the underlying
         reason pinning was needed here: Lenis scrolls a transformed container, so
         CSS `position: sticky` does not track. This section simply no longer needs
         to stay put.) */
      const tl = build({
        trigger: rootRef.current,
        // When the cloud's build starts and finishes.
        //
        // `start: "top 82%"` originally fired when a thin 18% sliver of the
        // section had just appeared at the bottom, so the 155-word entrance played
        // out mostly below the fold. That was moved to "top 60%", and now again to
        // "top 45%": the section's top edge reaching 45% down the viewport means the
        // cloud and the "Our Strength" column are both clearly on screen before
        // the first word moves, rather than the build already being a third done
        // by the time it is comfortably in view.
        //
        // `end` tracks `start` so the scroll distance stays constant. It was
        // "top 18%", then "top -20%", and is now "top -35%". Every move kept the
        // range at roughly 80% of a viewport: dropping `start` without also moving
        // `end` would squeeze a long timeline into a short scroll and scrub through
        // it far too fast, which would undo the smoothing above.
        start: "top 45%",
        end: "top -35%",
      });

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: rootRef, dependencies: [reducedMotion] }
  );


  return (
    <section
      ref={rootRef}
      aria-labelledby="strength-cloud-heading"
      // `lg:min-h-screen` used to sit here to give the pinned section a full screen
      // of height to sit in. Nothing pins now, so the section takes its natural
      // height and the page scrolls straight through it.
      className="relative overflow-hidden bg-navy px-6 py-16 sm:px-12 lg:flex lg:items-center lg:px-20"
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* ---- Left: the word-cloud design ---- */}
        <div className="order-2 lg:order-1">
          {/* Square canvas, matching the PDF's 1000x1000 artboard.
              The `lg:h-[min(calc(100dvh-8rem),620px)] lg:w-auto lg:max-w-none` sizing
              that used to sit here existed only so the section, which pinned
              full-screen, could never grow taller than the screen and crop the
              artboard. Nothing pins here any more, so that clamp is gone and the
              canvas resolves to `max-w-[620px]` at every width. */}
          <div
            ref={cloudRef}
            // Promoted to its own compositor layer. The cloud is ~155 <g> groups
            // whose transforms and opacities GSAP rewrites on every frame of the
            // scrubbed timeline; without its own layer each of those rewrites
            // invalidates the whole artboard's raster.
            className="relative mx-auto aspect-square w-full max-w-[620px] will-change-transform"
          >
            {/* The cloud itself, as code. Each unique letter outline is defined
                once and reused by <use>, and every word is its own <g>, so the
                entrance can move the words one at a time while the settled
                artwork stays exactly the approved design. Decorative: the real
                values are listed as text further down. */}
            <svg
              viewBox={`0 0 ${ARTBOARD} ${ARTBOARD}`}
              className="block h-full w-full select-none"
              aria-hidden="true"
              focusable="false"
              shapeRendering="geometricPrecision"
            >
              <defs>
                {CLOUD_GLYPH_PATHS.map((d, i) => (
                  <path key={i} id={`cloud-glyph-${i}`} d={d} />
                ))}
                {/* The B-Trac monogram, as a mask. White reveals, black hides, so
                    the same outlines that draw the cloud also decide which of
                    them stay lit. It used to be a 1200px mask-image; traced to a
                    path, it scales and costs less, and the section ends up with
                    no bitmap in it at all. */}
                <mask
                  id="btrac-mark-mask"
                  maskUnits="userSpaceOnUse"
                  x={0}
                  y={0}
                  width={ARTBOARD}
                  height={ARTBOARD}
                >
                  <rect width={ARTBOARD} height={ARTBOARD} fill="black" />
                  <path d={BTRAC_MARK_PATH} fill="white" />
                </mask>
              </defs>
              {CLOUD_WORDS.map((word, i) => (
                <g key={i} data-cloud-word={i} fill={fillFor(word.fill)}>
                  {word.glyphs.map(([glyph, x, y, scale], j) => (
                    <use
                      key={j}
                      href={`#cloud-glyph-${glyph}`}
                      transform={`translate(${x} ${y}) scale(${scale})`}
                    />
                  ))}
                </g>
              ))}

              {/* The monogram the words resolve into: a second pass over the same
                  outlines, masked down to the mark. As the surrounding cloud dims
                  and this comes up, only the words inside the logo stay lit, so
                  it reads as if they melted into it. */}
              <g
                data-cloud-mark
                mask="url(#btrac-mark-mask)"
                opacity={0}
                style={{
                  // Blur cost scales with the square of the radius, and this group
                  // covers the whole artboard, so the 30px drop-shadow it used to
                  // carry meant re-blurring a full-canvas layer on every frame of the
                  // scrubbed timeline. At 30px that was the single most
                  // expensive thing on the homepage and it showed up as stutter
                  // while scrolling. 3px is a tenth of the radius and roughly a
                  // hundredth of the work, and still reads as a rim of light.
                  filter:
                    "brightness(1.3) saturate(1.15) drop-shadow(0 0 3px rgba(58,211,178,0.55))",
                }}
              >
                {CLOUD_WORDS.map((word, i) => (
                  <g key={i} fill={fillFor(word.fill)}>
                    {word.glyphs.map(([glyph, x, y, scale], j) => (
                      <use
                        key={j}
                        href={`#cloud-glyph-${glyph}`}
                        transform={`translate(${x} ${y}) scale(${scale})`}
                      />
                    ))}
                  </g>
                ))}
              </g>
            </svg>
          </div>
        </div>


        {/* ---- Right: the content column ---- */}
        <div className="order-1 lg:order-2">
          <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-teal-light">
            Operational Excellence
          </div>
          <h2
            id="strength-cloud-heading"
            className="font-display text-[clamp(30px,3.4vw,44px)] font-extrabold leading-[1.1] text-white"
          >
            Our Strength
          </h2>
          <p className="mt-4 max-w-lg text-base leading-[1.7] text-muted">
            Four pillars of operational capability that enable BTEL to deliver
            complex, large-scale engineering projects with precision.
          </p>
          {/* The capability areas the values above are delivered through. */}
          <ul className="mt-7 space-y-2.5">
            {STRENGTH_AREAS.map((area) => {
              const Icon = AREA_ICONS[area.icon];
              return (
                <li
                  key={area.title}
                  data-cursor-interactive
                  className="group flex gap-4 rounded-lg border border-border bg-card px-5 py-4 transition-all duration-300 hover:-translate-y-1 hover:border-teal/30 hover:shadow-[0_12px_32px_rgba(10,158,136,0.12)]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-teal/[0.1] text-teal transition-all duration-300 group-hover:scale-110 group-hover:bg-teal group-hover:text-navy">
                    <Icon width={20} height={20} />
                  </div>
                  <div>
                    <h3 className="mb-1.5 font-display text-[15px] font-bold text-white">
                      {area.title}
                    </h3>
                    <p className="text-[13px] leading-[1.65] text-muted">
                      {area.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* The same values as a flat list for screen readers, so the artwork (which
          is decorative) never hides the content. */}
      <ul className="sr-only">
        {STRENGTH_VALUES.map((value) => (
          <li key={value}>{value}</li>
        ))}
      </ul>
    </section>
  );
}
