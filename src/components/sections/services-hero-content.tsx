"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

registerGsap();

export function ServicesHeroContent({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (!rootRef.current) return;

      const items = rootRef.current.querySelectorAll("[data-hero-item]");

      if (reducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(items, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(items, { opacity: 0, y: 28 });

      const tl = gsap.timeline({ delay: 0.15 });
      tl.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
      });

      if (glowRef.current) {
        gsap.to(glowRef.current, {
          y: 120,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      }

      return () => {
        ScrollTrigger.getAll().forEach((st) => {
          if (st.trigger === rootRef.current) st.kill();
        });
      };
    },
    { scope: rootRef, dependencies: [reducedMotion] }
  );

  return (
    <>
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute -right-[160px] -top-[160px] h-[480px] w-[480px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(10,158,136,0.14), transparent 70%)",
        }}
      />

      <div ref={rootRef} className="relative z-1 max-w-4xl">
        {children}
      </div>
    </>
  );
}
