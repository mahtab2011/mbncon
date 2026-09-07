export interface MarkerPlacementPolygon {
  patternId: string;

  boundingBox: {
    width: number;
    height: number;
  };
}

export interface MarkerPlacement {
  patternId: string;

  x: number;
  y: number;

  rotation: number;
}

export interface MarkerPlacementInput {
  polygons: MarkerPlacementPolygon[];

  fabricWidth: number;

  spacing: number;

  edgeAllowance: number;

  allowRotation: boolean;
}

export interface MarkerPlacementResult {
  placements: MarkerPlacement[];

  markerLength: number;
}

function isValidPositiveNumber(
  value: number
): boolean {
  return (
    Number.isFinite(value) &&
    value > 0
  );
}

export function generateMarkerPlacement(
  input: MarkerPlacementInput
): MarkerPlacementResult {
  if (
    !isValidPositiveNumber(
      input.fabricWidth
    )
  ) {
    throw new Error(
      "Fabric width must be greater than zero."
    );
  }

  const spacing =
    Number.isFinite(input.spacing) &&
    input.spacing >= 0
      ? input.spacing
      : 0;

  const edgeAllowance =
    Number.isFinite(
      input.edgeAllowance
    ) &&
    input.edgeAllowance >= 0
      ? input.edgeAllowance
      : 0;

  const usableFabricWidth =
    input.fabricWidth -
    edgeAllowance * 2;

  if (usableFabricWidth <= 0) {
    throw new Error(
      "Edge allowance leaves no usable fabric width."
    );
  }

  const placements:
    MarkerPlacement[] = [];

  let currentX =
    edgeAllowance;

  let currentY =
    edgeAllowance;

  let rowHeight = 0;

  for (
    const polygon
    of input.polygons
  ) {
    const originalWidth =
      polygon.boundingBox.width;

    const originalHeight =
      polygon.boundingBox.height;

    if (
      !isValidPositiveNumber(
        originalWidth
      ) ||
      !isValidPositiveNumber(
        originalHeight
      )
    ) {
      continue;
    }

    let width =
      originalWidth;

    let height =
      originalHeight;

    let rotation = 0;

    const availableRowWidth =
      input.fabricWidth -
      edgeAllowance -
      currentX;

    const fitsNormally =
      width <= availableRowWidth;

    const fitsRotated =
      input.allowRotation &&
      height <= availableRowWidth &&
      width <= usableFabricWidth;

    if (
      !fitsNormally &&
      fitsRotated
    ) {
      width =
        originalHeight;

      height =
        originalWidth;

      rotation = 90;
    }

    const exceedsCurrentRow =
      currentX +
        width >
      input.fabricWidth -
        edgeAllowance;

    if (exceedsCurrentRow) {
      currentX =
        edgeAllowance;

      currentY +=
        rowHeight +
        spacing;

      rowHeight = 0;

      const fitsNewRowNormally =
        width <=
        usableFabricWidth;

      const fitsNewRowRotated =
        input.allowRotation &&
        originalHeight <=
          usableFabricWidth;

      if (
        !fitsNewRowNormally &&
        fitsNewRowRotated
      ) {
        width =
          originalHeight;

        height =
          originalWidth;

        rotation = 90;
      }
    }

    if (
      width >
      usableFabricWidth
    ) {
      continue;
    }

    placements.push({
      patternId:
        polygon.patternId,

      x: currentX,

      y: currentY,

      rotation,
    });

    currentX +=
      width +
      spacing;

    rowHeight =
      Math.max(
        rowHeight,
        height
      );
  }

  const markerLength =
    placements.length > 0
      ? currentY +
        rowHeight +
        edgeAllowance
      : 0;

  return {
    placements,

    markerLength:
      Number(
        markerLength.toFixed(3)
      ),
  };
}

export default generateMarkerPlacement;