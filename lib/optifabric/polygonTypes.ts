export interface PolygonPoint {
  id: string;
  x: number;
  y: number;
}

export interface PatternPolygon {
  id: string;

  pieceName: string;

  size: string;

  points: PolygonPoint[];

  areaPixels: number;

  areaSqInches: number;

  grainDirection:
    | "Vertical"
    | "Horizontal"
    | "Bias";

  mirrored: boolean;

  rotationAllowed: boolean;
}

export interface PatternProject {
  id: string;

  projectName: string;

  productType: string;

  fabricType: string;

  fabricWidth: number;

  polygons: PatternPolygon[];
}