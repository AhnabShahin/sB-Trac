// Inquiry API boundary. `submitInquiry` is the public contact-form POST (no
// auth). The rest are admin reads/writes, carrying the Sanctum bearer token
// from the auth cookie — same pattern as services/content.ts.

import { ApiError, getAuthToken } from "@/services/auth";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export interface InquiryPayload {
  full_name: string;
  company: string;
  email: string;
  phone?: string;
  service: string;
  location?: string;
  budget?: string;
  message: string;
  newsletter?: boolean;
}

export type InquiryStatus = "new" | "read" | "archived";

export interface Inquiry {
  id: number;
  full_name: string;
  company: string;
  email: string;
  phone: string | null;
  service: string;
  location: string | null;
  budget: string | null;
  message: string;
  newsletter: boolean;
  status: InquiryStatus;
  ip_address: string | null;
  created_at: string;
  updated_at: string;
}

export interface InquiryListResponse {
  data: Inquiry[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
  };
  counts: { all: number; new: number; read: number; archived: number };
  services: string[];
}

export interface InquiryFilters {
  status?: InquiryStatus | "";
  service?: string;
  q?: string;
  page?: number;
  per_page?: number;
}

// Public submit — no token.
export async function submitInquiry(
  payload: InquiryPayload,
): Promise<{ message: string; id: number }> {
  const res = await fetch(`${API_BASE}/inquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(data?.message ?? "Submission failed.", res.status, data?.errors);
  }

  return data as { message: string; id: number };
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

export function listInquiries(filters: InquiryFilters = {}): Promise<InquiryListResponse> {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.service) params.set("service", filters.service);
  if (filters.q) params.set("q", filters.q);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.per_page) params.set("per_page", String(filters.per_page));
  const qs = params.toString();
  return adminRequest(`/admin/inquiries${qs ? `?${qs}` : ""}`);
}

export function updateInquiryStatus(
  id: number,
  status: InquiryStatus,
): Promise<{ data: Inquiry }> {
  return adminRequest(`/admin/inquiries/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function deleteInquiry(id: number): Promise<{ message: string }> {
  return adminRequest(`/admin/inquiries/${id}`, { method: "DELETE" });
}
