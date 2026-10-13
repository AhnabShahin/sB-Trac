"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Project, ProjectFilterTag } from "@/data/company";
import { ProjectDetailModal } from "@/components/ui/project-detail-modal";
import { lenisStore } from "@/lib/lenis-instance";
import { cn } from "@/lib/utils";

const FILTERS: { label: string; value: ProjectFilterTag | "all" }[] = [
  { label: "All Projects", value: "all" },
  { label: "Solar", value: "solar" },
  { label: "Substation", value: "substation" },
  { label: "MEP / EPC", value: "mep" },
  { label: "Water Treatment", value: "water-treatment" },
];

export type ProjectFilterValue = (typeof FILTERS)[number]["value"];

/**
 * Name of the DOM event the Track Record cards dispatch to filter this grid.
 * Those cards are a sibling section in the same server-rendered page, so they
 * signal across the boundary instead of sharing state — this keeps the grid the
 * single owner of the active filter rather than lifting it into a common parent.
 */
export const PORTFOLIO_FILTER_EVENT = "btel:portfolio-filter";

/**
 * Brings the portfolio into view. Lenis takes over the scroll position, so a
 * native hash jump (or a programmatic scroll) has to be re-asserted through it,
 * otherwise the two fight and the target lands in the wrong place.
 */
function scrollToPortfolio() {
  const section = document.getElementById("portfolio");
  if (!section) return;
  requestAnimationFrame(() => {
    if (lenisStore.current) {
      lenisStore.current.scrollTo(section, { offset: -80 });
    } else {
      section.scrollIntoView({ block: "start" });
    }
  });
}

/** Maps an incoming deep-link value (e.g. `/projects?filter=solar`) to a real filter, falling back to "all". */
function parseProjectFilter(value: string | null | undefined): ProjectFilterValue {
  return FILTERS.some((filter) => filter.value === value) ? (value as ProjectFilterValue) : "all";
}

// URL query is an external system: read it through useSyncExternalStore so the server snapshot
// ("") hydrates cleanly to the real query instead of throwing off hydration or needing setState
// in an effect. No-op subscribe — the query only changes when the route remounts.
const subscribeToUrlSearch = () => () => {};
const getUrlSearch = () => window.location.search;
const getServerUrlSearch = () => "";

const FILTER_ACTIVE = {
  all: "bg-blue-light text-navy",
  substation: "bg-blue-light text-navy",
  solar: "bg-amber text-white",
  mep: "bg-teal text-white",
  "water-treatment": "bg-purple text-white",
  "after-sales": "bg-cyan text-white",
} as const;

const STATUS_STYLES = {
  Ongoing: "bg-teal/[0.15] text-teal",
  Completed: "bg-blue-light/[0.15] text-blue-light",
} as const;

export function ProjectPortfolioGrid({ projects }: { projects: Project[] }) {
  const urlSearch = useSyncExternalStore(subscribeToUrlSearch, getUrlSearch, getServerUrlSearch);
  const linkedFilter = useMemo(
    () => parseProjectFilter(new URLSearchParams(urlSearch).get("filter")),
    [urlSearch]
  );
  // A pill click overrides the deep-linked value; until then the URL filter wins.
  const [selection, setSelection] = useState<ProjectFilterValue | null>(null);
  const active = selection ?? linkedFilter;
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    // Home showcase cards deep link to `/projects?filter=solar#portfolio`. Lenis takes over the
    // scroll position on mount, so the browser's hash scroll has to be re-asserted once it's live.
    if (linkedFilter === "all") return;
    scrollToPortfolio();
  }, [linkedFilter, reducedMotion]);

  // Track Record cards further up this same page filter the grid and scroll here.
  // `selection` (rather than the URL) is what gets set, so the choice sticks even
  // if the visitor then edits the filter pills above.
  useEffect(() => {
    const onJump = (event: Event) => {
      setSelection((event as CustomEvent<ProjectFilterValue>).detail);
      scrollToPortfolio();
    };
    window.addEventListener(PORTFOLIO_FILTER_EVENT, onJump);
    return () => window.removeEventListener(PORTFOLIO_FILTER_EVENT, onJump);
  }, []);

  const filtered = useMemo(() => {
    const byFilter =
      active === "all"
        ? projects
        : projects.filter((p) => (p.filterTag ?? p.categorySlug) === active);

    return [...byFilter].sort((a, b) => {
      if (a.valueCr === undefined && b.valueCr === undefined) return 0;
      if (a.valueCr === undefined) return 1;
      if (b.valueCr === undefined) return -1;
      return a.valueCr - b.valueCr;
    });
  }, [projects, active]);

  return (
    <div>
      {/* The "Full Portfolio" eyebrow row was a `flex items-end justify-between` row that
          only ever held this one label, so it was spanning a full width to place a
          single short string. It is a plain block now. */}
      <div className="mb-8 text-[11px] font-bold uppercase tracking-[2px] text-teal">
        Full Portfolio
      </div>

      {/* The "Showing all projects" / "Showing N projects" counter that used to sit
          to the right of the heading is gone. The heading row now holds the heading
          alone, so it is no longer a flex row spanning both sides. */}
      <div className="mb-8">
        <h2 className="font-display text-[clamp(32px,3.6vw,44px)] font-extrabold leading-[1.1] text-white">
          Project Showcase
        </h2>
      </div>

      {/* The "Filter:" label that used to lead this row is gone. The pills carry
          their own category names and the active one is filled, so the row reads
          as a filter row without being told so, and the pill row now starts flush
          with the container's own left padding rather than being pushed in by the
          label's `mr-2`. */}
      <div className="mb-12 flex flex-wrap gap-2 rounded-lg border border-border bg-card px-5 py-4">
        {FILTERS.map((filter) => (
          <button
            key={filter.value}
            type="button"
            data-cursor-interactive
            onClick={() => setSelection(filter.value)}
            className={cn(
              "relative rounded px-4 py-1.5 text-[13px] font-medium transition-colors",
              active === filter.value
                ? "text-white"
                : "text-muted hover:bg-white/5 hover:text-white"
            )}
          >
            {active === filter.value && (
              <motion.span
                layoutId="filter-pill-bg"
                transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 35 }}
                className={cn("absolute inset-0 -z-1 rounded", FILTER_ACTIVE[filter.value])}
              />
            )}
            {filter.label}
          </button>
        ))}
      </div>

      <motion.div layout={!reducedMotion} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((project) => {
            const imageSrc = project.image || "/assets/projects/p-01.jpg";
            const webpSrc = project.webpImage || "/assets/projects/p-01.webp";

            return (
              <motion.article
                key={project.id}
                layout={!reducedMotion}
                initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reducedMotion ? undefined : { opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                whileHover={reducedMotion ? undefined : { y: -5 }}
                role="button"
                tabIndex={0}
                aria-haspopup="dialog"
                onClick={() => setSelectedProject(project)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelectedProject(project);
                  }
                }}
                data-cursor-interactive
                className={cn(
                  "group cursor-pointer overflow-hidden rounded-[10px] border border-border bg-card transition-colors hover:border-teal/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/60 focus-visible:ring-offset-2 focus-visible:ring-offset-navy2",
                  project.featured && "sm:col-span-2"
                )}
              >
                {/* Photo Band (180-200px tall for standard cards, 300px for featured) */}
                <div
                  className={cn(
                    "relative w-full overflow-hidden bg-navy3",
                    project.featured ? "h-[300px]" : "h-[190px]"
                  )}
                >
                  <picture className="relative block h-full w-full">
                    <source srcSet={webpSrc} type="image/webp" />
                    <Image
                      src={imageSrc}
                      alt={project.title}
                      fill
                      sizes={project.featured ? "(min-width: 640px) 100vw, 100vw" : "(min-width: 640px) 50vw, 100vw"}
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent opacity-90"
                  />
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span className="rounded bg-navy/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[1px] text-teal backdrop-blur-md">
                      {project.statusLabel.split("·")[0].trim()}
                    </span>
                  </div>
                </div>

                <div className="p-6 pt-2">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-muted">
                      {project.statusLabel.split("·")[1]?.trim()}
                    </span>
                  </div>
                  <h3
                    className={cn(
                      "mb-1.5 font-display font-bold leading-tight text-white transition-colors group-hover:text-teal",
                      project.featured ? "text-[26px]" : "text-xl"
                    )}
                  >
                    {project.title}
                  </h3>
                  <p className="mb-4 text-[13px] text-[#94A3B8]">{project.client}</p>

                  {project.featured && project.description && (
                    <p className="mb-4 text-[13px] leading-[1.6] text-[#94A3B8]">
                      {project.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <span className="font-display text-[20px] font-extrabold text-white">
                      {project.metric}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.3px]",
                        STATUS_STYLES[project.status]
                      )}
                    >
                      {project.status}
                    </span>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </motion.div>

      <ProjectDetailModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
}
