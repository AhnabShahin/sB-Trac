"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/admin/logout-button";
import { ProfileMenu } from "@/components/admin/profile-menu";
import { cn } from "@/lib/utils";

type IconProps = { className?: string };

function DashboardIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  );
}

function PagesIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 3h8l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M13 3v5h5" />
      <path d="M9 13h6M9 17h6" />
    </svg>
  );
}

function InquiriesIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 5h18v14H3z" />
      <path d="m3 6 9 7 9-7" />
    </svg>
  );
}

function UsersIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.3 2.9-6 6.5-6s6.5 2.7 6.5 6" />
      <path d="M16.5 4.6a3.5 3.5 0 0 1 0 6.9" />
      <path d="M19.5 20c0-2.6-1.8-4.8-4.3-5.6" />
    </svg>
  );
}

function MenuIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function SettingsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.3.56.86.94 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </svg>
  );
}

const ICONS = { dashboard: DashboardIcon, pages: PagesIcon, inquiries: InquiriesIcon, users: UsersIcon, menu: MenuIcon, settings: SettingsIcon } as const;

const NAV: { label: string; href: string; icon: keyof typeof ICONS; enabled: boolean }[] = [
  { label: "Dashboard", href: "/dashboard", icon: "dashboard", enabled: true },
  { label: "Pages", href: "/pages", icon: "pages", enabled: true },
  { label: "Inquiries", href: "/inquiries", icon: "inquiries", enabled: true },
  { label: "Users", href: "/users", icon: "users", enabled: true },
  { label: "Settings", href: "/settings", icon: "settings", enabled: true },
];

function titleFor(pathname: string): string {
  if (pathname.startsWith("/pages")) return "Pages";
  if (pathname.startsWith("/inquiries")) return "Inquiries";
  if (pathname.startsWith("/users")) return "Users";
  if (pathname.startsWith("/settings")) return "Settings";
  if (pathname.startsWith("/dashboard")) return "Dashboard";
  return "Admin Panel";
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    try {
      // Sync the persisted collapse preference after mount (not a lazy initial
      // state, which would mismatch the server-rendered expanded sidebar).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCollapsed(localStorage.getItem("btel-admin-collapsed") === "1");
    } catch {
      // storage blocked (private mode) — fall back to expanded
    }
  }, []);

  function toggleCollapsed() {
    setCollapsed((c) => {
      const next = !c;
      try {
        localStorage.setItem("btel-admin-collapsed", next ? "1" : "0");
      } catch {
        // ignore
      }
      return next;
    });
  }

  return (
    // Anchored to the viewport so `main` is a real bounded scroll container (the
    // admin root is a shrinking flex child of the body flex-column, so h-screen
    // collapses to 0 there). This keeps the header + sidebar fixed and scrolls
    // only the content, which is what the editor's sticky bars hang off.
    <div className="fixed inset-0 flex overflow-hidden bg-navy text-offwhite">
      {/* Mobile scrim */}
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex shrink-0 flex-col border-r border-border bg-navy2 transition-[width,transform] duration-300 ease-out md:static md:translate-x-0",
          collapsed ? "w-64 md:w-[76px]" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className={cn("flex h-16 items-center border-b border-border", collapsed ? "md:justify-center md:px-0 px-5" : "px-5")}>
          <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex min-w-0 items-center gap-2.5">
            <Image src="/assets/logos/btrac-mark.png" alt="" width={28} height={28} className="h-7 w-7 shrink-0 object-contain" />
            <span className={cn("truncate font-display text-sm font-bold tracking-wide text-offwhite", collapsed && "md:hidden")}>
              B-TEL Admin
            </span>
          </Link>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto p-3">
          {NAV.map((item) => {
            const Icon = ICONS[item.icon];
            const active = item.enabled && pathname.startsWith(item.href);
            if (!item.enabled) {
              return (
                <span
                  key={item.label}
                  aria-disabled
                  title={collapsed ? `${item.label} — coming soon` : "Coming soon"}
                  className={cn(
                    "flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted/50",
                    collapsed && "md:justify-center md:px-0",
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className={cn("flex-1", collapsed && "md:hidden")}>{item.label}</span>
                  <span className={cn("rounded bg-border/60 px-1.5 py-0.5 text-[10px] uppercase tracking-wide", collapsed && "md:hidden")}>
                    soon
                  </span>
                </span>
              );
            }
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active ? "bg-teal/15 text-teal-light" : "text-offwhite/80 hover:bg-white/5 hover:text-offwhite",
                  collapsed && "md:justify-center md:px-0",
                )}
              >
                {active ? <span className="absolute left-0 top-1/2 h-6 -translate-y-1/2 rounded-r bg-teal" style={{ width: 3 }} /> : null}
                <Icon className="h-5 w-5 shrink-0" />
                <span className={cn("truncate", collapsed && "md:hidden")}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-border p-3">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            title={collapsed ? "Back to site" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium text-muted transition-colors hover:bg-white/5 hover:text-offwhite",
              collapsed && "md:justify-center md:px-0",
            )}
          >
            <span className="shrink-0 text-base leading-none">←</span>
            <span className={cn(collapsed && "md:hidden")}>Back to site</span>
          </Link>
          {/* Desktop collapse toggle */}
          <button
            type="button"
            onClick={toggleCollapsed}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "hidden w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium text-muted transition-colors hover:bg-white/5 hover:text-offwhite md:flex",
              collapsed && "md:justify-center md:px-0",
            )}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={cn("h-5 w-5 shrink-0 transition-transform", collapsed && "rotate-180")}>
              <path d="M15 6l-6 6 6 6" />
            </svg>
            <span className={cn(collapsed && "md:hidden")}>Collapse</span>
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="z-30 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border bg-navy2/70 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:text-offwhite md:hidden"
            >
              <MenuIcon className="h-5 w-5" />
            </button>
            <h1 className="font-display text-base font-semibold tracking-wide text-offwhite">
              {titleFor(pathname)}
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <ProfileMenu />
            <LogoutButton />
          </div>
        </header>
        {/* No top padding here: the editor's sticky toolbar pins to `top-0`, and a
            top padding would leave a band above it where scrolled content shows
            through. Pages that need top breathing room add their own `pt-*`. */}
        <main className="flex-1 overflow-y-auto px-4 pb-10 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
