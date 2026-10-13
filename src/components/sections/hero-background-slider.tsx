"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { HeroSlide } from "@/data/site";

registerGsap();

const KEN_BURNS_SCALE = 1.12;

export function HeroBackgroundSlider({
  slides,
  alt = "Home Hero",
  slideDuration = 6,
}: {
  slides: HeroSlide[];
  alt?: string;
  slideDuration?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const isSlideshow = slides.length > 1 && !reducedMotion;
  const crossfadeDuration = Math.min(1.2, slideDuration / 2);

  useGSAP(
    () => {
      if (!containerRef.current || !isSlideshow) return;

      const layers = gsap.utils.toArray<HTMLElement>("[data-hero-slide]", containerRef.current);
      if (layers.length < 2) return;

      const media = layers.map(
        (layer) => layer.querySelector<HTMLElement>("[data-hero-slide-media]") ?? layer
      );

      gsap.set(layers, { opacity: 0 });
      gsap.set(layers[0], { opacity: 1 });
      gsap.set(media, { scale: 1 });

      const tl = gsap.timeline({ repeat: -1 });

      layers.forEach((layer, i) => {
        const start = i * slideDuration;
        const next = (i + 1) % layers.length;

        tl.set(media[i], { scale: 1 }, start);
        tl.to(media[i], { scale: KEN_BURNS_SCALE, duration: slideDuration, ease: "none" }, start);
        tl.to(layer, { opacity: 0, duration: crossfadeDuration, ease: "power1.inOut" }, start + slideDuration - crossfadeDuration);
        tl.to(layers[next], { opacity: 1, duration: crossfadeDuration, ease: "power1.inOut" }, start + slideDuration - crossfadeDuration);
      });

      return () => {
        tl.kill();
      };
    },
    { scope: containerRef, dependencies: [isSlideshow, slides.length, slideDuration, crossfadeDuration] }
  );

  if (slides.length === 0) return null;

  if (!isSlideshow) {
    return (
      <div ref={containerRef} aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <SlideMedia slide={slides[0]} priority reducedMotion={reducedMotion} alt={alt} />
      </div>
    );
  }

  return (
    <div ref={containerRef} aria-hidden="true" className="absolute inset-0 overflow-hidden">
      {slides.map((slide, i) => (
        <div key={slide.type === "video" ? slide.mp4Src : slide.src} data-hero-slide className="absolute inset-0">
          <SlideMedia slide={slide} priority={i === 0} isMediaLayer reducedMotion={reducedMotion} alt={alt} />
        </div>
      ))}
    </div>
  );
}

function SlideMedia({
  slide,
  priority,
  isMediaLayer,
  reducedMotion,
  alt,
}: {
  slide: HeroSlide;
  priority?: boolean;
  isMediaLayer?: boolean;
  reducedMotion?: boolean;
  alt: string;
}) {
  const dataAttr = isMediaLayer ? { "data-hero-slide-media": "" } : {};

  if (slide.type === "video") {
    // If reduced motion is requested, render static poster as img per spec
    if (reducedMotion) {
      return (
        <Image
          {...dataAttr}
          src={slide.poster}
          alt={alt}
          fill
          // `priority` is deprecated in Next 16 in favour of `preload`; only the
          // first slide is above the fold and should be fetched eagerly.
          preload={priority}
          className="object-cover opacity-80"
          style={{ objectPosition: "center 30%" }}
          sizes="100vw"
        />
      );
    }

    return (
      <video
        {...dataAttr}
        className="h-full w-full object-cover opacity-85 transition-opacity duration-700"
        style={{ objectPosition: "center 30%" }}
        poster={slide.poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        {slide.webmSrc && <source src={slide.webmSrc} type="video/webm" />}
        <source src={slide.mp4Src} type="video/mp4" />
      </video>
    );
  }

  return (
    <picture {...dataAttr} className="relative block h-full w-full">
      {slide.webpSrc && <source srcSet={slide.webpSrc} type="image/webp" />}
      <Image
        src={slide.src}
        alt={alt}
        fill
        // See the reduced-motion branch above: `preload` replaces the deprecated
        // `priority` in Next 16.
        preload={priority}
        className="object-cover opacity-55"
        style={{ objectPosition: "center 30%" }}
        sizes="100vw"
      />
    </picture>
  );
}
