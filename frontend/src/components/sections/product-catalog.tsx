"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { StaggerGroup } from "@/components/ui/stagger-group";
import {
  ProductDetailModal,
  type SelectedProduct,
} from "@/components/ui/product-detail-modal";
import { lenisStore } from "@/lib/lenis-instance";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { ProductCategory } from "@/data/products";
import { cn } from "@/lib/utils";

const ACCENT_TEXT = {
  blue: "text-blue-light",
  amber: "text-amber",
  teal: "text-teal",
  purple: "text-purple",
  cyan: "text-cyan",
} as const;

const ACCENT_BG = {
  blue: "bg-blue-light",
  amber: "bg-amber",
  teal: "bg-teal",
  purple: "bg-purple",
  cyan: "bg-cyan",
} as const;

const ACCENT_BORDER = {
  blue: "border-t-blue",
  amber: "border-t-amber",
  teal: "border-t-teal",
  purple: "border-t-purple",
  cyan: "border-t-cyan",
} as const;

const ACCENT_GLOW = {
  blue: "rgba(159,185,252,0.16)",
  amber: "rgba(224,138,0,0.16)",
  teal: "rgba(10,158,136,0.16)",
  purple: "rgba(124,58,237,0.16)",
  cyan: "rgba(14,165,181,0.16)",
} as const;

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.6-3.6" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      data-cursor-interactive
      className={cn(
        "shrink-0 rounded-full border px-4 py-2 text-[13px] font-semibold tracking-[0.3px] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/60",
        active
          ? "border-teal bg-teal/[0.14] text-white"
          : "border-white/12 bg-white/[0.04] text-[#94A3B8] hover:border-white/25 hover:text-white"
      )}
    >
      {children}
    </button>
  );
}

/** Flattens every product in a category into one count, for the chip badges. */
function countProducts(category: ProductCategory) {
  return category.subCategories.reduce((total, sub) => total + sub.products.length, 0);
}

/**
 * Maps a catalogue anchor to its category: `#<categoryId>` itself, or the
 * `#<categoryId>-<subId>` form the service pages' "View products" cards use.
 * Longest category id first, so an id that prefixes another can never steal
 * the match.
 */
function findCategoryForHash(categories: ProductCategory[], hash: string) {
  return [...categories]
    .sort((a, b) => b.id.length - a.id.length)
    .find(
      (category) =>
        hash === category.id ||
        (hash.startsWith(`${category.id}-`) &&
          category.subCategories.some(
            (sub) => sub.id === hash.slice(category.id.length + 1)
          ))
    );
}

export function ProductCatalog({ categories }: { categories: ProductCategory[] }) {
  const [selected, setSelected] = useState<SelectedProduct | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [query, setQuery] = useState("");

  const resultsRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  // Deep-link arrival: the service pages' "View products" cards send readers to
  // /products-services#<categoryId>-<subId>. On arrival the matching category is
  // activated first (so #scp-substation-systems opens the SCP chip, not "All"),
  // and this ref holds the anchor so the initial scroll lands on the exact
  // group asked for. Cleared the moment the reader touches a filter themselves,
  // so their own filtering returns to the normal "first group" scroll.
  const pendingHashRef = useRef<string | null>(null);
  // Bumped when a hash points at a new group, so a hash change between groups of
  // the already-active category (no `activeCategory` change, hence no effect
  // re-run otherwise) still re-runs the scroll.
  const [hashTick, setHashTick] = useState(0);
  const reducedMotion = useReducedMotion();

  // Activates the category a service page's "View products" card pointed at.
  // Runs after hydration (SSR renders "all"), so server and first client render
  // still agree; the filter snaps in before the scroll lands on the group.
  useEffect(() => {
    const applyHashFilter = () => {
      const hash = window.location.hash.slice(1);
      if (!hash) return;
      const match = findCategoryForHash(categories, hash);
      if (!match) return;
      pendingHashRef.current = hash;
      setHashTick((tick) => tick + 1);
      setActiveCategory((current) => (current === match.id ? current : match.id));
    };

    applyHashFilter();
    // Covers back/forward and manual hash edits while staying on this page.
    window.addEventListener("hashchange", applyHashFilter);
    return () => window.removeEventListener("hashchange", applyHashFilter);
  }, [categories]);

  // Wherever the reader happens to be on the page, activating a filter drops them
  // onto the first sub-category heading — the first thing under the toolbar — so
  // the filtered products are what they land on, not the "Product Catalogue"
  // title, which by then is several screens of scrolling away.
  //
  // Keyed on the category (and hash arrivals) only, deliberately: scrolling on
  // every keystroke of the search box would yank the viewport out from under
  // someone mid-type.
  useEffect(() => {
    // Skip the initial render — landing on the page must not scroll it.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const results = resultsRef.current;
    if (!results) return;

    // Where the filtered list should land. A deep-linked group from a "View
    // products" card (#<category>-<sub>) wins — the reader asked for that exact
    // section. Otherwise the first sub-category in the filtered list, falling
    // back to the results container so a filter that somehow yields no groups
    // still scrolls somewhere sensible instead of doing nothing.
    const pendingId = pendingHashRef.current;
    const pendingTarget = pendingId ? document.getElementById(pendingId) : null;
    const target =
      (pendingTarget && results.contains(pendingTarget) ? pendingTarget : null) ??
      results.querySelector<HTMLElement>("[data-subcategory]") ??
      results;

    let settleFrame = 0;
    let measureFrame = 0;

    // Two frames, in a fixed order, and the order matters:
    //
    // 1. Lenis caches the page height, which the shorter filtered list has
    //    invalidated. Resize it first, or it clamps the destination to the stale
    //    maximum and the jump goes nowhere (or overshoots).
    // 2. Only once that has settled is it safe to measure. Measuring before the
    //    resize reads a position against the old, taller layout and lands the
    //    reader deep inside the new list.
    settleFrame = requestAnimationFrame(() => {
      lenisStore.current?.resize();

      measureFrame = requestAnimationFrame(() => {
        // Land just below the sticky toolbar, which ends at the header (64px)
        // plus its own 4px gap. The toolbar is measured rather than hard-coded
        // because it is two rows tall on small screens (chips over the search
        // box) and one row on desktop — a fixed offset would clip the heading on
        // one of those.
        const toolbar = document.querySelector<HTMLElement>(
          "[data-catalogue-toolbar]"
        );
        const stickyBottom = 68 + (toolbar?.offsetHeight ?? 60) + 12;

        // Passed as an absolute scroll position rather than via Lenis's `offset`
        // option: `offset` is subtracted internally, and guessing that sign wrong
        // is what previously sent the page to the wrong place. Computing the
        // destination here keeps the native and Lenis paths on the same number.
        const destination = Math.max(
          0,
          target.getBoundingClientRect().top + window.scrollY - stickyBottom
        );

        if (lenisStore.current) {
          // Lenis owns the scroll position; a native scrollTo would be undone by it.
          lenisStore.current.scrollTo(destination, {
            duration: reducedMotion ? 0 : 0.8,
          });
        } else {
          window.scrollTo({
            top: destination,
            behavior: reducedMotion ? "auto" : "smooth",
          });
        }
      });
    });

    return () => {
      cancelAnimationFrame(settleFrame);
      cancelAnimationFrame(measureFrame);
    };
  }, [activeCategory, hashTick, reducedMotion]);

  const totalProducts = useMemo(
    () => categories.reduce((total, c) => total + countProducts(c), 0),
    [categories]
  );

  // The category filter and the search box are independent and combine: picking a
  // chip narrows the list, and typing narrows whatever is left. Categories and
  // sub-categories left with nothing are dropped entirely rather than kept as
  // headings with nothing under them, which is what would otherwise appear the
  // moment a search term missed part of the catalogue.
  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();

    return categories
      .filter((category) => activeCategory === "all" || category.id === activeCategory)
      .map((category) => ({
        ...category,
        subCategories: category.subCategories
          .map((sub) => ({
            ...sub,
            // Group names are part of the haystack, so a term like "solar" or
            // "transformer" still finds its group and not only items whose own
            // copy happens to contain the word.
            products: sub.products.filter(
              (product) =>
                !term ||
                product.title.toLowerCase().includes(term) ||
                product.writeUp.toLowerCase().includes(term) ||
                category.name.toLowerCase().includes(term) ||
                sub.name.toLowerCase().includes(term)
            ),
          }))
          .filter((sub) => sub.products.length > 0),
      }))
      .filter((category) => category.subCategories.length > 0);
  }, [categories, activeCategory, query]);

  const visibleCount = useMemo(
    () => visible.reduce((total, c) => total + countProducts(c), 0),
    [visible]
  );

  const filtering = activeCategory !== "all" || query.trim() !== "";

  // Reader-driven filtering supersedes a deep-link arrival: their own choice
  // decides where the scroll lands (first group in the filtered list) rather
  // than the anchor the page was opened with.
  const applyCategory = (id: string) => {
    pendingHashRef.current = null;
    setActiveCategory(id);
  };

  const resetFilters = () => {
    applyCategory("all");
    setQuery("");
  };

  return (
    <>
      {/* Toolbar — narrows the catalogue by category and searches it by name,
          description or group. Sticks just below the fixed 64px header, so the
          controls stay reachable through the whole product list instead of
          scrolling away after the first category.

          The frosted panel sits over static product cards, not over the hero
          video, so the blur is a stable sample rather than a per-frame snapshot,
          and it is opaque enough to keep the chips legible over artwork. */}
      <div data-catalogue-toolbar className="sticky top-[68px] z-50 mb-14">
        <div className="rounded-2xl border border-white/12 bg-navy2/85 px-4 py-3.5 shadow-[0_14px_40px_-16px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.10)] backdrop-blur-xl backdrop-saturate-150">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* One row on small screens via horizontal scroll, so the sticky bar
                never grows tall enough to eat the viewport; wraps from `sm` up. */}
            <div className="-mx-1 flex gap-2.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible sm:pb-0">
              <FilterChip active={activeCategory === "all"} onClick={() => applyCategory("all")}>
                All
                <span className="ml-2 text-[11px] opacity-70">{totalProducts}</span>
              </FilterChip>
              {categories.map((category) => (
                <FilterChip
                  key={category.id}
                  active={activeCategory === category.id}
                  onClick={() => applyCategory(category.id)}
                >
                  {category.shortName}
                  <span className="ml-2 text-[11px] opacity-70">
                    {countProducts(category)}
                  </span>
                </FilterChip>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-full lg:w-72">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
                  <SearchIcon />
                </span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search products…"
                  aria-label="Search products"
                  data-cursor-interactive
                  className="w-full rounded-full border border-white/12 bg-white/[0.05] py-2.5 pl-10 pr-9 text-[13px] text-white transition-colors placeholder:text-muted hover:border-white/20 focus:border-teal/50 focus:outline-none focus:ring-2 focus:ring-teal/40 [&::-webkit-search-cancel-button]:hidden"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                    data-cursor-interactive
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-white focus-visible:outline-none focus-visible:text-white"
                  >
                    <ClearIcon />
                  </button>
                )}
              </div>

              {/* The visible "45 products" readout that used to sit to the right of the search
                  box is gone — the chip row already carries a per-category tally,
                  and repeating the filtered total next to a search field that is
                  still being typed into was noise.

                  It is kept for screen readers only. This element is an `aria-live`
                  region on purpose: without it, typing in the search box silently
                  changes the number of results with no announcement. Moving it to
                  `sr-only` removes the visual readout while preserving that
                  announcement, so the result change is still non-silent. */}
              <span aria-live="polite" className="sr-only">
                {visibleCount} {visibleCount === 1 ? "product" : "products"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/40 px-6 py-20 text-center">
          <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-teal">
            No matches
          </div>
          <p className="mx-auto max-w-md text-[15px] leading-[1.7] text-[#94A3B8]">
            {query.trim()
              ? `Nothing matches “${query.trim()}”. Try a broader term, or reset the filters to see the full range.`
              : "This category has no products to show."}
          </p>
          {filtering && (
            <button
              type="button"
              onClick={resetFilters}
              data-cursor-interactive
              className="mt-6 rounded-full border border-teal/40 bg-teal/[0.12] px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-teal/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/60"
            >
              Reset filters
            </button>
          )}
        </div>
      ) : (
        <div ref={resultsRef} className="flex flex-col gap-20 lg:gap-24">
          {visible.map((category) => (
            <section key={category.id} id={category.id} aria-labelledby={`${category.id}-heading`}>
              <div className="mb-9 border-b border-border pb-6">
                {/* The "{n} products" tally that used to sit beside the short-name
                    badge is gone. It repeated what the toolbar above already reports
                    for the active filter, and beside a static heading it only went
                    stale the moment a filter changed. The badge is the only thing in
                    this row now, so it is no longer wrapped in a flex container that
                    only existed to sit it next to the count. */}
                <span
                  className={cn(
                    "mb-2 inline-block rounded-full bg-white/[0.06] px-3 py-1 text-[11px] font-bold uppercase tracking-[1.5px]",
                    ACCENT_TEXT[category.accent]
                  )}
                >
                  {category.shortName}
                </span>
                <h2
                  id={`${category.id}-heading`}
                  className="font-display text-[clamp(28px,3.4vw,40px)] font-extrabold leading-[1.1] text-white"
                >
                  {category.name}
                </h2>
                <p className="mt-3 max-w-2xl text-[15px] leading-[1.7] text-[#94A3B8]">
                  {category.description}
                </p>
              </div>
              <div className="flex flex-col gap-12">
              {category.subCategories.map((sub) => (
                <div
                  key={sub.id}
                  id={`${category.id}-${sub.id}`}
                  data-subcategory
                  /* Clears both the fixed header (64px) and the sticky toolbar,
                     so an anchored sub-category never lands underneath either. */
                  className="scroll-mt-[164px]"
                >
                  {/* Sub-category header */}
                  <h3 className="mb-5 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[2px] text-[#94A3B8]">
                    <span className={cn("h-3.5 w-[2px] rounded-full", ACCENT_BG[category.accent])} />
                    {sub.name}
                  </h3>

                  <StaggerGroup
                    as="div"
                    itemSelector="[data-stagger-item]"
                    stagger={0.05}
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                  >
                    {sub.products.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        data-stagger-item
                        data-cursor-interactive
                        aria-label={`View details for ${product.title}`}
                        onClick={() => setSelected({ product, category, subCategory: sub })}
                        onMouseEnter={(event) => {
                          event.currentTarget.style.boxShadow = `0 10px 22px -6px ${ACCENT_GLOW[category.accent]}`;
                        }}
                        onMouseLeave={(event) => {
                          event.currentTarget.style.boxShadow = "";
                        }}
                        className={cn(
                          "group relative flex flex-col overflow-hidden rounded-lg border border-border border-t-[3px] bg-card text-left transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/60 focus-visible:ring-offset-2 focus-visible:ring-offset-navy2",
                          ACCENT_BORDER[category.accent]
                        )}
                      >
                        <div className="relative h-44 w-full overflow-hidden">
                          <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/45 to-transparent" />
                        </div>

                        <div className="flex flex-1 flex-col p-5">
                          <h4 className="mb-2 font-display text-[17px] font-extrabold leading-snug text-white">
                            {product.title}
                          </h4>
                          <p className="line-clamp-3 text-[13px] leading-[1.65] text-muted">
                            {product.writeUp}
                          </p>
                          <span
                            className={cn(
                              "mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold transition-transform duration-300 group-hover:translate-x-0.5",
                              ACCENT_TEXT[category.accent]
                            )}
                          >
                            View details
                            <span aria-hidden="true">→</span>
                          </span>
                        </div>
                      </button>
                    ))}
                  </StaggerGroup>
                </div>
              ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <ProductDetailModal selected={selected} onClose={() => setSelected(null)} />
    </>
  );
}
