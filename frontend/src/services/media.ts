// Media upload/delete boundary for the editor. Files land on the Laravel public
// storage disk immediately on upload (so the live preview shows the real URL);
// the content JSON that references them is persisted separately on Save.

import { ApiError, getAuthToken } from "@/services/auth";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export async function uploadMedia(file: File, slug: string): Promise<string> {
  const token = getAuthToken();
  const body = new FormData();
  body.append("file", file);
  body.append("slug", slug);

  const res = await fetch(`${API_BASE}/admin/media`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      // No Content-Type: the browser sets the multipart boundary.
    },
    body,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(
      data?.message ?? "Upload failed.",
      res.status,
      data?.errors,
    );
  }
  return data.url as string;
}

// Best-effort: deleting a replaced/removed file should never block the edit.
export async function deleteMedia(url: string): Promise<void> {
  const token = getAuthToken();
  if (!url || !url.includes("/storage/media/")) return;
  try {
    await fetch(`${API_BASE}/admin/media`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ url }),
    });
  } catch {
    // Orphaned file is harmless; ignore.
  }
}

export function isManagedMedia(url: string): boolean {
  return typeof url === "string" && url.includes("/storage/media/");
}
