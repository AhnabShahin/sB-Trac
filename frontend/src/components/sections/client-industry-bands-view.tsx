import type { ClientIndustryGroup } from "@/data/content-types";
import { Reveal } from "@/components/ui/reveal";
import { Counter } from "@/components/ui/counter";
import { Marquee } from "@/components/ui/marquee";
import { LogoTile } from "@/components/ui/logo-tile";
import {
  CartIcon,
  CraneIcon,
  BoltIcon,
  FlaskIcon,
  BroadcastIcon,
  LandmarkIcon,
  CapIcon,
  type IconProps,
} from "@/components/ui/icons";

const ICON_MAP: Record<string, (props: IconProps) => React.JSX.Element> = {
  cart: CartIcon,
  crane: CraneIcon,
  bolt: BoltIcon,
  flask: FlaskIcon,
  broadcast: BroadcastIcon,
  landmark: LandmarkIcon,
  cap: CapIcon,
};

// Darker accent siblings tuned for the off-white band (see the shared
// data-driven ClientIndustryBands for the contrast-ratio rationale). This view
// is always rendered light (the /clients page), so it carries only that set.
const ICON_TONE_LIGHT = {
  teal: "border-[#067a63]/25 bg-[#067a63]/10 text-[#067a63]",
  blue: "border-blue/25 bg-blue/10 text-blue",
  amber: "border-[#8a5300]/25 bg-[#8a5300]/10 text-[#8a5300]",
  purple: "border-purple-dark/25 bg-purple-dark/10 text-purple-dark",
} as const;

const COUNT_ACCENT_LIGHT = {
  teal: "text-[#067a63]",
  blue: "text-blue",
  amber: "text-[#8a5300]",
  purple: "text-purple-dark",
} as const;

const MIN_RAIL_TILES = 20;

// Prop-driven twin of ClientIndustryBands: the groups, their clients and the
// logos are all supplied (edited in the admin) rather than derived from the
// static data modules, so the /clients page is fully DB-backed.
export function ClientIndustryBandsView({
  industries,
  headingAs: Heading = "h2",
}: {
  industries: ClientIndustryGroup[];
  headingAs?: "h2" | "h3";
}) {
  return (
    <>
      {industries.map((group) => {
        const Icon = ICON_MAP[group.icon] ?? CartIcon;
        const names = group.clients;
        if (names.length === 0) return null;
        return (
          <div key={group.industry} className="border-b border-[#E2E8F0] bg-offwhite py-14">
            <div className="px-6 sm:px-12 lg:px-20">
              <Reveal className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-3.5">
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border ${ICON_TONE_LIGHT[group.accent]}`}
                  >
                    <Icon width={22} height={22} />
                  </span>
                  <div>
                    <Heading className="font-display text-xl font-extrabold text-[#0E2A47] sm:text-[22px]">
                      {group.industry}
                    </Heading>
                    <div className="mt-0.5 text-[13px] text-[#475569]">{group.focus}</div>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <Counter
                    value={names.length}
                    className="font-display text-[clamp(34px,4.4vw,52px)] font-extrabold leading-none text-[#0E2A47]"
                  />
                  <div
                    className={`mt-1 text-[11px] font-bold uppercase tracking-[1.5px] ${COUNT_ACCENT_LIGHT[group.accent]}`}
                  >
                    Client{names.length !== 1 ? "s" : ""}
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="mt-7">
              <Marquee
                gap="gap-3.5"
                trailingSpace="pr-3.5"
                repeat={Math.ceil(MIN_RAIL_TILES / names.length)}
              >
                {names.map((client) => (
                  <LogoTile key={client.name} name={client.name} logoSrc={client.logo} variant="plain" />
                ))}
              </Marquee>
            </div>
          </div>
        );
      })}
    </>
  );
}
