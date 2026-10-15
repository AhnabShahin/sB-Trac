import { cache } from "react";
import type {
  AfterSalesSections,
  ClientsSections,
  ContactSections,
  FooterContent,
  HeaderContent,
  HomeSections,
  MepSections,
  PartnersSections,
  ProductsServicesSections,
  ProjectsSections,
  SolarSections,
  SubstationSections,
  WaterTreatmentSections,
} from "@/data/content-types";

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

// Cached per request and per slug: a page renders many sections, each of which
// calls its getter. React's cache() dedupes them to a single fetch per render
// for each distinct page.
const getPageSections = cache(
  async (slug: string): Promise<Record<string, unknown> | null> => {
    const page = await fetchPage<Record<string, unknown>>(slug);
    return page?.sections ?? null;
  },
);

export async function getHomeContent(): Promise<HomeSections | null> {
  return (await getPageSections("home")) as HomeSections | null;
}

export async function getProductsServicesContent(): Promise<ProductsServicesSections | null> {
  return (await getPageSections(
    "products-services",
  )) as ProductsServicesSections | null;
}

export async function getProjectsContent(): Promise<ProjectsSections | null> {
  return (await getPageSections("projects")) as ProjectsSections | null;
}

export async function getPartnersContent(): Promise<PartnersSections | null> {
  return (await getPageSections("partners")) as PartnersSections | null;
}

export async function getClientsContent(): Promise<ClientsSections | null> {
  return (await getPageSections("clients")) as ClientsSections | null;
}

export async function getContactContent(): Promise<ContactSections | null> {
  return (await getPageSections("contact")) as ContactSections | null;
}

export async function getSubstationContent(): Promise<SubstationSections | null> {
  return (await getPageSections("substation")) as SubstationSections | null;
}

export async function getSolarContent(): Promise<SolarSections | null> {
  return (await getPageSections("solar")) as SolarSections | null;
}

export async function getMepContent(): Promise<MepSections | null> {
  return (await getPageSections("mep")) as MepSections | null;
}

export async function getWaterTreatmentContent(): Promise<WaterTreatmentSections | null> {
  return (await getPageSections(
    "water-treatment",
  )) as WaterTreatmentSections | null;
}

export async function getAfterSalesContent(): Promise<AfterSalesSections | null> {
  return (await getPageSections("after-sales")) as AfterSalesSections | null;
}

// Header/footer are site-wide chrome, not a routed page — they reuse the same
// slug-keyed posts/postmeta mechanism (slug "header" / "footer") purely as a
// convenient admin-editable key-value store, with the current static chrome as
// a client-side fallback so nav/footer can never disappear site-wide just
// because nobody has saved them in the admin yet (see site-header.tsx /
// site-footer.tsx).
export async function getHeaderContent(): Promise<HeaderContent | null> {
  return (await getPageSections("header")) as HeaderContent | null;
}

export async function getFooterContent(): Promise<FooterContent | null> {
  return (await getPageSections("footer")) as FooterContent | null;
}
