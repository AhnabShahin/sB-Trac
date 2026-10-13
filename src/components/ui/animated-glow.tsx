"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

registerGsap();

export function AnimatedGlow({
  color = "rgba(10,158,136,0.14)",
}: {
  color?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (!ref.current) return;
      if (reducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.to(ref.current, {
        x: 60,
        y: 24,
        scale: 1.15,
        duration: 6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    },
    { scope: ref, dependencies: [reducedMotion] }
  );

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        background: `radial-gradient(circle, ${color}, transparent 70%)`,
      }}
    />
  );
}
