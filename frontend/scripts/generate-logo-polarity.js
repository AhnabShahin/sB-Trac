/* eslint-disable */

﻿/**
 * Measures every logo in `public/assets/logos` and records whether its opaque
 * artwork is predominantly dark or light, writing `src/data/logo-artwork.ts`.
 *
 * The client and partner marks are transparent PNGs of both polarities, so a
 * single tile colour cannot keep them all legible — see the generated file.
 *
 * Run after adding or replacing a logo:  node scripts/generate-logo-polarity.js
 */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const LOGO_DIR = path.join(ROOT, "public", "assets", "logos");
const OUT = path.join(ROOT, "src", "data", "logo-artwork.ts");

// Perceived luminance below this counts as dark artwork. 110 is roughly the
// midpoint between the two kinds of mark in this set, so it keeps genuinely
// mid-tone logos on the light pane where their edges stay readable.
const DARK_LUMINANCE = 110;
// Alpha below this is treated as background, not artwork.
const MIN_ALPHA = 200;
// A mark counts as light only if it is clearly light-dominant, not a tie.
const LIGHT_RATIO = 1.2;

function collect(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...collect(full));
    else if (/\.(png|webp|jpg|jpeg)$/i.test(entry.name)) files.push(full);
  }
  return files;
}

(async () => {
  const result = {};

  for (const file of collect(LOGO_DIR)) {
    const { data } = await sharp(file)
      .ensureAlpha()
      .resize(64, 64, { fit: "fill" })
      .raw()
      .toBuffer({ resolveWithObject: true });

    let dark = 0;
    let light = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < MIN_ALPHA) continue;
      const luminance = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      if (luminance < DARK_LUMINANCE) dark++;
      else light++;
    }

    // Fully transparent marks carry no polarity; the tile falls back to default.
    if (dark === 0 && light === 0) continue;

    const key =
      "/" + path.relative(path.join(ROOT, "public"), file).split(path.sep).join("/");
    result[key] = light > dark * LIGHT_RATIO ? "light" : "dark";
  }

  const entries = Object.keys(result)
    .sort()
    .map((key) => `  "${key}": "${result[key]}",`)
    .join("\n");

  fs.writeFileSync(
    OUT,
    `/**
 * GENERATED FILE - do not hand-edit.
 * Regenerate with: node scripts/generate-logo-polarity.js
 *
 * The client and partner marks are transparent images of both polarities
 * (roughly 3:1 dark-dominant). No single tile colour serves both: a light pane
 * hides the light marks, and the very subtle white glass this rail originally
 * shipped on hid the dark ones, because it barely lifted off the navy band.
 * So each mark is measured once and given a surface of the opposite value.
 *
 * "dark" = mostly dark artwork, so it needs a light tile.
 * "light" = mostly light artwork, so it needs a dark tile.
 */
export const LOGO_ARTWORK: Record<string, "dark" | "light"> = {
${entries}
};
`
  );

  const values = Object.values(result);
  console.log(
    `Wrote ${values.length} entries ` +
      `(${values.filter((v) => v === "dark").length} dark, ` +
      `${values.filter((v) => v === "light").length} light).`
  );
})();
