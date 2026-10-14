/**
 * The B-Trac monogram, as a single closed path in the word cloud's
 * 1000 x 1000 artboard.
 *
 * This shape used to be `btrac-mask.png`, a 1200 x 1200 bitmap referenced from a
 * CSS `mask-image`. The monogram is a flat, hard-edged silhouette, so it was
 * traced once (marching squares + Douglas-Peucker, see `_crop.py`) and
 * re-expressed as geometry: 38 points, verified against the source bitmap at
 * 99.3% pixel agreement, the remainder being edge antialiasing.
 *
 * As a path it scales to any display size, prints sharp, and costs less than the
 * PNG it replaces -- and it lets the highlight live inside the same <svg> as the
 * cloud it is masking, so the section carries no raster at all.
 */
export const BTRAC_MARK_PATH =
  "M335.42 241.67 L335.42 809.17 L570.0 809.17 L538.33 750.46 L535.83 747.79 L425.83 746.97 L413.33 744.31 L408.33 741.11 L404.17 736.35 L401.29 730.83 L398.71 720.83 L397.2 700.83 L397.03 521.67 L398.33 520.3 L601.91 520.83 L602.89 600.83 L660.0 759.1 L661.67 763.44 L663.33 764.6 L662.73 191.67 L655.0 190.91 L430.83 190.51 L429.62 191.67 L462.82 252.5 L558.33 252.85 L576.67 253.88 L587.5 257.21 L594.07 262.5 L596.67 266.74 L599.71 275.83 L601.04 284.17 L602.36 315.0 L602.47 487.5 L600.83 489.48 L397.5 489.17 L396.67 400.07 L338.33 238.48 L335.83 236.88 Z";
