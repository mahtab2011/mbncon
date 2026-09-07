import type {
  GeometryPoint,
} from "@/lib/optifabric/patternGeometryTypes";

import type {
  MarkerLayout,
  PlacedMarkerPiece,
} from "@/lib/optifabric/markerTypes";

export interface MarkerViewport {
  widthPx: number;
  heightPx: number;

  paddingPx: number;

  pixelsPerCm: number;

  fabricWidthPx: number;
  markerLengthPx: number;

  viewBoxWidth: number;
  viewBoxHeight: number;
}

export interface RenderedMarkerPiece {
  id: string;

  sourcePieceId: string;

  patternId: string;

  name: string;

  instanceNumber: number;

  rotation: number;

  polygonPoints: GeometryPoint[];

  polygonPointString: string;

  labelX: number;
  labelY: number;

  boundingBox: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    width: number;
    height: number;
  };

  outsideMarker: boolean;
}

export interface MarkerRenderingResult {
  viewport: MarkerViewport;

  renderedPieces: RenderedMarkerPiece[];

  fabricBoundary: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

function clampValue(
  value: number,
  minimum: number,
  maximum: number
): number {
  return Math.min(
    maximum,
    Math.max(minimum, value)
  );
}

function calculatePointBoundingBox(
  points: GeometryPoint[]
): RenderedMarkerPiece["boundingBox"] {
  if (points.length === 0) {
    return {
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0,
      width: 0,
      height: 0,
    };
  }

  const xValues = points.map(
    (point) => point.x
  );

  const yValues = points.map(
    (point) => point.y
  );

  const minX = Math.min(...xValues);
  const minY = Math.min(...yValues);
  const maxX = Math.max(...xValues);
  const maxY = Math.max(...yValues);

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

function calculatePolygonCentroid(
  points: GeometryPoint[]
): GeometryPoint {
  if (points.length === 0) {
    return {
      x: 0,
      y: 0,
    };
  }

  const total = points.reduce(
    (result, point) => ({
      x: result.x + point.x,
      y: result.y + point.y,
    }),
    {
      x: 0,
      y: 0,
    }
  );

  return {
    x: total.x / points.length,
    y: total.y / points.length,
  };
}

export function createMarkerViewport({
  layout,
  widthPx = 1100,
  maximumHeightPx = 760,
  paddingPx = 30,
}: {
  layout: MarkerLayout;
  widthPx?: number;
  maximumHeightPx?: number;
  paddingPx?: number;
}): MarkerViewport {
  const safeFabricWidth =
    Math.max(
      layout.fabricWidthCm,
      1
    );

  const safeMarkerLength =
    Math.max(
      layout.markerLengthCm,
      1
    );

  const availableWidth =
    Math.max(
      widthPx - paddingPx * 2,
      1
    );

  const widthScale =
    availableWidth /
    safeFabricWidth;

  const requiredHeightAtWidthScale =
    safeMarkerLength *
      widthScale +
    paddingPx * 2;

  const heightScale =
    requiredHeightAtWidthScale >
    maximumHeightPx
      ? Math.max(
          (
            maximumHeightPx -
            paddingPx * 2
          ) / safeMarkerLength,
          0.1
        )
      : widthScale;

  const pixelsPerCm =
    clampValue(
      Math.min(
        widthScale,
        heightScale
      ),
      0.1,
      100
    );

  const fabricWidthPx =
    safeFabricWidth *
    pixelsPerCm;

  const markerLengthPx =
    safeMarkerLength *
    pixelsPerCm;

  return {
    widthPx,
    heightPx:
      markerLengthPx +
      paddingPx * 2,

    paddingPx,

    pixelsPerCm,

    fabricWidthPx,
    markerLengthPx,

    viewBoxWidth:
      fabricWidthPx +
      paddingPx * 2,

    viewBoxHeight:
      markerLengthPx +
      paddingPx * 2,
  };
}

function transformMarkerPoint(
  point: GeometryPoint,
  viewport: MarkerViewport
): GeometryPoint {
  return {
    x:
      viewport.paddingPx +
      point.x *
        viewport.pixelsPerCm,

    y:
      viewport.paddingPx +
      point.y *
        viewport.pixelsPerCm,
  };
}

export function renderPlacedMarkerPiece({
  piece,
  viewport,
  layout,
}: {
  piece: PlacedMarkerPiece;
  viewport: MarkerViewport;
  layout: MarkerLayout;
}): RenderedMarkerPiece {
  const polygonPoints =
    piece.transformedPolygon.map(
      (point) =>
        transformMarkerPoint(
          point,
          viewport
        )
    );

  const boundingBox =
    calculatePointBoundingBox(
      polygonPoints
    );

  const centroid =
    calculatePolygonCentroid(
      polygonPoints
    );

  const outsideMarker =
    piece.xCm < 0 ||
    piece.yCm < 0 ||
    piece.xCm +
      piece.widthCm >
      layout.fabricWidthCm ||
    piece.yCm +
      piece.heightCm >
      layout.markerLengthCm;

  return {
    id: piece.id,

    sourcePieceId:
      piece.sourcePieceId,

    patternId:
      piece.patternId,

    name:
      piece.name,

    instanceNumber:
      piece.instanceNumber,

    rotation:
      piece.rotation,

    polygonPoints,

    polygonPointString:
      polygonPoints
        .map(
          (point) =>
            `${point.x},${point.y}`
        )
        .join(" "),

    labelX:
      centroid.x,

    labelY:
      centroid.y,

    boundingBox,

    outsideMarker,
  };
}

export function createMarkerRenderingResult({
  layout,
  widthPx,
  maximumHeightPx,
  paddingPx,
}: {
  layout: MarkerLayout;
  widthPx?: number;
  maximumHeightPx?: number;
  paddingPx?: number;
}): MarkerRenderingResult {
  const viewport =
    createMarkerViewport({
      layout,
      widthPx,
      maximumHeightPx,
      paddingPx,
    });

  const renderedPieces =
    layout.placedPieces.map(
      (piece) =>
        renderPlacedMarkerPiece({
          piece,
          viewport,
          layout,
        })
    );

  return {
    viewport,

    renderedPieces,

    fabricBoundary: {
      x: viewport.paddingPx,
      y: viewport.paddingPx,

      width:
        viewport.fabricWidthPx,

      height:
        viewport.markerLengthPx,
    },
  };
}

export const markerRenderingEngine = {
  createMarkerViewport,
  renderPlacedMarkerPiece,
  createMarkerRenderingResult,
};

export default markerRenderingEngine;