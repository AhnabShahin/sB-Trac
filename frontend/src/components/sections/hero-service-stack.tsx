"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { BoltIcon, SunIcon, CraneIcon, DropletIcon, WrenchIcon } from "@/components/ui/icons";
import type { HeroServiceCard } from "@/data/content-types";

registerGsap();

const ICON_MAP = {
  bolt: BoltIcon,
  sun: SunIcon,
  crane: CraneIcon,
  droplet: DropletIcon,
  wrench: WrenchIcon,
} as const;

// The icon chip is the accent at 15% — derived here so the admin only ever sets
// one colour per card. Falls back to the raw value for non-hex input.
function iconChip(accent: string): string {
  const hex = accent.replace("#", "").trim();
  const full = hex.length === 3 ? hex.split("").map((c) => c + c).join("") : hex;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return accent;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r},${g},${b},0.15)`;
}

/**
 * The hover-only artwork behind a service card.
 *
 * The reveal is gated on the bitmap's own `load` event rather than on hover
 * alone. It used to be driven purely by `group-hover:opacity-100`, so hovering
 * a card that had not been fetched yet animated the dark scrim in over an empty
 * tile and the photograph popped in a beat later — the "loading glitch". The
 * `<picture>` now stays mounted (so the browser keeps fetching it) behind an
 * inline `opacity: 0`, and that inline style is dropped only once the image has
 * loaded, so the two layers can never fade in over missing pixels.
 */
function HeroCardHoverArt({
  src,
  title,
  scrim,
}: {
  src: string;
  title: string;
  scrim: string;
}) {
  const [ready, setReady] = useState(false);

  return (
    <div
      aria-hidden="true"
      // Inline while loading so it outranks the `group-hover:opacity-100` class
      // below; removed on load, handing control back to the hover transition.
      style={ready ? undefined : { opacity: 0 }}
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100"
    >
      {/* Hover Image Reveal (next/image negotiates WebP/AVIF from the one source). */}
      <Image
        src={src}
        alt={`${title} Background`}
        fill
        sizes="(min-width: 1024px) 220px, 45vw"
        className="scale-110 object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-100 motion-reduce:scale-100 motion-reduce:transition-none"
        loading="lazy"
        decoding="async"
        onLoad={() => setReady(true)}
      />

      {/* Dark Overlay Gradient on Hover for Maximum Legibility */}
      <div className="absolute inset-0" style={{ background: scrim }} />
    </div>
  );
}

export function HeroServiceStack({ cards }: { cards: HeroServiceCard[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (!cardsRef.current) return;
      const cards = Array.from(cardsRef.current.querySelectorAll<HTMLElement>("[data-scard]"));

      if (reducedMotion) {
        gsap.set(cards, { opacity: 1, rotateX: 0, rotateY: 0, y: 0 });
        return;
      }

      gsap.set(cards, { transformPerspective: 600, transformOrigin: "50% 100%" });

      gsap.fromTo(
        cards,
        { opacity: 0, y: 40, rotateX: -70 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.1,
          delay: 0.2,
        }
      );

      if (!window.matchMedia("(pointer: fine)").matches) return;

      const icons = cards.map((card) => card.querySelector<HTMLElement>("[data-scard-icon]"));

      const resetTilt = (index: number) => {
        gsap.to(cards[index], { rotateX: 0, rotateY: 0, scale: 1, duration: 0.5, ease: "power3.out", overwrite: true });
        const icon = icons[index];
        if (icon) {
          gsap.to(icon, { x: 0, y: 0, scale: 1, duration: 0.4, ease: "power3.out", overwrite: true });
        }
      };

      const onCardMove = (card: HTMLElement, index: number) => (e: PointerEvent) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;

        gsap.to(card, {
          rotateX: py * -14,
          rotateY: px * 14,
          scale: 1.03,
          duration: 0.5,
          ease: "power3.out",
          overwrite: true,
        });

        const icon = icons[index];
        if (icon) {
          gsap.to(icon, {
            x: px * 10,
            y: py * 10 - 4,
            scale: 1.12,
            duration: 0.4,
            ease: "power3.out",
            overwrite: true,
          });
        }
      };

      const cleanups = cards.map((card, index) => {
        const move = onCardMove(card, index);
        const enter = () => {
          card.style.willChange = "transform";
        };
        const leave = () => {
          resetTilt(index);
          card.style.willChange = "auto";
        };
        card.addEventListener("pointerenter", enter, { passive: true });
        card.addEventListener("pointermove", move, { passive: true });
        card.addEventListener("pointerleave", leave, { passive: true });
        return () => {
          card.removeEventListener("pointerenter", enter);
          card.removeEventListener("pointermove", move);
          card.removeEventListener("pointerleave", leave);
        };
      });

      return () => cleanups.forEach((cleanup) => cleanup());
    },
    { scope: containerRef, dependencies: [reducedMotion] }
  );

  return (
    <div ref={containerRef} className="w-full max-w-[440px]">
      <div ref={cardsRef} className="grid grid-cols-2 gap-3">
        {cards.map((card, i) => {
          const Icon = ICON_MAP[card.icon] ?? BoltIcon;
          return (
            <Link
              key={`${card.title}-${i}`}
              href={card.href || "#"}
              data-scard
              data-cursor-interactive
              // No `backdrop-blur` here. These five cards sit directly on top of the
              // auto-playing hero video, so every blurred card forced the browser
              // to re-snapshot and re-blur that video on each frame — five
              // backdrop filters over live video. On top of that, the entrance
              // timeline animates `opacity` 0->1 on these very elements, and
              // animating opacity on a backdrop-filtered layer is a well-known
              // source of flicker as the backdrop is re-rasterised mid-tween.
              // The alpha is raised to make up for the lost frost; the backdrop
              // behind the right-hand column is already darkened by the hero's
              // gradient overlays, so legibility is unaffected.
              className="group relative block cursor-pointer overflow-hidden rounded-lg border border-white/15 bg-navy/55 px-5 py-6 pb-7 transition-[background,border-color,box-shadow] duration-300 hover:border-white/30 hover:bg-navy/70 hover:shadow-lg"
              style={card.wide ? { gridColumn: "span 2" } : undefined}
            >
              {card.image ? (
                <HeroCardHoverArt
                  src={card.image}
                  title={card.title}
                  scrim="linear-gradient(115deg, rgba(6,15,26,0.94) 15%, rgba(6,15,26,0.80) 55%, rgba(6,15,26,0.60) 100%)"
                />
              ) : null}

              <span
                className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                style={{ background: card.accent }}
              />
              <div className="relative z-10">
                <div
                  data-scard-icon
                  className="mb-3.5 flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ background: iconChip(card.accent), color: card.accent }}
                >
                  <Icon width={20} height={20} />
                </div>
                <div className="mb-1.5 font-display text-base font-bold leading-tight text-white">
                  {card.title}
                </div>
                <div
                  className="text-xs leading-relaxed text-muted transition-colors duration-500 group-hover:text-white/90"
                  style={card.wide ? { maxWidth: "320px" } : undefined}
                >
                  {card.subtitle}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
