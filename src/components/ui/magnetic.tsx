"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

registerGsap();

interface MagneticProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

export function Magnetic({ children, className, strength = 0.35 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (!ref.current) return;
      if (reducedMotion || !window.matchMedia("(pointer: fine)").matches) return;

      const el = ref.current;
      const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

      function onMove(e: PointerEvent) {
        const rect = el.getBoundingClientRect();
        const relX = e.clientX - (rect.left + rect.width / 2);
        const relY = e.clientY - (rect.top + rect.height / 2);
        xTo(relX * strength);
        yTo(relY * strength);
      }

      function onLeave() {
        xTo(0);
        yTo(0);
      }

      el.addEventListener("pointermove", onMove, { passive: true });
      el.addEventListener("pointerleave", onLeave, { passive: true });

      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: ref, dependencies: [reducedMotion, strength] }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
