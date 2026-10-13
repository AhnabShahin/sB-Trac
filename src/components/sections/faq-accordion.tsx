"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDownIcon } from "@/components/ui/icons";
import { StaggerGroup } from "@/components/ui/stagger-group";
import type { ContactFaq } from "@/data/contact";
import { cn } from "@/lib/utils";

export function FaqAccordion({ faqs }: { faqs: ContactFaq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();

  return (
    <StaggerGroup
      as="div"
      itemSelector="[data-stagger-item]"
      className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2"
    >
      {faqs.map((faq, i) => {
        const open = openIndex === i;
        return (
          <div
            key={faq.question}
            data-stagger-item
            className="group relative overflow-hidden rounded-[10px] border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-teal/30 hover:shadow-[0_12px_32px_rgba(0,0,0,0.25)]"
          >
            <span
              aria-hidden="true"
              className={cn(
                "absolute inset-x-0 top-0 h-0.5 origin-left bg-teal transition-transform duration-300",
                open ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              )}
            />
            <button
              type="button"
              data-cursor-interactive
              aria-expanded={open}
              onClick={() => setOpenIndex(open ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-7 text-left"
            >
              <h3
                className={cn(
                  "font-display text-lg font-bold leading-tight transition-colors duration-300",
                  open ? "text-teal" : "text-white group-hover:text-teal"
                )}
              >
                {faq.question}
              </h3>
              <ChevronDownIcon
                width={18}
                height={18}
                className={cn(
                  "shrink-0 text-muted transition-transform duration-300",
                  open && "rotate-180 text-teal"
                )}
              />
            </button>

            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={reducedMotion ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reducedMotion ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-7 text-[13px] leading-[1.65] text-[#94A3B8]">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </StaggerGroup>
  );
}
