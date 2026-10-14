import {
  getIndustryLeaders,
  CLIENT_INDUSTRY_META,
  type ClientIndustry,
} from "@/data/company";
import { getClientLogoIndex } from "@/data/site";
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

const ICON_TONE = {
  teal: "border-teal/25 bg-teal/[0.12] text-teal",
  blue: "border-blue-light/25 bg-blue-light/[0.12] text-blue-light",
  amber: "border-amber/25 bg-amber/[0.12] text-amber",
  purple: "border-purple/25 bg-purple/[0.12] text-[#A78BFA]",
} as const;

const COUNT_ACCENT = {
  teal: "text-teal",
  blue: "text-blue-light",
  amber: "text-amber",
  purple: "text-[#A78BFA]",
} as const;

// Off-white band (`tone="light"`). Every accent here is a darker sibling of the one
// above, because the originals are tuned for a navy surface and fail badly on a
// light one. Measured against #f4f6f9:
//
//   teal       #0a9e88 -> 3.10   (needs 4.5 for the 11px label)   -> #067a63 4.88
//   blue-light #9fb9fc -> 1.79                                   -> #203169 11.38
//   amber      #e08a00 -> 2.49                                   -> #8a5300 5.85
//   purple     #7c3aed -> 5.26 (passes)                          -> #6020c0 7.87
//
// The icons only need 3:1 as graphical objects, but they use the same darker
// values so a chip and the count beside it read as one accent.
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

// Tile is w-150px + gap-3.5 = 164px, so 20 tiles (~3280px) keeps one marquee half wider
// than any viewport we target — below that the loop shows a gap.
const MIN_RAIL_TILES = 20;

function groupByIndustry(clients: Awaited<ReturnType<typeof getIndustryLeaders>>) {
  const groups = new Map<ClientIndustry, string[]>();
  for (const client of clients) {
    const list = groups.get(client.industry) ?? [];
    list.push(client.name);
    groups.set(client.industry, list);
  }
  return (Object.keys(CLIENT_INDUSTRY_META) as ClientIndustry[])
    .filter((industry) => groups.has(industry))
    .map((industry) => ({ industry, names: groups.get(industry)! }));
}

interface ClientIndustryBandsProps {
  headingAs?: "h2" | "h3";
  /**
   * `dark` (default) is the navy bands this section has always used, and is what the
   * homepage renders. `light` makes the bands off-white with dark text.
   *
   * This is a prop rather than a global change because the component is rendered in
   * two places — the homepage `ClientsSection` and the /clients page — and only the
   * latter wants the light treatment. Flipping the shared component outright would
   * have turned the homepage's section light as well.
   */
  tone?: "dark" | "light";
}

export async function ClientIndustryBands({
  headingAs: Heading = "h3",
  tone = "dark",
}: ClientIndustryBandsProps) {
  const [leaders, clientLogos] = await Promise.all([
    getIndustryLeaders(),
    getClientLogoIndex(),
  ]);
  const groups = groupByIndustry(leaders);

  const light = tone === "light";
  const iconTone = light ? ICON_TONE_LIGHT : ICON_TONE;
  const countAccent = light ? COUNT_ACCENT_LIGHT : COUNT_ACCENT;

  return (
    <>
      {groups.map(({ industry, names }, i) => {
        const meta = CLIENT_INDUSTRY_META[industry];
        const Icon = ICON_MAP[meta.icon];
        return (
          <div
            key={industry}
            className={`border-b py-14 ${
              // Off-white when `tone="light"`. The old dark bands alternated
              // navy2 / card purely to separate neighbours; on one flat light
              // surface that alternation would be invisible, so every band is the
              // same colour and the light divider line (`#E2E8F0`) does the
              // separating instead. `border-border` (#232f50) is a dark navy and
              // would read as a hard line on off-white.
              light
                ? "border-[#E2E8F0] bg-offwhite"
                : i % 2 === 0
                  ? "border-border bg-navy2"
                  : "border-border bg-card"
            }`}
          >
            <div className="px-6 sm:px-12 lg:px-20">
              <Reveal className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-3.5">
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border ${iconTone[meta.accent]}`}
                  >
                    <Icon width={22} height={22} />
                  </span>
                  <div>
                    <Heading
                      className={`font-display text-xl font-extrabold sm:text-[22px] ${
                        light ? "text-[#0E2A47]" : "text-white"
                      }`}
                    >
                      {industry}
                    </Heading>
                    <div
                      className={`mt-0.5 text-[13px] ${
                        // `text-muted` (#6b7a8f) is 4.04:1 on off-white — just under
                        // the 4.5 needed for 13px text — so the light band uses the
                        // slate that measures 7.00:1 instead.
                        light ? "text-[#475569]" : "text-muted"
                      }`}
                    >
                      {meta.focus}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <Counter
                    value={names.length}
                    className={`font-display text-[clamp(34px,4.4vw,52px)] font-extrabold leading-none ${
                      light ? "text-[#0E2A47]" : "text-white"
                    }`}
                  />
                  <div
                    className={`mt-1 text-[11px] font-bold uppercase tracking-[1.5px] ${
                      countAccent[meta.accent]
                    }`}
                  >
                    Client{names.length !== 1 ? "s" : ""}
                  </div>
                </div>
              </Reveal>
            </div>

            {/* The rail runs full-bleed. It used to sit inside a rounded, bordered
                well (`px-4 py-3` + a `bg-white/[0.025]` panel) nested in the padded
                content column, which boxed the marks in and capped the row at the
                page gutter. The well is gone; the only chrome left is the glass chip
                around each individual mark, which is what keeps the logos legible
                against the band. */}
            <div className="mt-7">
              <Marquee
                gap="gap-3.5"
                trailingSpace="pr-3.5"
                repeat={Math.ceil(MIN_RAIL_TILES / names.length)}
              >
                {names.map((name) => (
                  <LogoTile
                    key={name}
                    name={name}
                    logoSrc={clientLogos[name]}
                    // `glass` on a light band is wrong twice over: its pane is
                    // `bg-white/[0.06]` with a `border-white/15`, which disappears on
                    // off-white, and `MARK_DARK_HALO` traces dark marks with a *light*
                    // rim, which is invisible on a light surface. `plain` is the
                    // variant built for this — no box, no rim, and it applies the
                    // contrast treatment in the correct direction (a dark rim on the
                    // light artwork, which is what would otherwise disappear).
                    // This is the same treatment the homepage client rail uses.
                    variant={light ? "plain" : "glass"}
                  />
                ))}
              </Marquee>
            </div>
          </div>
        );
      })}
    </>
  );
}
