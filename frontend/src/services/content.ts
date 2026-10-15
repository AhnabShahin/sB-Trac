// Client-side admin content API. Mirrors services/auth.ts: a single boundary
// for the page-management endpoints, each call carrying the Sanctum bearer
// token read from the auth cookie.

import { ApiError, getAuthToken } from "@/services/auth";
import type { HomeSections } from "@/data/content-types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export interface PageListEntry {
  slug: string;
  title: string;
  url: string;
  editable: boolean;
  sections: string[];
  /** "products" = a products-services sub-page, "global" = site-wide chrome (header/footer). Omitted = a main page. */
  group?: "products" | "global";
  /** Slug of the page this one is nested under in the admin list (e.g. sub-pages under "products-services"). */
  parent?: string;
}

export interface SectionMeta {
  updated_at: string | null;
  updated_by: { id: number; name: string } | null;
}

export interface AdminPage<T = Record<string, unknown>> {
  slug: string;
  title: string | null;
  editable?: boolean;
  sectionKeys?: string[];
  sections: T;
  /** Per-section "who last saved this, and when" — keyed the same as `sections`. */
  sectionsMeta?: Record<string, SectionMeta>;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(
      data?.message ?? "Request failed.",
      res.status,
      data?.errors,
    );
  }

  return data as T;
}

export function listPages(): Promise<{ pages: PageListEntry[] }> {
  return request("/admin/pages");
}

export function getPage<T = HomeSections>(slug: string): Promise<AdminPage<T>> {
  return request(`/admin/pages/${slug}`);
}

export function savePage<T = HomeSections>(
  slug: string,
  body: { title?: string | null; sections: T },
): Promise<AdminPage<T>> {
  return request(`/admin/pages/${slug}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function getDemo<T = HomeSections>(
  slug: string,
): Promise<{ title?: string; sections: T }> {
  return request(`/admin/pages/${slug}/demo`);
}

export function applyDemo<T = HomeSections>(
  slug: string,
): Promise<AdminPage<T>> {
  return request(`/admin/pages/${slug}/apply-demo`, { method: "POST" });
}
