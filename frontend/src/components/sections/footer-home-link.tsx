"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { lenisStore } from "@/lib/lenis-instance";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * The footer's home link.
 *
 * A plain `<Link href="/">` navigates, but when the reader is already on the
 * homepage the router has nowhere to go, so the click did nothing and left them
 * stranded at the bottom of the page. Only that case is intercepted; from any
 * other route the navigation is left to the router, which already lands at the
 * top of a freshly routed page.
 *
 * The scroll goes through Lenis, which owns the scroll position on this site,
 * matching `BackToTopButton`.
 */
export function FooterHomeLink({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();

  return (
    <Link
      href="/"
      onClick={(event) => {
        if (pathname !== "/") return;
        event.preventDefault();

        if (lenisStore.current) {
          lenisStore.current.scrollTo(0, { duration: reducedMotion ? 0 : 1.2 });
        } else {
          window.scrollTo({
            top: 0,
            behavior: reducedMotion ? "auto" : "smooth",
          });
        }
      }}
      data-cursor-interactive
      aria-label="B-Trac Engineering — back to top of homepage"
      className={className}
    >
      {children}
    </Link>
  );
}