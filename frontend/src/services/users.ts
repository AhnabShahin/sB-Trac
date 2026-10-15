// Admin user-management API boundary — same pattern as services/inquiries.ts.

import { ApiError, getAuthToken } from "@/services/auth";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  can_reset_passwords: boolean;
  can_edit_profiles: boolean;
  is_owner: boolean;
  created_at: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role?: string;
  is_active?: boolean;
  can_reset_passwords?: boolean;
  can_edit_profiles?: boolean;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  role?: string;
  is_active?: boolean;
  can_reset_passwords?: boolean;
  can_edit_profiles?: boolean;
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

export function listUsers(): Promise<{ data: AdminUser[] }> {
  return adminRequest("/admin/users");
}

export function createUser(payload: CreateUserPayload): Promise<{ data: AdminUser }> {
  return adminRequest("/admin/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateUser(id: number, payload: UpdateUserPayload): Promise<{ data: AdminUser }> {
  return adminRequest(`/admin/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function resetUserPassword(id: number, password: string): Promise<{ message: string }> {
  return adminRequest(`/admin/users/${id}/reset-password`, {
    method: "POST",
    body: JSON.stringify({ password }),
  });
}
