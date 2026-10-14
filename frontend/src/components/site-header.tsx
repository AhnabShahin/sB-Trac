"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { lenisStore } from "@/lib/lenis-instance";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  // Plain paths, no anchors. Every item lands on its page and scrolls to the top —
  // "Products & Services" used to carry `hash: "products"` to aim at the catalogue,
  // which left the URL as "/products-services#products". That was not wanted, so
  // the anchor and the `navHref` helper that appended it are both gone.
  { label: "Products & Services", href: "/products-services" },
  { label: "Projects", href: "/projects" },
  { label: "Partners", href: "/partners" },
  { label: "Clients", href: "/clients" },
];

const NAV_LINK_BASE_CLASS = "text-sm tracking-[0.3px] transition-colors";
const NAV_LINK_CLASS = "font-medium text-[#475569] hover:text-[#0E2A47]";
const NAV_LINK_ACTIVE_CLASS = "font-semibold text-[#0E2A47]";

const MOBILE_LINK_BASE_CLASS = "border-b border-[#E2E8F0] px-2 py-3.5 text-[15px]";
const MOBILE_LINK_CLASS = "font-medium text-[#475569] hover:text-teal-dark";
const MOBILE_LINK_ACTIVE_CLASS = "font-semibold text-teal-dark";

/**
 * `next/link` for the mobile menu items, so they animate and still route on the
 * client. These used to be plain `<a>`, which forced a full document reload for
 * every navigation — slow, and it handed the scroll position back to the
 * browser, which could restore an old offset instead of landing at the top.
 */
const MotionLink = motion.create(Link);

/** `/products-services` stays active on `/products-services`, `/products-services/solar`, … */
function isActivePath(pathname: string | null, href: string) {
  if (!pathname) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Renders the label twice into the same grid cell: the invisible bold copy
 * reserves the width of the bold (active) state, so a link turning bold — or the
 * active item changing on navigation — can never nudge its neighbours.
 */
function NavLabel({ label }: { label: string }) {
  return (
    <span className="grid">
      <span aria-hidden="true" className="invisible col-start-1 row-start-1 font-semibold">
        {label}
      </span>
      <span className="col-start-1 row-start-1">{label}</span>
    </span>
  );
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const reducedMotion = useReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  // Footer lives in each page's own tree (not the shared layout), so its DOM
  // node changes on every route change — re-query it whenever the route swaps.
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, [pathname]);

  // Clicking a nav item for the page you are already on must still take you to the
  // top of that page.
  //
  // `SmoothScrollProvider` resets scroll on every *route change*. But a same-route
  // click is a no-op for the router: no navigation, so `pathname` never changes and
  // that effect never runs. Clicking "Products & Services" while already on that
  // page used to do nothing at all, leaving the reader stranded wherever they had
  // scrolled to.
  //
  // Only an exact path match is intercepted. From any other route the click is left
  // alone so the router navigates normally — including from a child page
  // (/products-services/solar) to its parent listing, which is a real navigation
  // even though `isActivePath` reports both as active.
  //
  // The scroll goes through Lenis, matching `FooterHomeLink`, because a native
  // `window.scrollTo` is immediately overwritten by Lenis and appears to do nothing.
  const handleNavClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (pathname !== href) return;

      event.preventDefault();

      if (lenisStore.current) {
        lenisStore.current.scrollTo(0, { duration: reducedMotion ? 0 : 1.2, force: true });
      } else {
        window.scrollTo({
          top: 0,
          behavior: reducedMotion ? "auto" : "smooth",
        });
      }
    },
    [pathname, reducedMotion]
  );

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-100 flex h-16 items-center justify-between border-b border-[#E2E8F0] px-6 transition-[transform,opacity,box-shadow] duration-300 lg:px-12",
        // Off-white (`bg-offwhite`), the same token as the client logo band below the
        // hero, so the bar and the rail read as one light surface rather than a pale
        // strip stranded on a dark page.
        //
        // Still opaque, and still no `backdrop-blur`. The bar used to be `bg-navy/92`
        // + `backdrop-blur-md`, which means the browser had to snapshot and blur
        // whatever was painted behind it on every repaint. During a reload that
        // snapshot was taken before the page content had settled, which drew a pale
        // smear with a visible light seam around the wordmark. An opaque fill looks
        // identical here, cannot glitch, and costs no per-repaint snapshot.
        scrolled
          ? "bg-offwhite shadow-[0_2px_20px_rgba(2,6,17,0.10)]"
          : "bg-offwhite",
        footerVisible && !menuOpen && "-translate-y-full opacity-0"
      )}
      inert={(footerVisible && !menuOpen) || undefined}
    >
      <Link
        href="/"
        data-cursor-interactive
        aria-label="B-Trac Engineering — home"
        // The wordmark is a home link, so it needs the same same-route top-of-page
      // behaviour the nav gets — otherwise clicking it while already on the
      // homepage did nothing.
      onClick={(event) => handleNavClick(event, "/")}
      // The chip is gone. It used to be `border border-white/12 bg-white/[0.06]` +
        // `shadow-...` + `inset_0_1px_0_rgba(255,255,255,0.18)`, a frosted pane to
        // lift the wordmark off the navy bar. On off-white that whole treatment is
        // invisible or worse — a white border and a white fill on a near-white bar.
        //
        // It also removes the nested-backdrop-filter seam: the chip was itself a
        // backdrop-filtered element inside a backdrop-filtered bar, and the inner
        // one re-sampled the not-yet-settled header backdrop, which drew a bright
        // line round the wordmark on every reload.
        //
        // `logo.png` carries its own navy bar (`#203269`) behind the white wordmark
        // and has a fully transparent background outside it, so it needs no plate of
        // its own — it sits directly on the off-white bar, the same way the client
        // logos now sit directly on the off-white band.
        className="flex items-center rounded-lg transition-opacity duration-200 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-dark/60"
      >
        <Image
          src="/logo.png"
          alt="B-Trac Engineering"
          width={4712}
          height={435}
          // Served unoptimised, on purpose.
          //
          // The wordmark is line art — thin white strokes on a flat navy bar — and
          // Next negotiates AVIF first. Without a `sizes` prop Next assumes `100vw`
          // and hands the browser a 1920px AVIF for a logo that is displayed at
          // about 217px (`h-5`, 20px tall at this 10.83:1 aspect). That is a lossy
          // AVIF re-encode of dense lettering at a small size, followed by a further
          // 9x downscale in the browser. AVIF is poor at this: the fine strokes
          // blur and intermittently drop out, which reads as a letter missing from
          // the middle of "ENGINEERING".
          //
          // The source file is only 52KB, so there is nothing worth saving by
          // re-encoding it. Serving the original PNG as-is means the browser does a
          // single high-quality downscale with no intermediate lossy step, and the
          // wordmark renders exactly as drawn.
          unoptimized
          // `priority` is deprecated in Next 16 in favour of `preload`. The wordmark
          // is the first thing on screen and sits in a `fixed` bar, so it is the
          // LCP element — it must be requested in the first HTML paint, otherwise
          // the header renders with no logo at all for a frame on every reload.
          preload
          className="h-5 w-auto sm:h-6"
        />
      </Link>

      <div className="flex items-center gap-8">
        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = isActivePath(pathname, link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={(event) => handleNavClick(event, link.href)}
                data-cursor-interactive
                aria-current={active ? "page" : undefined}
                className={cn(NAV_LINK_BASE_CLASS, active ? NAV_LINK_ACTIVE_CLASS : NAV_LINK_CLASS)}
              >
                <NavLabel label={link.label} />
              </Link>
            );
          })}
        </nav>

        <Link
          href="/contact"
          onClick={(event) => handleNavClick(event, "/contact")}
          data-cursor-interactive
          className="hidden rounded-[4px] bg-teal px-[22px] py-[9px] text-[13px] font-semibold tracking-[0.3px] text-white transition-all hover:-translate-y-px hover:bg-teal-dark lg:inline-block"
        >
          Contact Us →
        </Link>

        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="relative z-50 flex h-9 w-9 flex-col items-center justify-center gap-[5px] lg:hidden"
        >
          <span
            className={cn(
              // Navy, not white: these bars used to sit on the navy bar. On the
              // off-white header a white icon would be completely invisible.
              "block h-0.5 w-[22px] rounded-full bg-[#0E2A47] transition-transform duration-300",
              menuOpen && "translate-y-[7px] rotate-45"
            )}
          />
          <span
            className={cn(
              "block h-0.5 w-[22px] rounded-full bg-[#0E2A47] transition-opacity duration-300",
              menuOpen && "opacity-0"
            )}
          />
          <span
            className={cn(
              "block h-0.5 w-[22px] rounded-full bg-[#0E2A47] transition-transform duration-300",
              menuOpen && "-translate-y-[7px] -rotate-45"
            )}
          />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            // Off-white to match the bar above it. This was `bg-navy/99`, which only
            // worked while the links inside were light text; the panel now carries the
            // same dark link colours as the desktop nav, so it has to be the same
            // surface value as the header or the dropdown detaches from it.
            className="fixed inset-x-0 top-16 z-40 max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-[#E2E8F0] bg-offwhite lg:hidden"
          >
            <nav className="flex flex-col gap-1 px-6 py-3">
              {NAV_LINKS.map((link, i) => {
                const active = isActivePath(pathname, link.href);
                return (
                  <MotionLink
                    key={link.label}
                    href={link.href}
                    onClick={(event) => {
                      // Close the menu first, then apply the same same-route
                      // top-of-page behaviour the desktop nav gets, so a mobile
                      // visitor tapping the current page lands at the top too.
                      setMenuOpen(false);
                      handleNavClick(event, link.href);
                    }}
                    aria-current={active ? "page" : undefined}
                    initial={reducedMotion ? false : { opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: reducedMotion ? 0 : i * 0.04 }}
                    className={cn(
                      MOBILE_LINK_BASE_CLASS,
                      active ? MOBILE_LINK_ACTIVE_CLASS : MOBILE_LINK_CLASS
                    )}
                  >
                    {link.label}
                  </MotionLink>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
