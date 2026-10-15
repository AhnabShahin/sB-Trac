// Shared with the home hero's service-stack cards: derives a soft icon-chip
// background from a single admin-set hex accent, so each card only needs one
// colour field instead of a background + foreground pair.
export function iconChip(accent: string, alpha = 0.15): string {
  const hex = accent.replace("#", "").trim();
  const full = hex.length === 3 ? hex.split("").map((c) => c + c).join("") : hex;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return accent;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
