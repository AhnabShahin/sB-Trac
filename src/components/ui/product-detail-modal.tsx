"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import type { Product, ProductCategory, ProductSubCategory } from "@/data/products";
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

export interface SelectedProduct {
  product: Product;
  category: ProductCategory;
  subCategory: ProductSubCategory;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function noopSubscribe() {
  return () => {};
}

/** Portaling touches document.body, which doesn't exist on the server; flips true after mount. */
function useMounted() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

export function ProductDetailModal({
  selected,
  onClose,
}: {
  selected: SelectedProduct | null;
  onClose: () => void;
}) {
  const [display, setDisplay] = useState(selected);
  const [activePhoto, setActivePhoto] = useState(0);
  const mounted = useMounted();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();

  // Hold the last selection through the exit animation so the panel can animate out.
  if (selected && selected.product.id !== display?.product.id) {
    setDisplay(selected);
    setActivePhoto(0);
  }

  useEffect(() => {
    if (!selected) {
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
  }, [selected]);

  useEffect(() => {
    if (!selected) return;

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
  }, [selected, onClose]);

  if (!mounted || !display) return null;

  const { product, category, subCategory } = display;
  const accent = category.accent;
  const gallery = [product.image, ...(product.gallery ?? [])];
  const photo = gallery[Math.min(activePhoto, gallery.length - 1)];
  return createPortal(
    <AnimatePresence
      onExitComplete={() => {
        setDisplay(null);
        previouslyFocused.current?.focus();
      }}
    >
      {selected && (
        <motion.div
          key="backdrop"
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reducedMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed inset-0 z-200 flex items-center justify-center bg-navy3/85 px-4 py-6 backdrop-blur-sm sm:px-6 sm:py-8"
          onClick={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.div
            key="panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-modal-title"
            initial={reducedMotion ? false : { opacity: 0, scale: 0.95, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, scale: 0.97, y: 12 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[16px] border border-border bg-card lg:grid lg:grid-cols-[46%_54%]"
            style={{
              boxShadow: `0 28px 90px rgba(0,0,0,0.6), 0 0 0 1px ${ACCENT_GLOW[accent]}`,
            }}
          >
            <div className={cn("h-[5px] lg:col-span-2", ACCENT_BG[accent])} />

            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Close product details"
              onClick={onClose}
              data-cursor-interactive
              className="absolute right-4 top-9 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-navy2/80 text-white/70 backdrop-blur transition-colors hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 lg:top-6"
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

            {/* Left: product image, plus a thumbnail strip for multi-photo items */}
            <div className="flex flex-col bg-navy3">
              <div className="relative h-52 w-full overflow-hidden sm:h-64 lg:min-h-[380px] lg:flex-1">
                <Image
                  key={photo}
                  src={photo}
                  alt={`${product.title} — ${category.name}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 46vw"
                  className="object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy3/85 via-navy3/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-navy3/20 lg:to-navy3/70" />
              </div>

              {gallery.length > 1 && (
                <div
                  role="group"
                  aria-label={`${product.title} photos`}
                  className="flex gap-2 p-3"
                >
                  {gallery.map((src, index) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setActivePhoto(index)}
                      aria-label={`Show photo ${index + 1} of ${gallery.length}`}
                      aria-current={index === activePhoto}
                      data-cursor-interactive
                      className={cn(
                        "relative h-14 w-16 shrink-0 overflow-hidden rounded-md border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
                        index === activePhoto
                          ? "border-white/80 opacity-100"
                          : "border-white/15 opacity-55 hover:opacity-90"
                      )}
                    >
                      <Image
                        src={src}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: category › sub-category › title › full description.
                All four sides are padded here so the text clears both the image edge
                on the left and the close button on the right at desktop widths. */}
            <div className="px-7 pb-8 pt-6 sm:px-9 sm:pb-9 lg:py-10 lg:pl-10 lg:pr-14">
              <nav aria-label="Breadcrumb" className="mb-6 pr-12 text-[13px] text-muted lg:pr-0">
                <span className={cn("font-semibold", ACCENT_TEXT[accent])}>
                  {category.name}
                </span>
                <span className="mx-2">/</span>
                <span className="text-[#94A3B8]">{subCategory.name}</span>
              </nav>

              <h2
                id="product-modal-title"
                className="mb-4 font-display text-[26px] font-extrabold leading-[1.15] text-white sm:text-[32px]"
              >
                {product.title}
              </h2>

              <div className="mb-6 h-px w-full bg-gradient-to-r from-white/20 via-white/10 to-transparent" />

              <p className="text-[15px] leading-[1.8] text-[#C3CDDB] sm:text-base">
                {product.writeUp}
              </p>

              {product.highlights && product.highlights.length > 0 && (
                <ul className="mt-7 flex flex-wrap gap-2">
                  {product.highlights.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-white/12 bg-white/[0.05] px-3 py-1.5 text-[12px] font-medium text-[#C3CDDB]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-9 flex flex-wrap items-center gap-5">
                <Link
                  href="/contact"
                  data-cursor-interactive
                  className="inline-block rounded-[4px] bg-teal px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-teal-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  Request a Quote
                </Link>
                <span className="text-[13px] text-muted">
                  Listed under {category.shortName}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
