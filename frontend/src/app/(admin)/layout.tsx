import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { LogoutButton } from "@/components/admin/logout-button";

export const metadata: Metadata = {
  title: "Admin — B-TEL Engineering",
  robots: { index: false, follow: false },
};

// Nav skeleton. Only Dashboard is live in this phase; the rest are placeholders
// for the sections that go dynamic later (CMS-backed menus, content, settings).
const NAV = [
  { label: "Dashboard", href: "/dashboard", enabled: true },
  { label: "Content", href: "#", enabled: false },
  { label: "Menu", href: "#", enabled: false },
  { label: "Settings", href: "#", enabled: false },
];

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-navy text-offwhite">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-navy2 md:flex">
        <div className="flex h-16 items-center gap-2.5 border-b border-border px-6">
          <Image
            src="/assets/logos/btrac-mark.png"
            alt=""
            width={28}
            height={28}
            className="h-7 w-auto"
          />
          <span className="font-display text-sm font-bold tracking-wide">
            B-TEL Admin
          </span>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {NAV.map((item) =>
            item.enabled ? (
              <Link
                key={item.label}
                href={item.href}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-offwhite transition-colors hover:bg-teal/10 hover:text-teal-light"
              >
                {item.label}
              </Link>
            ) : (
              <span
                key={item.label}
                aria-disabled
                title="Coming soon"
                className="flex cursor-not-allowed items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-muted/60"
              >
                {item.label}
                <span className="rounded bg-border/60 px-1.5 py-0.5 text-[10px] uppercase tracking-wide">
                  soon
                </span>
              </span>
            ),
          )}
        </nav>
        <div className="border-t border-border p-4">
          <Link
            href="/"
            className="text-xs text-muted transition-colors hover:text-offwhite"
          >
            ← Back to site
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-navy2/60 px-6 backdrop-blur-sm">
          <h1 className="font-display text-base font-semibold tracking-wide text-offwhite">
            Admin Panel
          </h1>
          <LogoutButton />
        </header>
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
