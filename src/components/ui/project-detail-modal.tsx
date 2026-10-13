"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/data/company";
import { SERVICE_CATEGORIES } from "@/data/services";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const ACCENT_BG = {
  blue: "bg-blue-light",
  amber: "bg-amber",
  teal: "bg-teal",
  purple: "bg-purple",
  cyan: "bg-cyan",
} as const;

const ACCENT_TEXT = {
  blue: "text-blue-light",
  amber: "text-amber",
  teal: "text-teal",
  purple: "text-purple",
  cyan: "text-cyan",
} as const;

const ACCENT_GLOW = {
  blue: "rgba(159,185,252,0.28)",
  amber: "rgba(224,138,0,0.28)",
  teal: "rgba(10,158,136,0.28)",
  purple: "rgba(124,58,237,0.28)",
  cyan: "rgba(14,165,181,0.28)",
} as const;

const STATUS_STYLES = {
  Ongoing: "bg-teal/[0.15] text-teal",
  Completed: "bg-blue-light/[0.15] text-blue-light",
} as const;

function accentFor(project: Project): keyof typeof ACCENT_BG {
  return SERVICE_CATEGORIES[project.categorySlug].accent;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function noopSubscribe() {
  return () => {};
}

/** Portaling touches document.body, which doesn't exist on the server; this flips true only after client mount. */
function useMounted() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

export function ProjectDetailModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const [displayProject, setDisplayProject] = useState(project);
  const mounted = useMounted();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();

  if (project && project !== displayProject) {
    setDisplayProject(project);
  }

  useEffect(() => {
    if (!project) {
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
  }, [project]);

  useEffect(() => {
    if (!project) return;

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
  }, [project, onClose]);

  if (!mounted || !displayProject) return null;

  const accent = accentFor(displayProject);
  const divisionLabel = SERVICE_CATEGORIES[displayProject.categorySlug].label;
  const timelineDetail =
    displayProject.statusLabel.split("·")[1]?.trim() || displayProject.status;

  return createPortal(
    <AnimatePresence
      onExitComplete={() => {
        setDisplayProject(null);
        previouslyFocused.current?.focus();
      }}
    >
      {project && (
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
            aria-labelledby="project-modal-title"
            initial={reducedMotion ? false : { opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-h-[88vh] w-full max-w-xl overflow-y-auto rounded-[14px] border border-border bg-card"
            style={{
              boxShadow: `0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px ${ACCENT_GLOW[accent]}`,
            }}
          >
            <div className={cn("h-[5px]", ACCENT_BG[accent])} />

            {/* The project's own photograph, full-bleed across the panel under the
                accent bar. Every project in `getProjects()` carries an `image` (and
                most a `webpImage`), so this is the same picture the card behind the
                modal is already showing — the modal just gives it room.

                Rendered conditionally rather than with the `p-01.jpg` fallback the
                grid uses: that fallback would put an unrelated project's photo on
                a project that has none, and this copy is more specific than the
                card, so a wrong image is more noticeable here.

                The bottom gradient fades into the card surface so the picture meets
                the content without a hard seam, matching the treatment on the grid
                cards. The close button floats over the top of the image; it carries
                its own background and border, so it stays legible against artwork. */}
            {displayProject.image && (
              <div className="relative h-44 w-full overflow-hidden sm:h-60">
                <picture className="relative block h-full w-full">
                  {displayProject.webpImage && (
                    <source srcSet={displayProject.webpImage} type="image/webp" />
                  )}
                  <Image
                    src={displayProject.image}
                    alt={`${displayProject.title} for ${displayProject.client}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 576px"
                    className="object-cover"
                  />
                </picture>
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-card via-card/25 to-transparent"
                />
              </div>
            )}

            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Close project details"
              onClick={onClose}
              data-cursor-interactive
              // Sits over the project photo, so it needs enough of its own surface to stay
              // legible against arbitrary artwork — hence the opaque-ish fill and
              // the blur, which were not needed when it sat on flat card colour.
              className="absolute right-5 top-6 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-navy3/80 text-white/80 backdrop-blur-md transition-colors hover:border-white/40 hover:bg-navy3 hover:text-white"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M1 1L13 13M13 1L1 13"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <div className="px-7 py-8 sm:px-9 sm:py-9">
              <div className="mb-5 flex flex-wrap items-center gap-2.5 pr-10">
                <span
                  className={cn(
                    "rounded-full bg-white/[0.06] px-3 py-1 text-[11px] font-bold uppercase tracking-[1px]",
                    ACCENT_TEXT[accent]
                  )}
                >
                  {divisionLabel}
                </span>
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.3px]",
                    STATUS_STYLES[displayProject.status]
                  )}
                >
                  {displayProject.status}
                </span>
              </div>

              <h2
                id="project-modal-title"
                className="mb-2 font-display text-[26px] font-extrabold leading-tight text-white sm:text-[30px]"
              >
                {displayProject.title}
              </h2>
              <p className="mb-6 text-[14px] text-[#94A3B8]">{displayProject.client}</p>

              {displayProject.description && (
                <p className="mb-7 text-[14px] leading-[1.75] text-[#B8C4D4]">
                  {displayProject.description}
                </p>
              )}

              <div className="grid grid-cols-2 gap-5 border-t border-border pt-6 sm:grid-cols-3">
                <div>
                  <div className="mb-1 text-[10px] font-bold uppercase tracking-[1.5px] text-muted">
                    Scope / Capacity
                  </div>
                  <div className="font-display text-[19px] font-bold text-white">
                    {displayProject.metric}
                  </div>
                </div>
                {displayProject.valueCr !== undefined && (
                  <div>
                    <div className="mb-1 text-[10px] font-bold uppercase tracking-[1.5px] text-muted">
                      Contract Value
                    </div>
                    <div className="font-display text-[19px] font-bold text-white">
                      BDT {displayProject.valueCr} Cr
                    </div>
                  </div>
                )}
                <div>
                  <div className="mb-1 text-[10px] font-bold uppercase tracking-[1.5px] text-muted">
                    Timeline
                  </div>
                  <div className="font-display text-[19px] font-bold text-white">
                    {timelineDetail}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-border pt-6">
                <Link
                  href="/contact"
                  data-cursor-interactive
                  className="inline-block rounded-[4px] bg-blue-light px-6 py-3 text-[14px] font-semibold text-navy transition-colors hover:bg-blue2"
                >
                  Discuss a Similar Project →
                </Link>
                <button
                  type="button"
                  onClick={onClose}
                  data-cursor-interactive
                  className="text-[14px] font-medium text-white/70 transition-colors hover:text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
