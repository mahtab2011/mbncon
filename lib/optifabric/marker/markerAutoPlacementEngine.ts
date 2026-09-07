export interface AutoPlacementPattern {
  id: string;

  x: number;
  y: number;

  width: number;
  height: number;
}

export interface AutoPlacementOptions {
  fabricWidth: number;

  horizontalGap?: number;

  verticalGap?: number;

  maximumIterations?: number;
}

export function resolveSimplePlacement(
  patterns: AutoPlacementPattern[],
  options: AutoPlacementOptions
): AutoPlacementPattern[] {
  const horizontalGap =
    options.horizontalGap ?? 2;

  const verticalGap =
    options.verticalGap ?? 2;

  const placed: AutoPlacementPattern[] = [];

  for (const pattern of patterns) {
    const current = {
      ...pattern,
    };

    let iterations = 0;

    while (
      overlapsAny(current, placed) &&
      iterations <
        (options.maximumIterations ?? 500)
    ) {
      current.x += horizontalGap;

      if (
        current.x + current.width >
        options.fabricWidth
      ) {
        current.x = 0;

        current.y +=
          current.height +
          verticalGap;
      }

      iterations++;
    }

    placed.push(current);
  }

  return placed;
}

function overlapsAny(
  current: AutoPlacementPattern,
  placed: AutoPlacementPattern[]
): boolean {
  return placed.some((item) =>
    rectanglesOverlap(current, item)
  );
}

function rectanglesOverlap(
  a: AutoPlacementPattern,
  b: AutoPlacementPattern
): boolean {
  return !(
    a.x + a.width <= b.x ||
    b.x + b.width <= a.x ||
    a.y + a.height <= b.y ||
    b.y + b.height <= a.y
  );
}