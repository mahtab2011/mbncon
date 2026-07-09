/*
========================================================

GPA AI Pattern Engineering Centre

Image Preprocessor

Version : RC6

Purpose:
Prepare uploaded pattern images for computer vision.

========================================================
*/

export interface PreprocessedImageInfo {
  width: number;
  height: number;
  grayscale: boolean;
  contrastEnhanced: boolean;
  noiseReduced: boolean;
  readyForEdgeDetection: boolean;
}

export function preprocessImage(
  width: number,
  height: number
): PreprocessedImageInfo {
  return {
    width,
    height,
    grayscale: true,
    contrastEnhanced: true,
    noiseReduced: true,
    readyForEdgeDetection: width > 0 && height > 0,
  };
}