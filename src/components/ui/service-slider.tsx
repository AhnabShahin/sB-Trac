"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";

interface Slide {
  src: string;
  webpSrc?: string;
  alt: string;
  caption?: string;
}

interface ServiceSliderProps {
  slides: Slide[];
  title?: string;
}

export function ServiceSlider({ slides, title }: ServiceSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  // Keyboard arrow navigation when container or slider is focused/active
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current) return;
      // Check if focus is inside slider or if slider is visible
      const isFocused = containerRef.current.contains(document.activeElement);
      if (isFocused) {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          prevSlide();
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          nextSlide();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartX.current = null;
  };

  if (!slides || slides.length === 0) return null;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      aria-label={title || "Project photo slider"}
      className="group relative my-12 w-full overflow-hidden rounded-xl border border-border/80 bg-navy2 outline-none focus-visible:ring-2 focus-visible:ring-teal"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 16:9 Aspect Ratio Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-black/40">
        {slides.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={slide.src}
              className={`absolute inset-0 transition-opacity duration-500 ${
                isActive ? "z-10 opacity-100" : "z-0 opacity-0 pointer-events-none"
              }`}
            >
              <picture className="relative block h-full w-full">
                {slide.webpSrc && (
                  <source srcSet={slide.webpSrc} type="image/webp" />
                )}
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  sizes="(min-width: 1280px) 1100px, 100vw"
                  className="object-cover object-center"
                  loading={idx === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
              </picture>
              
              {/* Optional Caption Overlay */}
              {slide.caption && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-navy/90 via-navy/50 to-transparent p-4 sm:p-6">
                  <p className="text-xs sm:text-sm font-medium text-white/90">
                    {slide.caption}
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {/* Navigation Arrow Buttons */}
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/10 bg-navy/70 p-2.5 text-white backdrop-blur-md transition-all hover:bg-teal hover:text-navy focus:outline-none focus:ring-2 focus:ring-teal"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/10 bg-navy/70 p-2.5 text-white backdrop-blur-md transition-all hover:bg-teal hover:text-navy focus:outline-none focus:ring-2 focus:ring-teal"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>

        {/* Visible Dot Indicators */}
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 space-x-2 rounded-full bg-navy/60 px-3 py-1.5 backdrop-blur-sm">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all ${
                idx === currentIndex ? "w-6 bg-teal" : "w-2.5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
