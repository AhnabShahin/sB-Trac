"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ChevronUpIcon } from "@/components/ui/icons";
import { lenisStore } from "@/lib/lenis-instance";

const SHOW_AFTER_PX = 560;

export function BackToTopButton() {
  const [visible, setVisible] = useState(false);
  const tickingRef = useRef(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        setVisible(window.scrollY > SHOW_AFTER_PX);
        tickingRef.current = false;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    const lenis = lenisStore.current;
    if (lenis) {
      lenis.scrollTo(0, { duration: reducedMotion ? 0 : 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      aria-label="Back to top"
      data-cursor-interactive
      inert={!visible}
      initial={false}
      animate={
        reducedMotion
          ? { opacity: visible ? 1 : 0 }
          : { opacity: visible ? 1 : 0, y: visible ? 0 : 16, scale: visible ? 1 : 0.85 }
      }
      transition={{ duration: reducedMotion ? 0.15 : 0.35, ease: "easeOut" }}
      whileHover={reducedMotion ? undefined : { y: -3, scale: 1.05 }}
      whileTap={reducedMotion ? undefined : { scale: 0.92 }}
      className="fixed bottom-6 right-6 z-90 flex h-11 w-11 items-center justify-center rounded-full border border-teal/40 bg-navy2/90 text-teal shadow-[0_4px_20px_rgba(0,0,0,0.35)] backdrop-blur-md transition-colors duration-200 hover:border-teal hover:bg-teal hover:text-navy sm:bottom-8 sm:right-8 sm:h-12 sm:w-12"
    >
      <ChevronUpIcon width={20} height={20} strokeWidth={2} />
    </motion.button>
  );
}
