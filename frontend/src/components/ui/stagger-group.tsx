"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

registerGsap();

interface StaggerGroupProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  itemSelector?: string;
  stagger?: number;
  y?: number;
  start?: string;
  /**
   * Reveal once and stay visible (default). Set to `false` to let the items
   * fade back out when the group leaves the viewport going up — note that a
   * short upward scroll can then leave items invisible while they are still
   * on screen.
   */
  once?: boolean;
}

export function StaggerGroup({
  children,
  as: Tag = "div",
  className,
  itemSelector = "[data-stagger-item]",
  stagger = 0.1,
  y = 28,
  start = "top 80%",
  once = true,
}: StaggerGroupProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (!ref.current) return;
      if (reducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const items = ref.current.querySelectorAll<HTMLElement>(itemSelector);
      if (!items.length) return;

      // Cards also carry Tailwind `transition-*` classes for hover states.
      // Left enabled during the tween, the browser tries to CSS-transition
      // every GSAP-driven frame of opacity/transform, producing stutter —
      // suspend it for the reveal, then hand the element back to CSS.
      const setTransition = (value: string) => {
        items.forEach((item) => {
          item.style.transition = value;
        });
      };

      gsap.fromTo(
        items,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger,
          clearProps: "opacity,transform",
          // See Reveal: hover `transition-*` classes must not race GSAP's
          // per-frame updates. Disable them for the duration of the tween and
          // re-enable the moment it finishes/reverses, so `transition: none`
          // never gets left stuck.
          onStart: () => setTransition("none"),
          onComplete: () => setTransition(""),
          onReverseComplete: () => setTransition(""),
          scrollTrigger: {
            trigger: ref.current,
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
