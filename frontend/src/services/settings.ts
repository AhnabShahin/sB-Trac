// Site-settings API boundary — same pattern as services/users.ts.

import { ApiError, getAuthToken } from "@/services/auth";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export interface SiteSettings {
  identity: {
    siteName: string;
    tagline: string;
    copyright: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  social: {
    facebook: string;
    linkedin: string;
    youtube: string;
    whatsapp: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    ogImage: string;
  };
}

async function adminRequest<T>(path: string, init?: RequestInit): Promise<T> {
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
    throw new ApiError(data?.message ?? "Request failed.", res.status, data?.errors);
  }

  return data as T;
}

export function getSettings(): Promise<{ settings: SiteSettings }> {
  return adminRequest("/admin/settings");
}

export function saveSettings(settings: SiteSettings): Promise<{ settings: SiteSettings }> {
  return adminRequest("/admin/settings", {
    method: "PUT",
    body: JSON.stringify({ settings }),
  });
}

/**
 * Public, server-side read of site settings (no auth). Used by the root layout
 * for SEO defaults. Returns null if the backend is unreachable or unseeded, so
 * callers fall back to their own hardcoded defaults.
 */
export async function getPublicSettings(): Promise<SiteSettings | null> {
  try {
    const res = await fetch(`${API_BASE}/settings`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { settings?: SiteSettings };
    return data.settings ?? null;
  } catch {
    return null;
  }
}
