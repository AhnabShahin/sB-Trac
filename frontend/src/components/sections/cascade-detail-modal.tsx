"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { ChecklistIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import type { CascadeSlideContent } from "@/data/content-types";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function noopSubscribe() {
  return () => {};
}

/** Portaling touches document.body, which doesn't exist on the server; this flips true only after client mount. */
function useMounted() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

/** The full text for a cascade slide, for when the panel's fixed height clips it — same modal chrome/motion as ProjectDetailModal. */
export function CascadeDetailModal({
  slide,
  onClose,
}: {
  slide: CascadeSlideContent | null;
  onClose: () => void;
}) {
  const [displaySlide, setDisplaySlide] = useState(slide);
  const mounted = useMounted();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();

  if (slide && slide !== displaySlide) {
    setDisplaySlide(slide);
  }

  useEffect(() => {
    if (!slide) {
      document.body.style.overflow = "";
      return;
    }
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    const raf = requestAnimationFrame(() => closeButtonRef.current?.focus());
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = "";
    };
  }, [slide]);

  useEffect(() => {
    if (!slide) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [slide, onClose]);

  if (!mounted || !displaySlide) return null;

  return createPortal(
    <AnimatePresence onExitComplete={() => setDisplaySlide(null)}>
      {slide && (
        <motion.div
          key="backdrop"
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reducedMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed inset-0 z-200 flex items-center justify-center bg-navy3/80 px-4 py-8 backdrop-blur-sm sm:px-6"
          onClick={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.div
            key="panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cascade-modal-title"
            initial={reducedMotion ? false : { opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-h-[88vh] w-full max-w-xl overflow-y-auto rounded-[14px] border border-border bg-card"
            style={{ boxShadow: "0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(10,158,136,0.28)" }}
          >
            <div className="h-[5px] bg-teal" />

            {displaySlide.image && (
              <div className="relative h-44 w-full overflow-hidden sm:h-60">
                <Image
                  src={displaySlide.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, 576px"
                  className="object-cover"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-card via-card/25 to-transparent"
                />
              </div>
            )}

            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Close"
              onClick={onClose}
              data-cursor-interactive
              className="absolute right-5 top-6 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-navy3/80 text-white/80 backdrop-blur-md transition-colors hover:border-white/40 hover:bg-navy3 hover:text-white"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>

            <div className="px-7 py-8 sm:px-9 sm:py-9">
              <div className="mb-3 font-display text-sm font-bold tracking-[2px] text-teal">
                {displaySlide.index}
              </div>
              <h2
                id="cascade-modal-title"
                className="mb-5 font-display text-[26px] font-extrabold leading-tight text-white sm:text-[30px]"
              >
                {displaySlide.title}
              </h2>

              {displaySlide.lead ? (
                <p className="mb-5 text-lg font-semibold leading-[1.5] text-teal-light">
                  {displaySlide.lead}
                </p>
              ) : null}

              {displaySlide.description ? (
                <p className="text-[16px] leading-[1.75] text-[#B8C4D4]">
                  {displaySlide.description}
                </p>
              ) : null}

              {displaySlide.items?.length ? (
                <ul className="mt-2 space-y-3">
                  {displaySlide.items.map((item, j) => (
                    <li
                      key={j}
                      className={cn(
                        "flex items-start gap-3",
                        displaySlide.itemsVariant === "stats" &&
                          "rounded-xl border border-teal/15 bg-white/[0.03] px-4 py-3.5",
                      )}
                    >
                      <ChecklistIcon width={18} height={18} className="mt-0.5 shrink-0 text-teal" />
                      <span className="text-[15px] leading-[1.6] text-slate-200">
                        {item.title ? (
                          <strong className="font-semibold text-white">{item.title}: </strong>
                        ) : null}
                        {item.description}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
