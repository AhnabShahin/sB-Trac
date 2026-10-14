"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

registerGsap();

/**
 * Pins whichever of the two columns is shorter for the scroll distance of
 * the taller one, using GSAP ScrollTrigger.pin — CSS `position: sticky`
 * does not track correctly under Lenis's transformed scroll container.
 * Which column ends up shorter can depend on content length, so this
 * measures both at mount rather than assuming `left` is always the pin
 * target.
 */
export function PinnedSidebar({
  left,
  right,
  className,
  leftClassName,
  rightClassName,
  offset = 96,
}: {
  left: ReactNode;
  right: ReactNode;
  className?: string;
  leftClassName?: string;
  rightClassName?: string;
  offset?: number;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (!rowRef.current || !leftRef.current || !rightRef.current || reducedMotion) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const leftH = leftRef.current!.offsetHeight;
        const rightH = rightRef.current!.offsetHeight;
        const pinTarget = leftH <= rightH ? leftRef.current! : rightRef.current!;
        const distance = Math.abs(rightH - leftH);
        if (distance <= 0) return;

        const st = ScrollTrigger.create({
          trigger: rowRef.current,
          start: `top top+=${offset}`,
          end: () => `+=${distance}`,
          pin: pinTarget,
          pinSpacing: false,
        });

        return () => st.kill();
      });

      return () => mm.revert();
    },
    { scope: rowRef, dependencies: [reducedMotion] }
  );

  return (
    <div ref={rowRef} className={className}>
      <div ref={leftRef} className={leftClassName}>
        {left}
      </div>
      <div ref={rightRef} className={rightClassName}>
        {right}
      </div>
    </div>
  );
}
