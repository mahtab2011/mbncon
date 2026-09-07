import {
  createMarkerRenderingResult,
  type MarkerRenderingResult,
} from "./markerRenderingEngine";

import type {
  MarkerLayout,
} from "@/lib/optifabric/markerTypes";

export interface MarkerPreviewOptions {
  canvasWidth?: number;
  maximumCanvasHeight?: number;
  padding?: number;
}

export interface MarkerPreviewResult
  extends MarkerRenderingResult {
  zoom: number;
  panX: number;
  panY: number;
}

export function createMarkerPreview(
  layout: MarkerLayout,
  options: MarkerPreviewOptions = {}
): MarkerPreviewResult {
  const rendering =
    createMarkerRenderingResult({
      layout,
      widthPx:
        options.canvasWidth ?? 1100,
      maximumHeightPx:
        options.maximumCanvasHeight ??
        760,
      paddingPx:
        options.padding ?? 30,
    });

  return {
    ...rendering,

    zoom: 1,

    panX: 0,

    panY: 0,
  };
}

export function createZoomedPreview(
  layout: MarkerLayout,
  zoom: number
): MarkerPreviewResult {
  const preview =
    createMarkerPreview(layout);

  return {
    ...preview,

    zoom:
      Number.isFinite(zoom) &&
      zoom > 0
        ? zoom
        : 1,
  };
}

export function createPannedPreview(
  layout: MarkerLayout,
  panX: number,
  panY: number
): MarkerPreviewResult {
  const preview =
    createMarkerPreview(layout);

  return {
    ...preview,

    panX,

    panY,
  };
}

export const markerPreviewEngine = {
  createMarkerPreview,
  createZoomedPreview,
  createPannedPreview,
};

export default markerPreviewEngine;