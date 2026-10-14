"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Reveal } from "@/components/ui/reveal";

registerGsap();

/** Height of the fixed header, which page content otherwise slides under. */
const HEADER_H = 64;

export function IsoBandSection() {
  const ref = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion || !contentRef.current) return;
      // The strength-cloud section below pins full-screen, so this band is the
      // last thing scrolling out before the viewport is all artwork. Left alone
      // it slid under the fixed header and got sliced mid-sentence, with the
      // badge cut in half.
      //
      // Only the content fades, never the section itself: the band sits in
      // normal flow over the page's white body background, so fading its navy
      // panel too let that white through as a pale grey block. The panel stays
      // opaque and simply becomes an empty navy2 slab -- the same colour as
      // the PrincipleSection above it, so it slides under the header unseen.
      gsap.fromTo(
        contentRef.current,
        { autoAlpha: 1 },
        {
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            // Keyed to the band's bottom edge, not its top: the band is 210px
            // tall, so it is its bottom that slides under the header last. Fade
            // from while the whole band still reads, to the moment that edge has
            // tucked fully behind the header.
            start: `bottom ${HEADER_H + 256}px`,
            end: `bottom ${HEADER_H}px`,
            scrub: true,
          },
        }
      );
    },
    { scope: ref, dependencies: [reducedMotion] }
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
            ISO <span className="text-teal">9001:2015</span> Certified
          </h2>
          <p className="mt-1.5 max-w-xl text-sm leading-[1.7] text-muted">
            BTEL holds ISO 9001:2015 certification — confirming our quality
            management systems meet the highest international standards
            across all engineering divisions.
          </p>
        </Reveal>

        <Reveal delay={0.12} y={24} className="shrink-0">
          <Image
            src="/assets/badges/iso-certificate.png"
            alt="BTEL ISO 9001:2015 certified company seal"
            width={512}
            height={512}
            sizes="128px"
            className="h-24 w-24 object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)] transition-transform duration-300 motion-safe:hover:scale-[1.04] sm:h-28 sm:w-28 lg:h-32 lg:w-32"
            loading="lazy"
            decoding="async"
          />
        </Reveal>
      </div>
    </section>
  );
}

