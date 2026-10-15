// Single boundary between the app and the Laravel auth API. Components and the
// proxy import from here; nothing else should hardcode the API host, the token
// shape, or the cookie name.

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

// Readable by the Next proxy (`request.cookies`), so it cannot be HttpOnly —
// the token arrives in a client-side fetch response and is set from JS. For a
// single-admin portal this is an accepted trade-off; see README for how to move
// token storage behind an HttpOnly cookie via a Route Handler.
export const AUTH_COOKIE = "btel_token";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
  can_reset_passwords?: boolean;
  can_edit_profiles?: boolean;
  is_owner?: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

// Thrown for any non-2xx response. `fieldErrors` carries Laravel's 422
// validation map (`{ email: ["..."], ... }`) when present.
export class ApiError extends Error {
  status: number;
  fieldErrors?: Record<string, string[]>;

  constructor(
    message: string,
    status: number,
    fieldErrors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export async function loginUser(
  payload: LoginPayload,
): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(
      data?.message ?? "Sign in failed. Please try again.",
      res.status,
      data?.errors,
    );
  }

  return data as AuthResponse;
}

export function setAuthCookie(token: string): void {
  if (typeof document === "undefined") return;
  const secure = location.protocol === "https:" ? "; Secure" : "";
  // 7 days; the token itself has no server-side expiry in this phase.
  const maxAge = 60 * 60 * 24 * 7;
  document.cookie = `${AUTH_COOKIE}=${encodeURIComponent(
    token,
  )}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}

export function clearAuthCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}

// The signed-in user, from the Sanctum `/user` route. Used client-side to
// gate UI (e.g. only show "reset password" for others when permitted).
export async function getCurrentUser(): Promise<AuthUser> {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE}/user`, {
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(data?.message ?? "Could not load your session.", res.status);
  }

  return data as AuthUser;
}

export function getAuthToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${AUTH_COOKIE}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}
