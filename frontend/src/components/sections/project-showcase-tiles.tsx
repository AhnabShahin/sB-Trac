import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/company";
import { SERVICE_CATEGORIES, type ServiceCategorySlug } from "@/data/services";
import { StaggerGroup } from "@/components/ui/stagger-group";
import { cn } from "@/lib/utils";

const ACCENT_TEXT = {
  blue: "text-blue-light",
  amber: "text-amber-dark",
  teal: "text-teal",
  purple: "text-purple-dark",
  cyan: "text-cyan",
} as const;

const ACCENT_BORDER = {
  blue: "border-t-blue",
  amber: "border-t-amber",
  teal: "border-t-teal",
  purple: "border-t-purple",
  cyan: "border-t-cyan",
} as const;

const CATEGORY_IMAGES: Record<ServiceCategorySlug, { jpg: string; webp: string }> = {
  substation: { jpg: "/assets/hero/substation.jpg", webp: "/assets/hero/substation.webp" },
  solar: { jpg: "/assets/hero/solar.jpg", webp: "/assets/hero/solar.webp" },
  mep: { jpg: "/assets/hero/mep.jpg", webp: "/assets/hero/mep.webp" },
  "water-treatment": { jpg: "/assets/hero/water.jpg", webp: "/assets/hero/water.webp" },
  "after-sales": { jpg: "/assets/hero/after-sales.jpg", webp: "/assets/hero/after-sales.webp" },
};

// Fixed order so the grid always renders the same four cards regardless of which
// categories happen to have project entries. Each card deep-links to /projects?filter=<slug>.
const SHOWCASE_SLUGS: ServiceCategorySlug[] = ["substation", "solar", "mep", "water-treatment"];

/**
 * Curated headline figures for the four showcase cards. The project list itself is a
 * small editorial sample, not the full delivery record, so the counts and flagship
 * references are pinned here rather than derived from `projects`. Anything omitted
 * falls back to the derived highest-value project for that category.
 */
interface ShowcaseOverride {
  count: string;
  /** Unit rendered after the count, e.g. "projects" or "Customer Delivered". */
  countSuffix: string;
  label?: string;
  title?: string;
  metric?: string;
}

const SHOWCASE_OVERRIDES: Partial<Record<ServiceCategorySlug, ShowcaseOverride>> = {
  substation: {
    count: "266+",
    countSuffix: "projects",
    label: "Highest Value",
    title: "Completed Substation & Switchgear System at MJL, Bangladesh",
    metric: "BDT 5.82 Cr",
  },
  solar: {
    count: "21+",
    countSuffix: "projects",
    label: "Highest Value",
    title: "5MWP Solar Power Plant for Akij Textile Mills Ltd.",
    metric: "BDT 7 Cr",
  },
  mep: {
    count: "96+",
    countSuffix: "projects",
  },
  "water-treatment": {
    count: "90+",
    countSuffix: "Customer Delivered",
    label: "Value",
    title: "1.5+ Tones",
    metric: "BDT 18.5 Lac",
  },
};

function buildShowcase(projects: Project[]) {
  return SHOWCASE_SLUGS.map((slug) => {
    const list = projects.filter((project) => project.categorySlug === slug);
    const highest = list.reduce<Project | null>((best, p) => {
      if (p.valueCr == null) return best;
      if (best == null || (best.valueCr ?? 0) < p.valueCr) return p;
      return best;
    }, null);

    return {
      category: SERVICE_CATEGORIES[slug],
      count: SHOWCASE_OVERRIDES[slug]?.count ?? String(list.length),
      countSuffix:
        SHOWCASE_OVERRIDES[slug]?.countSuffix ??
        `project${list.length === 1 ? "" : "s"}`,
      label: SHOWCASE_OVERRIDES[slug]?.label ?? "Highest Value",
      title: SHOWCASE_OVERRIDES[slug]?.title ?? highest?.title,
      metric: SHOWCASE_OVERRIDES[slug]?.metric ?? highest?.metric,
    };
  });
}

export function ProjectShowcaseTiles({ projects }: { projects: Project[] }) {
  const showcase = buildShowcase(projects);

  return (
    <StaggerGroup
      as="div"
      itemSelector="[data-stagger-item]"
      className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {showcase.map(({ category, count, countSuffix, label, title, metric }) => {
        const bgImg = CATEGORY_IMAGES[category.slug];
        return (
          <Link
            key={category.slug}
            href={`/projects?filter=${category.slug}#portfolio`}
            data-stagger-item
            data-cursor-interactive
            aria-label={`View all ${category.label} projects`}
            className={cn(
              "group relative block overflow-hidden rounded-lg border border-border border-t-[3px] bg-card px-6 py-6 transition-all duration-300 hover:-translate-y-1 hover:border-teal/30 hover:shadow-[0_16px_36px_rgba(0,0,0,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/60 focus-visible:ring-offset-2 focus-visible:ring-offset-navy2",
              ACCENT_BORDER[category.accent]
            )}
          >
            {/* Background Image Accent */}
            {bgImg && (
              <div className="pointer-events-none absolute inset-0 opacity-15 transition-opacity duration-500 group-hover:opacity-25">
                <picture className="relative block h-full w-full">
                  <source srcSet={bgImg.webp} type="image/webp" />
                  <Image
                    src={bgImg.jpg}
                    alt=""
                    fill
                    sizes="400px"
                    className="object-cover object-center"
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
              </div>
            )}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card via-card/85 to-card/60"
            />

            <div className="relative z-10">
              <div className="mb-1 text-[11px] font-bold uppercase tracking-[1.5px] text-muted">
                {category.label}
              </div>
              <div className={cn("mb-4 font-display text-3xl font-extrabold", ACCENT_TEXT[category.accent])}>
                {count} <span className="text-base font-semibold text-muted">{countSuffix}</span>
              </div>
              {title ? (
                <div className="border-t border-border/80 pt-3">
                  <div className="mb-1 text-[10px] font-bold uppercase tracking-[1.5px] text-muted">
                    {label}
                  </div>
                  <div className="text-sm font-semibold text-white">{title}</div>
                  {metric && <div className="mt-0.5 text-[13px] text-muted">{metric}</div>}
                </div>
              ) : (
                <div className="border-t border-border/80 pt-3 text-[13px] text-muted">
                  Value details available on request
                </div>
              )}
            </div>
          </Link>
        );
      })}
    </StaggerGroup>
  );
}
