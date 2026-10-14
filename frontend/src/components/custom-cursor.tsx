"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const quickDotX = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3.out" });
    const quickDotY = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3.out" });
    const quickRingX = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3.out" });
    const quickRingY = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3.out" });

    const onMove = (e: PointerEvent) => {
      quickDotX(e.clientX);
      quickDotY(e.clientY);
      quickRingX(e.clientX);
      quickRingY(e.clientY);
    };

    const onEnterInteractive = () => ring.classList.add("scale-150", "opacity-60");
    const onLeaveInteractive = () => ring.classList.remove("scale-150", "opacity-60");

    window.addEventListener("pointermove", onMove, { passive: true });

    const interactiveEls = document.querySelectorAll(
      "a, button, [data-cursor-interactive]"
    );
    interactiveEls.forEach((el) => {
      el.addEventListener("pointerenter", onEnterInteractive);
      el.addEventListener("pointerleave", onLeaveInteractive);
    });

    document.documentElement.classList.add("has-custom-cursor");

    return () => {
      window.removeEventListener("pointermove", onMove);
      interactiveEls.forEach((el) => {
        el.removeEventListener("pointerenter", onEnterInteractive);
        el.removeEventListener("pointerleave", onLeaveInteractive);
      });
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-9999 hidden [.has-custom-cursor_&]:block"
      aria-hidden="true"
    >
      <div
        ref={ringRef}
        className="fixed left-0 top-0 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-teal/60 transition-[transform,opacity] duration-200 will-change-transform"
      />
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal will-change-transform"
      />
    </div>
  );
}
