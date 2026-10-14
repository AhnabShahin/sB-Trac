import { Reveal } from "@/components/ui/reveal";
import { StaggerGroup } from "@/components/ui/stagger-group";
import { LogoTile } from "@/components/ui/logo-tile";

interface LogoWallProps {
  eyebrow: string;
  heading: string;
  description: string;
  logos: { name: string; logo?: string }[];
}

/**
 * Full set of partner/client marks as a wrapped grid of LogoTiles. The homepage
 * rails scroll a subset; these walls exist so the domain pages show every mark
 * at once without waiting for it to pass through a marquee.
 */
export function LogoWall({ eyebrow, heading, description, logos }: LogoWallProps) {
  return (
    <div className="mx-auto max-w-6xl">
      <Reveal className="mx-auto mb-12 max-w-xl text-center">
        <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-teal">
          {eyebrow}
        </div>
        <h2 className="font-display text-[clamp(30px,3.4vw,44px)] font-extrabold leading-[1.05] text-white">
          {heading}
        </h2>
        <p className="mx-auto mt-4 max-w-[520px] text-base leading-[1.7] text-[#94A3B8]">
          {description}
        </p>
      </Reveal>

      <StaggerGroup
        as="div"
        itemSelector="[data-stagger-item]"
        stagger={0.015}
        y={10}
        className="flex flex-wrap items-center justify-center gap-3"
      >
        {logos.map((logo) => (
          <div key={logo.name} data-stagger-item>
            <LogoTile name={logo.name} logoSrc={logo.logo} />
          </div>
        ))}
      </StaggerGroup>
    </div>
  );
}