"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { ImageLightbox, type LightboxImage } from "@/components/ui/image-lightbox";
import type { TimelineMilestone } from "@/data/company";

registerGsap();

// scripts/process-assets.js emits every timeline shot at this single size, so the
// lightbox can reserve the right box without per-milestone dimensions in the data.
const TIMELINE_IMAGE_WIDTH = 1672;
const TIMELINE_IMAGE_HEIGHT = 941;

export function TimelineTrack({ milestones }: { milestones: TimelineMilestone[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      const fill = containerRef.current.querySelector<HTMLElement>("[data-timeline-fill]");
      const markers = containerRef.current.querySelectorAll<HTMLElement>("[data-timeline-marker]");

      if (reducedMotion) {
        if (fill) gsap.set(fill, { scaleY: 1 });
        gsap.set(markers, { opacity: 1, scale: 1 });
        return;
      }

      if (fill) {
        gsap.fromTo(
          fill,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 70%",
              end: "bottom 60%",
              scrub: 0.4,
            },
          }
        );
      }

      markers.forEach((marker, i) => {
        gsap.fromTo(
          marker,
          { opacity: 0, scale: 0.5 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: "back.out(2)",
            delay: i * 0.05,
            scrollTrigger: {
              trigger: marker,
              start: "top 80%",
              // Markers sit on the timeline rail: letting them reverse left
              // gaps in the rail whenever the section was scrolled back up.
              toggleActions: "play none none none",
            },
          }
        );
      });
    },
    { scope: containerRef, dependencies: [reducedMotion] }
  );

  return (
    <div ref={containerRef} className="relative pl-9">
      <div className="absolute left-[7px] top-[6px] bottom-[6px] w-px bg-border">
        <div
          data-timeline-fill
          className="h-full w-full origin-top bg-gradient-to-b from-teal to-blue-light"
        />
      </div>

      <ol className="space-y-10">
        {milestones.map((milestone) => (
          <li key={milestone.year} className="relative">
            <span
              data-timeline-marker
              className="absolute -left-9 top-[5px] flex h-[15px] w-[15px] items-center justify-center rounded-full border-2 border-teal bg-navy2"
            >
              <span className="h-[5px] w-[5px] rounded-full bg-teal" />
            </span>

            <div className="mb-1 font-display text-xs font-bold uppercase tracking-[2px] text-teal">
              {milestone.year}
            </div>
            <h3 className="mb-1.5 font-display text-base font-extrabold text-white sm:text-lg">
              {milestone.title}
            </h3>
            <p className="max-w-xl text-[13px] leading-[1.7] text-muted">
              {milestone.description}
            </p>

            {/* Small Lazy Loaded Timeline Thumbnail */}
            {milestone.image && (
              <button
                type="button"
                data-cursor-interactive
                aria-label={`View larger image: ${milestone.year} - ${milestone.title}`}
                onClick={() =>
                  setLightboxImage({
                    src: milestone.image!,
                    webpSrc: milestone.webpImage,
                    alt: `${milestone.year} - ${milestone.title}`,
                    caption: `${milestone.year} — ${milestone.title}`,
                    width: TIMELINE_IMAGE_WIDTH,
                    height: TIMELINE_IMAGE_HEIGHT,
                  })
                }
                className="group mt-3.5 relative block h-28 w-48 overflow-hidden rounded-lg border border-border bg-navy3 transition-colors hover:border-teal/60"
              >
                <picture className="relative block h-full w-full">
                  {milestone.webpImage && <source srcSet={milestone.webpImage} type="image/webp" />}
                  <Image
                    src={milestone.image}
                    alt={`${milestone.year} - ${milestone.title}`}
                    fill
                    sizes="200px"
                    className="object-cover object-center transition-transform duration-500 motion-safe:group-hover:scale-[1.06]"
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
              </button>
            )}
          </li>
        ))}
      </ol>

      <ImageLightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
    </div>
  );
}
