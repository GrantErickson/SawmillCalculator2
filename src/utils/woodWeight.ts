/**
 * Freshly felled ("green") weights from Forest Products Laboratory
 * Technical Note 218, revised July 1931, "Weights of Various Woods Grown
 * in the United States." That green weight is the wet weight at felling.
 * Generic app species use one commercial representative from that table.
 * Mahogany and teak are not in the table.
 */
export type GreenWeight = {
  species: string;
  representative: string;
  greenLbPerCubicFoot: number;
};

export const greenWeights: GreenWeight[] = [
  { species: "Alder", representative: "red alder", greenLbPerCubicFoot: 46 },
  { species: "Ash", representative: "white ash", greenLbPerCubicFoot: 48 },
  { species: "Beech", representative: "American beech", greenLbPerCubicFoot: 54 },
  { species: "Birch", representative: "yellow birch", greenLbPerCubicFoot: 57 },
  { species: "Cedar", representative: "western red cedar", greenLbPerCubicFoot: 27 },
  { species: "Cherry", representative: "black cherry", greenLbPerCubicFoot: 46 },
  { species: "Douglas Fir", representative: "coast Douglas-fir", greenLbPerCubicFoot: 38 },
  { species: "Elm", representative: "American elm", greenLbPerCubicFoot: 54 },
  { species: "Fir", representative: "white fir", greenLbPerCubicFoot: 47 },
  { species: "Hemlock", representative: "western hemlock", greenLbPerCubicFoot: 41 },
  { species: "Hickory", representative: "shagbark hickory", greenLbPerCubicFoot: 64 },
  { species: "Larch", representative: "western larch", greenLbPerCubicFoot: 48 },
  { species: "Maple", representative: "sugar maple", greenLbPerCubicFoot: 56 },
  { species: "Oak", representative: "white oak", greenLbPerCubicFoot: 62 },
  { species: "Pine", representative: "ponderosa pine", greenLbPerCubicFoot: 45 },
  { species: "Poplar", representative: "yellow poplar", greenLbPerCubicFoot: 38 },
  { species: "Redwood", representative: "redwood", greenLbPerCubicFoot: 55 },
  { species: "Spruce", representative: "Sitka spruce", greenLbPerCubicFoot: 33 },
  { species: "Walnut", representative: "black walnut", greenLbPerCubicFoot: 58 },
];

const KG_PER_LB = 0.45359237;
const M3_PER_FT3 = 0.028316846592;

export function greenWeightFor(species: string): GreenWeight | undefined {
  const key = species.trim().toLowerCase();
  return greenWeights.find((row) => row.species.toLowerCase() === key);
}

export function lbPerCubicFootToKgPerM3(lbPerCubicFoot: number): number {
  return (lbPerCubicFoot * KG_PER_LB) / M3_PER_FT3;
}

/** Nominal board feet occupy 1/12 cubic foot each. */
export function lumberWeightLb(boardFeet: number, lbPerCubicFoot: number): number {
  return (boardFeet / 12) * lbPerCubicFoot;
}

/** Cylinder from the entered diameter, which is an outside estimate, not a log scale. */
export function logWeightLb(
  diameterInches: number,
  lengthFeet: number,
  quantity: number,
  lbPerCubicFoot: number,
): number {
  const radiusFeet = diameterInches / 24;
  const cubicFeet = Math.PI * radiusFeet * radiusFeet * lengthFeet * quantity;
  return cubicFeet * lbPerCubicFoot;
}

export function transportNote(species: string): string | undefined {
  const row = greenWeightFor(species);
  if (!row) return undefined;
  return `${row.representative}, green / wet, ${row.greenLbPerCubicFoot} lb/ft³`;
}

export function logWeightKg(
  diameterMm: number,
  lengthMeters: number,
  quantity: number,
  kgPerM3: number,
): number {
  const radiusMeters = diameterMm / 2000;
  const cubicMeters = Math.PI * radiusMeters * radiusMeters * lengthMeters * quantity;
  return cubicMeters * kgPerM3;
}
