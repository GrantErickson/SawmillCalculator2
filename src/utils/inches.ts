/** Inches stored as eighths so 1/8 inch steps stay exact. */

export function clampEighths(eighths: number, max = 240): number {
  if (!Number.isFinite(eighths)) return 0;
  return Math.min(max, Math.max(0, Math.round(eighths)));
}

export function snapEighths(eighths: number, stepEighths: number): number {
  const step = stepEighths > 0 ? stepEighths : 1;
  const clamped = clampEighths(eighths);
  return clampEighths(Math.round(clamped / step) * step);
}

const EIGHTH_NAMES = ["", "1/8", "1/4", "3/8", "1/2", "5/8", "3/4", "7/8"];

export function formatEighths(eighths: number): string {
  const whole = Math.floor(eighths / 8);
  const rem = eighths - whole * 8;
  const frac = EIGHTH_NAMES[rem] ?? "";
  if (whole > 0 && frac) return `${whole}-${frac}"`;
  if (whole > 0) return `${whole}"`;
  if (frac) return `${frac}"`;
  return "None";
}

export function eighthsToInches(eighths: number): number {
  return eighths / 8;
}
