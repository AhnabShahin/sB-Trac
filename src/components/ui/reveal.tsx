"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

registerGsap();

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  y?: number;
  duration?: number;
  delay?: number;
  start?: string;
  /**
   * Reveal once and stay visible (default). Set to `false` to let the element
   * fade back out when it leaves the viewport going up — note that a short
   * upward scroll can then leave content invisible while it is still on
   * screen, because `clearProps` has already dropped the tween's inline styles.
   */
  once?: boolean;
}

export function Reveal({
  children,
  as: Tag = "div",
  className,
  y = 32,
  duration = 0.9,
  delay = 0,
  start = "top 85%",
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (!ref.current) return;
      if (reducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const el = ref.current;

      // Elements also carry Tailwind `transition-*` classes for hover states.
      // Left enabled during the tween, the browser tries to CSS-transition
      // every GSAP-driven frame of opacity/transform, producing stutter —
      // suspend it for the reveal, then hand the element back to CSS.
      const setTransition = (value: string) => {
        el.style.transition = value;
      };

      gsap.fromTo(
        el,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          ease: "power3.out",
          clearProps: "opacity,transform",
          // Tailwind `transition-*` classes live on these elements for hover
          // states. While a GSAP-driven opacity/transform update is running,
          // leave CSS transitions disabled so the browser doesn't try to
          // interpolate every GSAP frame (which jitters). Hand the element
          // back to CSS the moment the tween finishes (or is reversed), so
          // hover transitions return to normal and `transition: none` never
          // stays stuck after the tween is done.
          onStart: () => setTransition("none"),
          onComplete: () => setTransition(""),
          onReverseComplete: () => setTransition(""),
          scrollTrigger: {
            trigger: el,
            start,
            toggleActions: once ? "play none none none" : "play none none reverse",
            ...(once ? {} : { onLeaveBack: () => setTransition("none") }),
          },
        }
      );
    },
    { scope: ref, dependencies: [reducedMotion] }
  );

  const Component = Tag as ElementType;

  return (
    <Component ref={ref} className={className}>
      {children}
    </Component>
  );
}
