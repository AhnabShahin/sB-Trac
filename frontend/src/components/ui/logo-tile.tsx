"use client";

import { useState } from "react";
import Image from "next/image";
import { LOGO_ARTWORK } from "@/data/logo-artwork";
import { cn } from "@/lib/utils";

interface LogoTileProps {
  name: string;
  logoSrc?: string;
  className?: string;
  /**
   * `boxed` (default) puts the mark on a frosted-white tile so dark artwork stays
   * legible in its original colours. `bare` drops the tile entirely, for rails on a
   * dark band. `glass` is the transparent variant for the dark rails: a genuinely
   * see-through frosted pane with no fill, where dark marks are rendered as white
   * silhouettes so they read against the navy without the pane tinting up.
   * `plain` also drops the tile, but for a light band: every mark sits directly on
   * the off-white surface with no box and no shadow of any kind. Marks keep their own
   * colours, and light artwork is low-contrast there by design — see MARK_AS_IS.
   */
  variant?: "boxed" | "bare" | "glass" | "plain";
}

const TILE_BASE = "relative flex shrink-0 items-center justify-center";

const TILE_BOXED = `${TILE_BASE} h-16 w-44 overflow-hidden rounded-xl border border-white/40 bg-white/[0.88] shadow-[0_8px_24px_rgba(2,6,17,0.35),inset_0_1px_0_rgba(255,255,255,0.65)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-teal/60 hover:bg-white hover:shadow-[0_12px_32px_rgba(10,158,136,0.28)]`;

const TILE_BARE = `${TILE_BASE} h-14 w-40 transition-transform duration-300 hover:-translate-y-1`;

// No box at all — just the mark floating on the band's own off-white surface. The
// hover lift stays so the rail still feels alive, but without a pane to tint there
// is nothing for `hover:bg` to act on.
const TILE_PLAIN = `${TILE_BASE} h-14 w-40 transition-transform duration-300 hover:-translate-y-1`;

// One transparent frosted pane for every mark, whatever its artwork. An earlier
// pass gave each logo a pane of the opposite value (opaque white for dark
// artwork, deep navy for light) which fixed legibility but read as a row of white
// cards rather than glass. The pane is now genuinely see-through, so legibility
// is carried by the mark itself — see MARK_DARK_HALO below.
const TILE_GLASS = `${TILE_BASE} flex h-[68px] w-[150px] items-center justify-center rounded-lg border border-white/15 bg-white/[0.06] shadow-[0_1px_4px_rgba(2,6,17,0.30),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-teal/50 hover:bg-white/[0.10]`;

// No treatment at all: the mark renders exactly as authored. This is the treatment
// for `plain`, the off-white band, where the rail is deliberately flat — no box, no
// rim, no halo, no shadow behind the logo.
//
// The trade-off is the light artwork. `LOGO_ARTWORK` measures ~10 client marks as
// "light" (Square, TK Group, Premier Hotels, Sharmin, Super Petrochemical,
// BRB/BBS Cable, Bangladesh Navy, BMTF, Anford), and those are white or very pale,
// so on off-white they read as low-contrast rather than crisp. That is accepted
// here on purpose. If one of them ever needs to come back, restore a rim on the
// mark alone (the shape MARK_DARK_HALO takes below) rather than a tile behind it —
// a tile behind it is the box this variant exists to avoid.
const MARK_AS_IS = "";

// The pane is see-through, so the mark has to supply its own contrast against the
// navy behind it. Light artwork needs nothing. Dark artwork — the majority of the
// set, and near-identical in value to the band — would otherwise vanish into it,
// so it is traced with a light outline and glow instead of being recoloured.
//
// `drop-shadow()` is applied to the element, so it follows the PNG's alpha channel
// and traces the artwork's own shape. The colour of the mark is untouched: this
// adds a rim of light around it, not a fill over it.
//
// Kept deliberately faint. The first attempt used a 6px white glow at 42% and it
// read as a bright halo pooling under each mark rather than as an edge, which
// looked like a rendering fault on the rail. A single hairline rim at low alpha
// is enough to separate a dark mark from the navy, and the tile's own dark shadow
// below does the lifting.
//
// Used by the `glass` rails only — it assumes a dark surface behind the mark.
const MARK_DARK_HALO =
  "drop-shadow-[0_0_1px_rgba(255,255,255,0.45)]";

export function LogoTile({ name, logoSrc, className = "", variant = "boxed" }: LogoTileProps) {
  const [imgError, setImgError] = useState(false);
  const bare = variant === "bare";
  const glass = variant === "glass";
  const plain = variant === "plain";

  // Every mark keeps its own colours. Only the contrast treatment differs, and that
  // depends on the value of the surface behind it.
  //
  //   `plain`  -> off-white band: always flat, so every mark gets the same treatment
  //               (none). This is what keeps the rail completely shadow-free.
  //   `glass`  -> navy band: the pane is see-through, so dark artwork is traced with
  //               a light rim and light artwork needs none.
  //
  // Anything missing from the generated map is treated as dark, the safe default for
  // this set.
  const isLightArtwork = logoSrc ? LOGO_ARTWORK[logoSrc] === "light" : false;
  const markTreatment =
    plain || isLightArtwork ? MARK_AS_IS : MARK_DARK_HALO;
  const tileClass = glass
    ? TILE_GLASS
    : plain
      ? TILE_PLAIN
      : bare
        ? TILE_BARE
        : TILE_BOXED;

  // Clients without a mark on disk (or a mark that fails to load) fall back to the name.
  // Most industry leaders have no logo file, so this fallback is a common sight, not an
  // edge case. On the transparent glass pane the text has to be light to read against
  // the navy band behind it; on the off-white `plain` band it has to be dark.
  if (!logoSrc || imgError) {
    return (
      <div className={`${tileClass} px-4 text-center ${className}`} title={name}>
        <span
          className={`line-clamp-2 font-display text-[12px] font-extrabold uppercase tracking-wide ${
            glass || bare ? "text-offwhite" : "text-[#0E2A47]"
          }`}
        >
          {name}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`${tileClass} ${className}`}
      title={name}
    >
      <Image
        src={logoSrc}
        alt={`${name} logo`}
        fill
        sizes={bare || glass || plain ? "160px" : "176px"}
        className={cn(
          glass ? "object-contain p-2" : bare ? "object-contain p-1" : "object-contain p-2",
          markTreatment
        )}
        onError={() => setImgError(true)}
        loading="lazy"
      />
    </div>
  );
}
