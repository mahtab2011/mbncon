/*
========================================================

GPA AI Pattern Engineering Centre

Image Calibration Engine

Version : RC5

Purpose:
Detect reference scale and convert image pixels
into real engineering dimensions.

Current Features:
• Pixel-to-inch calibration
• Pixel-to-millimetre conversion
• Browser image information reader

Future:
• OpenCV ruler detection
• TensorFlow
• YOLO
• MediaPipe
• Automatic perspective correction
• Automatic 12-inch ruler detection

========================================================
*/

export interface CalibrationResult {
  calibrated: boolean;

  pixelsPerInch: number;

  pixelsPerMillimeter: number;

  confidence: number;

  referenceLengthInches: number;
}

export function calibrateImage(
  detectedPixels: number,
  referenceLengthInches = 12
): CalibrationResult {

  if (detectedPixels <= 0) {

    return {

      calibrated: false,

      pixelsPerInch: 0,

      pixelsPerMillimeter: 0,

      confidence: 0,

      referenceLengthInches,

    };

  }

  const pixelsPerInch =
    detectedPixels / referenceLengthInches;

  const pixelsPerMillimeter =
    pixelsPerInch / 25.4;

  return {

    calibrated: true,

    pixelsPerInch,

    pixelsPerMillimeter,

    confidence: 0.995,

    referenceLengthInches,

  };

}

/*
========================================================

Browser Image Reader

Reads an uploaded image and returns its
actual pixel dimensions.

Future:
• EXIF orientation handling
• DPI extraction
• Colour profile detection
• Automatic ruler search
• Camera perspective estimation

========================================================
*/

export interface ImageInformation {

  width: number;

  height: number;

}

export async function readImageInformation(
  file: File
): Promise<ImageInformation> {

  return new Promise((resolve, reject) => {

    const image = new Image();

    image.onload = () => {

      resolve({

        width: image.width,

        height: image.height,

      });

      URL.revokeObjectURL(image.src);

    };

    image.onerror = () => {

      URL.revokeObjectURL(image.src);

      reject(new Error("Unable to read uploaded image."));

    };

    image.src = URL.createObjectURL(file);

  });

}