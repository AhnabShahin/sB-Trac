"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Reveal } from "@/components/ui/reveal";
import type { IsoBandContent } from "@/data/content-types";

registerGsap();

/** Height of the fixed header, which page content otherwise slides under. */
const HEADER_H = 64;

export function IsoBandView({ content }: { content: IsoBandContent }) {
  const ref = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion || !contentRef.current) return;
      gsap.fromTo(
        contentRef.current,
        { autoAlpha: 1 },
        {
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: `bottom ${HEADER_H + 256}px`,
            end: `bottom ${HEADER_H}px`,
            scrub: true,
          },
        },
      );
    },
    { scope: ref, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={ref}
      className="border-y border-border bg-navy2 px-6 py-10 sm:px-12 lg:px-20"
    >
      <div
        ref={contentRef}
        className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 lg:flex-row"
      >
        <Reveal className="text-center lg:text-left">
          <h2 className="font-display text-xl font-extrabold text-white sm:text-2xl">
            {content.headingPrefix}
            <span className="text-teal">{content.headingHighlight}</span>
            {content.headingSuffix}
          </h2>
          <p className="mt-1.5 max-w-xl text-sm leading-[1.7] text-muted">
            {content.text}
          </p>
        </Reveal>

        {content.badge ? (
          <Reveal delay={0.12} y={24} className="shrink-0">
            <Image
              src={content.badge}
              alt={content.badgeAlt}
              width={512}
              height={512}
              sizes="128px"
              className="h-24 w-24 object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)] transition-transform duration-300 motion-safe:hover:scale-[1.04] sm:h-28 sm:w-28 lg:h-32 lg:w-32"
              loading="lazy"
              decoding="async"
            />
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
