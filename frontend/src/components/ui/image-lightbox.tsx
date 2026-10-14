"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export interface LightboxImage {
  src: string;
  webpSrc?: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
}

function noopSubscribe() {
  return () => {};
}

/** Portaling touches document.body, which doesn't exist on the server; this flips true only after client mount. */
function useMounted() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

export function ImageLightbox({
  image,
  onClose,
}: {
  image: LightboxImage | null;
  onClose: () => void;
}) {
  const [displayImage, setDisplayImage] = useState(image);
  const mounted = useMounted();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();

  if (image && image !== displayImage) {
    setDisplayImage(image);
  }

  useEffect(() => {
    if (!image) {
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
  }, [image]);

  useEffect(() => {
    if (!image) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [image, onClose]);

  if (!mounted || !displayImage) return null;

  return createPortal(
    <AnimatePresence
      onExitComplete={() => {
        setDisplayImage(null);
        previouslyFocused.current?.focus();
      }}
    >
      {image && (
        <motion.div
          key="lightbox-backdrop"
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reducedMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed inset-0 z-200 flex items-center justify-center bg-navy3/90 px-4 py-10 backdrop-blur-sm sm:px-8"
          onClick={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.figure
            key="lightbox-panel"
            role="dialog"
            aria-modal="true"
            aria-label={displayImage.alt}
            initial={reducedMotion ? false : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-5xl"
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close image"
              data-cursor-interactive
              className="absolute -top-11 right-0 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/[0.08] text-white transition-colors hover:border-teal/60 hover:bg-teal/20"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <path
                  d="M3 3l10 10M13 3L3 13"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <div className="overflow-hidden rounded-[14px] border border-border bg-navy3 shadow-[0_24px_80px_rgba(0,0,0,0.6)]">
              <picture>
                {displayImage.webpSrc && (
                  <source srcSet={displayImage.webpSrc} type="image/webp" />
                )}
                <Image
                  src={displayImage.src}
                  alt={displayImage.alt}
                  width={displayImage.width}
                  height={displayImage.height}
                  sizes="(max-width: 1024px) 92vw, 1024px"
                  className="h-auto max-h-[80vh] w-full object-contain"
                  priority
                />
              </picture>
            </div>

            {displayImage.caption && (
              <figcaption className="mt-3 text-center text-[13px] text-muted">
                {displayImage.caption}
              </figcaption>
            )}
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
