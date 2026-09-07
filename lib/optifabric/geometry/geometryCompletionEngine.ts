export type GeometryCompletionStatus =
  | "ready"
  | "pending"
  | "invalid";

export interface GeometryCompletionPiece {
  patternId: string;

  patternName: string;

  pieceType?: string;

  markerEligible: boolean;

  geometryAvailable: boolean;

  geometryValid: boolean;

  vertexCount: number;

  traceHref: string;

  status: GeometryCompletionStatus;
}

export interface GeometryCompletionSummary {
  totalPieces: number;

  markerEligiblePieces: number;

  readyPieces: number;

  pendingPieces: number;

  invalidPieces: number;

  completionPercent: number;

  markerReady: boolean;

  nextPiece:
    | GeometryCompletionPiece
    | null;

  pieces: GeometryCompletionPiece[];
}

export interface GeometryCompletionInputPiece {
  patternId: string;

  patternName: string;

  pieceType?: string;

  markerEligible?: boolean;

  geometryAvailable?: boolean;

  geometryValid?: boolean;

  vertexCount?: number;
}

function clampPercentage(
  value: number
): number {
  return Math.min(
    100,
    Math.max(0, value)
  );
}

function createPieceStatus({
  geometryAvailable,
  geometryValid,
}: {
  geometryAvailable: boolean;
  geometryValid: boolean;
}): GeometryCompletionStatus {
  if (
    geometryAvailable &&
    geometryValid
  ) {
    return "ready";
  }

  if (
    geometryAvailable &&
    !geometryValid
  ) {
    return "invalid";
  }

  return "pending";
}

export function createGeometryCompletionSummary({
  projectId,
  pieces,
}: {
  projectId: string;

  pieces: GeometryCompletionInputPiece[];
}): GeometryCompletionSummary {
  const completionPieces:
    GeometryCompletionPiece[] =
    pieces.map((piece) => {
      const markerEligible =
        piece.markerEligible ??
        true;

      const geometryAvailable =
        piece.geometryAvailable ??
        false;

      const geometryValid =
        piece.geometryValid ??
        false;

      const status =
        createPieceStatus({
          geometryAvailable,
          geometryValid,
        });

      return {
        patternId:
          piece.patternId,

        patternName:
          piece.patternName,

        pieceType:
          piece.pieceType,

        markerEligible,

        geometryAvailable,

        geometryValid,

        vertexCount:
          piece.vertexCount ?? 0,

        traceHref:
          `/optifabric/project/${projectId}/patterns/${piece.patternId}/trace`,

        status,
      };
    });

  const eligiblePieces =
    completionPieces.filter(
      (piece) =>
        piece.markerEligible
    );

  const readyPieces =
    eligiblePieces.filter(
      (piece) =>
        piece.status === "ready"
    ).length;

  const pendingPieces =
    eligiblePieces.filter(
      (piece) =>
        piece.status === "pending"
    ).length;

  const invalidPieces =
    eligiblePieces.filter(
      (piece) =>
        piece.status === "invalid"
    ).length;

  const completionPercent =
    eligiblePieces.length > 0
      ? clampPercentage(
          (
            readyPieces /
            eligiblePieces.length
          ) *
            100
        )
      : 0;

  const nextPiece =
    eligiblePieces.find(
      (piece) =>
        piece.status !== "ready"
    ) ?? null;

  return {
    totalPieces:
      completionPieces.length,

    markerEligiblePieces:
      eligiblePieces.length,

    readyPieces,

    pendingPieces,

    invalidPieces,

    completionPercent:
      Number(
        completionPercent.toFixed(
          1
        )
      ),

    markerReady:
      eligiblePieces.length > 0 &&
      readyPieces ===
        eligiblePieces.length &&
      invalidPieces === 0,

    nextPiece,

    pieces:
      completionPieces,
  };
}

function getGarmentPiecePriority(
  piece: GeometryCompletionPiece
): number {
  const searchableText = [
    piece.patternName,
    piece.pieceType ?? "",
    piece.patternId,
  ]
    .join(" ")
    .toLowerCase();

  const priorityRules: Array<{
    priority: number;
    keywords: string[];
  }> = [
    {
      priority: 10,
      keywords: [
        "front",
        "body front",
        "centre front",
        "center front",
      ],
    },

    {
      priority: 20,
      keywords: [
        "back",
        "body back",
        "centre back",
        "center back",
      ],
    },

    {
      priority: 30,
      keywords: [
        "side panel",
        "side body",
        "princess panel",
      ],
    },

    {
      priority: 40,
      keywords: [
        "yoke",
        "back yoke",
        "front yoke",
      ],
    },

    {
      priority: 50,
      keywords: [
        "sleeve",
        "upper sleeve",
        "under sleeve",
        "short sleeve",
        "long sleeve",
      ],
    },

    {
      priority: 60,
      keywords: [
        "collar stand",
        "collar band",
        "neck band",
      ],
    },

    {
      priority: 70,
      keywords: [
        "collar",
        "top collar",
        "under collar",
      ],
    },

    {
      priority: 80,
      keywords: [
        "cuff",
        "cuff facing",
      ],
    },

    {
      priority: 90,
      keywords: [
        "placket",
        "front placket",
        "sleeve placket",
        "button stand",
      ],
    },

    {
      priority: 100,
      keywords: [
        "pocket bag",
        "pocket",
      ],
    },

    {
      priority: 110,
      keywords: [
        "pocket flap",
        "flap",
      ],
    },

    {
      priority: 120,
      keywords: [
        "waistband",
        "waist band",
      ],
    },

    {
      priority: 130,
      keywords: [
        "belt loop",
        "beltloop",
      ],
    },

    {
      priority: 140,
      keywords: [
        "fly",
        "fly shield",
        "fly facing",
      ],
    },

    {
      priority: 150,
      keywords: [
        "facing",
        "front facing",
        "neck facing",
      ],
    },

    {
      priority: 160,
      keywords: [
        "lining",
        "liner",
      ],
    },

    {
      priority: 170,
      keywords: [
        "interlining",
        "fusing",
        "fusible",
      ],
    },

    {
      priority: 180,
      keywords: [
        "binding",
        "tape",
      ],
    },

    {
      priority: 190,
      keywords: [
        "label",
        "patch",
        "reinforcement",
      ],
    },
  ];

  const matchedRule =
    priorityRules.find((rule) =>
      rule.keywords.some((keyword) =>
        searchableText.includes(
          keyword
        )
      )
    );

  return matchedRule?.priority ?? 999;
}

export function sortGeometryCompletionPieces(
  pieces: GeometryCompletionPiece[]
): GeometryCompletionPiece[] {
  const statusPriority: Record<
    GeometryCompletionStatus,
    number
  > = {
    invalid: 0,
    pending: 1,
    ready: 2,
  };

  return [...pieces].sort(
    (first, second) => {
      const statusDifference =
        statusPriority[first.status] -
        statusPriority[second.status];

      if (statusDifference !== 0) {
        return statusDifference;
      }

      const garmentPriorityDifference =
        getGarmentPiecePriority(first) -
        getGarmentPiecePriority(second);

      if (
        garmentPriorityDifference !== 0
      ) {
        return garmentPriorityDifference;
      }

      return first.patternName.localeCompare(
        second.patternName
      );
    }
  );
}

export const geometryCompletionEngine = {
  createGeometryCompletionSummary,

  sortGeometryCompletionPieces,
};

export default geometryCompletionEngine;