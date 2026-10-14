import { cache } from "react";
import type { HomeSections } from "@/data/content-types";

// Phase-2 data boundary for public pages. Server Components call these; the
// implementation fetches the Laravel API and nothing else. There is no
// demo/fallback here by design — an unseeded page returns null and its section
// renders nothing (see CLAUDE.md: "No demo ba fallback content on the frontend").

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export interface PageContent<T = Record<string, unknown>> {
  slug: string;
  title: string | null;
  sections: T;
}

async function fetchPage<T>(slug: string): Promise<PageContent<T> | null> {
  try {
    // `no-store`: edits made in the admin panel must show on the next request
    // without a deploy. Revalidation/tags can tighten this once editing settles.
    const res = await fetch(`${API_BASE}/pages/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as PageContent<T>;
  } catch {
    // Backend unreachable: treat as "no content" rather than crashing the render.
    return null;
  }
}

// Cached per request: the home page renders many sections, each of which calls
// this. React's cache() dedupes them to a single fetch per render.
export const getHomeContent = cache(
  async (): Promise<HomeSections | null> => {
    const page = await fetchPage<HomeSections>("home");
    return page?.sections ?? null;
  },
);
