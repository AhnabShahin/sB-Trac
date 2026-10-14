"use client";

import { useRouter } from "next/navigation";
import { clearAuthCookie } from "@/services/auth";

export function LogoutButton() {
  const router = useRouter();

  function handleLogout() {
    clearAuthCookie();
    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:border-teal/50 hover:text-offwhite"
    >
      Sign out
    </button>
  );
}
