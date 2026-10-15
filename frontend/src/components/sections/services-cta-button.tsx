"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Magnetic } from "@/components/ui/magnetic";

export function ServicesCtaButton({ label, href }: { label: string; href: string }) {
  const reducedMotion = useReducedMotion();

  return (
    <Magnetic strength={0.2} className="inline-block">
      <motion.div
        whileHover={reducedMotion ? undefined : { scale: 1.03 }}
        whileTap={reducedMotion ? undefined : { scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="inline-block"
      >
        <Link
          href={href}
          data-cursor-interactive
          className="group relative inline-flex items-center overflow-hidden rounded-[4px] bg-teal px-7 py-3.5 text-sm font-semibold tracking-[0.3px] text-white transition-all hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(10,158,136,0.35)]"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 -translate-x-full bg-teal-dark transition-transform duration-500 ease-out group-hover:translate-x-0"
          />
          <span className="relative z-1 transition-transform duration-300 group-hover:translate-x-0.5">
            {label}
          </span>
        </Link>
      </motion.div>
    </Magnetic>
  );
}
