export type StackZone = {
  /** Board thickness in eighths of an inch, matching the thickness menu. */
  thickness: number;
  /** Board count. The last zone ignores this and fills the cant. */
  count: number | null;
};

export function buildCutPositions(input: {
  flitchHalfInches: number;
  totalInches: number;
  kerf32: number;
  side: string;
  zones: StackZone[];
}): number[] {
  const positions: number[] = [];
  let current = Number(input.flitchHalfInches) * 16;
  const kerf = Number(input.kerf32) || 0;
  const side = input.side;

  if (current > 0) {
    if (side === "top") current += kerf;
    positions.push(current);
    if (side === "bottom") current += kerf;
  }

  const zones = input.zones.length
    ? input.zones
    : [{ thickness: 13, count: null }];
  const total32 = Number(input.totalInches) * 32;

  function addBoard(thicknessEighths: number) {
    current += thicknessEighths * 4;
    if (side === "top") current += kerf;
    if (current > 0) positions.push(current);
    if (side === "bottom") current += kerf;
  }

  for (let i = 0; i < zones.length; i++) {
    const zone = zones[i];
    if (!(zone.thickness > 0)) continue;
    const fillsCant = i === zones.length - 1;
    if (fillsCant) {
      let guard = 0;
      while (current <= total32 && guard < 400) {
        addBoard(zone.thickness);
        guard++;
      }
    } else {
      const count = Math.max(0, Math.min(100, Math.round(zone.count ?? 0)));
      for (let n = 0; n < count; n++) addBoard(zone.thickness);
    }
  }

  return positions;
}
