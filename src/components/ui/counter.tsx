"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

registerGsap();

interface CounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  suffixClassName?: string;
}

export function Counter({
  value,
  suffix = "",
  prefix = "",
  className,
  suffixClassName,
}: CounterProps) {
  const numRef = useRef<HTMLSpanElement>(null);
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (!numRef.current || reducedMotion) return;
      const el = numRef.current;
      const counter = { val: 0 };

      gsap.to(counter, {
        val: value,
        duration: 1.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top 90%",
          once: true,
        },
        onUpdate: () => {
          el.textContent = Math.floor(counter.val).toLocaleString("en-US");
        },
      });
    },
    { scope: wrapperRef, dependencies: [reducedMotion, value] }
  );

  return (
    <span ref={wrapperRef} className={className}>
      {prefix}
      <span ref={numRef}>{value.toLocaleString("en-US")}</span>
      {suffix && <span className={suffixClassName}>{suffix}</span>}
    </span>
  );
}
