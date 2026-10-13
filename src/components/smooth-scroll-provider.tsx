"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { lenisStore } from "@/lib/lenis-instance";

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);
  // Distinguishes the first effect run (the initial page load) from a genuine
  // route change, so the top-of-page reset is not applied on arrival.
  const hasNavigated = useRef(false);
  const reducedMotion = useReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    registerGsap();

    if (reducedMotion) {
      ScrollTrigger.normalizeScroll(false);
      return;
    }

    const lenis = new Lenis({
      // 1.1s was long enough that the page kept coasting after the wheel stopped,
      // which reads as lag rather than smoothness — especially on the homepage,
      // where several sections are pinned and a trailing coast drags them.
      // 0.85 still eases visibly but settles with the input.
      duration: 0.85,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.5,
      // `<html>` carries a fixed `h-full` (height: 100%), so its box never
      // resizes as page content grows/shrinks and Lenis's autoResize
      // ResizeObserver on it never re-fires — the scroll limit then stays
      // stuck at whichever page's height was measured first. `<body>` has
      // no fixed height, so its box genuinely tracks content height.
      content: document.body,
    });
    lenisRef.current = lenis;
    lenisStore.current = lenis;

    // Bridges Lenis's virtual scroll position to ScrollTrigger so pin/scrub
    // stay in sync — without this, ScrollTrigger reads native scrollTop,
    // which never moves under Lenis, breaking ScrollTrigger.pin entirely.
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length && typeof value === "number") {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.addEventListener("refresh", () => lenis.resize());
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
      lenisStore.current = null;
    };
  }, [reducedMotion]);

  // The root layout (and this provider) stays mounted across client-side
  // navigations — only `children` swaps out. Lenis/ScrollTrigger otherwise
  // keep measuring the previous route's dimensions and trigger positions,
  // which caps scrolling at the old page's height. Re-measure once the new
  // route has painted (this effect runs after descendant mount effects, so
  // the new page's own ScrollTriggers already exist by the time it fires).
  useEffect(() => {
    if (reducedMotion) return;

    // Read the "is this a real navigation" decision synchronously, before any
    // frame is scheduled, so the rAF below cannot see a mutated ref.
    //
    // A hash in the URL means the destination is a section, not the top: the header
    // nav sends "/products-services#products" so that arriving there lands on the
    // product catalogue. In that case the top must NOT be reset — and the hash
    // target has to be scrolled to through Lenis, because the browser's own anchor
    // jump is immediately overwritten by Lenis and the reader would be left at the
    // top anyway.
    const hash = window.location.hash;
    const shouldResetTop = hasNavigated.current && !hash;
    hasNavigated.current = true;

    // Applies whichever scroll the navigation called for. Resizing and refreshing
    // first matters: Lenis clamps scroll to the height it believes the document has,
    // so scrolling to a section below the fold before it has re-measured would land
    // short.
    const applyScroll = () => {
      lenisRef.current?.resize();
      ScrollTrigger.refresh();

      if (hash) {
        // Guarded: Lenis logs a warning and does nothing for a missing target,
        // which would strand the reader wherever the previous page left them.
        if (document.getElementById(hash.slice(1))) {
          lenisRef.current?.scrollTo(hash, { immediate: true, force: true });
        } else {
          lenisRef.current?.scrollTo(0, { immediate: true, force: true });
        }
      } else if (shouldResetTop) {
        lenisRef.current?.scrollTo(0, { immediate: true, force: true });
      }
    };

    const raf = requestAnimationFrame(applyScroll);

    // One reset is not enough, and this is the reason a single frame left the
    // reader partway down the new page. Two things still land *after* that
    // frame: Next.js performs its own scroll restoration once navigation
    // settles, and the incoming route keeps changing height as images settle and
    // ScrollTrigger re-measures its pins — and Lenis clamps the scroll to the
    // height it believes the document has. Either one wins the race and undoes
    // the reset. Re-asserting once the route has settled is what makes the
    // navigation land on the top rather than in the middle.
    const settle = window.setTimeout(() => {
      if (!shouldResetTop && !hash) return;
      applyScroll();
    }, 180);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(settle);
    };
  }, [pathname, reducedMotion]);

  // Trigger positions are measured from the DOM at refresh time. Images and
  // webfonts above a section settle *after* the first refresh and grow the
  // layout, so every trigger measured against the shorter page keeps a stale
  // `start` — a section can then stay hidden/faded even while it is on screen,
  // which reads as "the content disappeared after loading". Re-measure once the
  // document and its fonts have settled.
  useEffect(() => {
    if (reducedMotion) return;
    const refresh = () => {
      lenisRef.current?.resize();
      ScrollTrigger.refresh();
    };
    const onLoad = () => refresh();
    window.addEventListener("load", onLoad, { once: true });
    document.fonts.ready.then(refresh).catch(() => {});
    return () => window.removeEventListener("load", onLoad);
  }, [reducedMotion]);

  return <>{children}</>;
}
