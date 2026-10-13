import { Fragment, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: ReactNode;
  className?: string;
  gap?: string;
  pauseOnHover?: boolean;
  /** Times to repeat the children within one half. Short lists need >1 so a single half still overflows the viewport, otherwise the loop shows a gap. */
  repeat?: number;
  /**
   * Space after the final item in a half. Flex `gap` does not emit a trailing gap,
   * so without this the last item butts against the first item of the next half.
   * Keep it in step with `gap`, otherwise the loop seam reads as a wider gap than the
   * spacing between items.
   */
  trailingSpace?: string;
}

export function Marquee({
  children,
  className,
  gap = "gap-16",
  pauseOnHover = true,
  repeat = 1,
  trailingSpace,
}: MarqueeProps) {
  const half = (
    <div className={cn("flex shrink-0 items-center", gap, trailingSpace ?? "pr-16")}>
      {Array.from({ length: Math.max(1, repeat) }, (_, i) => (
        <Fragment key={i}>{children}</Fragment>
      ))}
    </div>
  );

  return (
    <div
      className={cn("group flex w-full overflow-hidden", className)}
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
      }}
    >
      {/* Both halves sit in one track so the -50% keyframe resolves against the full track width (= exactly one half), which is what makes the loop seamless. */}
      <div
        className={cn(
          "flex w-max motion-safe:animate-[var(--animate-marquee)]",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
      >
        {half}
        <div aria-hidden="true" className="flex">
          {half}
        </div>
      </div>
    </div>
  );
}
