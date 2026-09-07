export interface MarkerPieceColour {
  fill: string;
  stroke: string;
  text: string;
  selectedFill: string;
  selectedStroke: string;
}

const MARKER_COLOUR_PALETTE: MarkerPieceColour[] = [
  {
    fill: "rgba(34, 211, 238, 0.20)",
    stroke: "rgb(34, 211, 238)",
    text: "rgb(207, 250, 254)",
    selectedFill: "rgba(34, 211, 238, 0.38)",
    selectedStroke: "rgb(103, 232, 249)",
  },
  {
    fill: "rgba(52, 211, 153, 0.20)",
    stroke: "rgb(52, 211, 153)",
    text: "rgb(209, 250, 229)",
    selectedFill: "rgba(52, 211, 153, 0.38)",
    selectedStroke: "rgb(110, 231, 183)",
  },
  {
    fill: "rgba(251, 146, 60, 0.20)",
    stroke: "rgb(251, 146, 60)",
    text: "rgb(255, 237, 213)",
    selectedFill: "rgba(251, 146, 60, 0.38)",
    selectedStroke: "rgb(253, 186, 116)",
  },
  {
    fill: "rgba(167, 139, 250, 0.20)",
    stroke: "rgb(167, 139, 250)",
    text: "rgb(237, 233, 254)",
    selectedFill: "rgba(167, 139, 250, 0.38)",
    selectedStroke: "rgb(196, 181, 253)",
  },
  {
    fill: "rgba(250, 204, 21, 0.18)",
    stroke: "rgb(250, 204, 21)",
    text: "rgb(254, 249, 195)",
    selectedFill: "rgba(250, 204, 21, 0.34)",
    selectedStroke: "rgb(253, 224, 71)",
  },
  {
    fill: "rgba(244, 114, 182, 0.20)",
    stroke: "rgb(244, 114, 182)",
    text: "rgb(252, 231, 243)",
    selectedFill: "rgba(244, 114, 182, 0.38)",
    selectedStroke: "rgb(249, 168, 212)",
  },
  {
    fill: "rgba(96, 165, 250, 0.20)",
    stroke: "rgb(96, 165, 250)",
    text: "rgb(219, 234, 254)",
    selectedFill: "rgba(96, 165, 250, 0.38)",
    selectedStroke: "rgb(147, 197, 253)",
  },
  {
    fill: "rgba(248, 113, 113, 0.20)",
    stroke: "rgb(248, 113, 113)",
    text: "rgb(254, 226, 226)",
    selectedFill: "rgba(248, 113, 113, 0.38)",
    selectedStroke: "rgb(252, 165, 165)",
  },
];

function createStableHash(value: string): number {
  let hash = 0;

  for (
    let index = 0;
    index < value.length;
    index += 1
  ) {
    hash =
      (hash * 31 +
        value.charCodeAt(index)) >>>
      0;
  }

  return hash;
}

export function getMarkerPieceColour(
  pieceId: string
): MarkerPieceColour {
  const index =
    createStableHash(pieceId) %
    MARKER_COLOUR_PALETTE.length;

  return MARKER_COLOUR_PALETTE[index];
}

export function getMarkerPieceDisplayColour({
  pieceId,
  selected,
  invalid,
}: {
  pieceId: string;
  selected?: boolean;
  invalid?: boolean;
}): {
  fill: string;
  stroke: string;
  text: string;
} {
  if (invalid) {
    return {
      fill: "rgba(239, 68, 68, 0.32)",
      stroke: "rgb(248, 113, 113)",
      text: "rgb(254, 226, 226)",
    };
  }

  const colour =
    getMarkerPieceColour(pieceId);

  return selected
    ? {
        fill: colour.selectedFill,
        stroke: colour.selectedStroke,
        text: colour.text,
      }
    : {
        fill: colour.fill,
        stroke: colour.stroke,
        text: colour.text,
      };
}

export function createMarkerLegendColours(
  pieceIds: string[]
): Record<string, MarkerPieceColour> {
  return pieceIds.reduce<
    Record<string, MarkerPieceColour>
  >((result, pieceId) => {
    result[pieceId] =
      getMarkerPieceColour(pieceId);

    return result;
  }, {});
}

export const markerColourEngine = {
  getMarkerPieceColour,
  getMarkerPieceDisplayColour,
  createMarkerLegendColours,
};

export default markerColourEngine;