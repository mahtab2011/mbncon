export interface RotationCandidate {
  width: number;
  height: number;
}

export interface RotationResult {
  width: number;
  height: number;
  rotation: 0 | 90;
}

export function chooseBestRotation(
  candidate: RotationCandidate,
  availableWidth: number,
  allowRotation: boolean
): RotationResult {

  if (
    candidate.width <= availableWidth
  ) {
    return {
      width: candidate.width,
      height: candidate.height,
      rotation: 0,
    };
  }

  if (
    allowRotation &&
    candidate.height <= availableWidth
  ) {
    return {
      width: candidate.height,
      height: candidate.width,
      rotation: 90,
    };
  }

  return {
    width: candidate.width,
    height: candidate.height,
    rotation: 0,
  };
}