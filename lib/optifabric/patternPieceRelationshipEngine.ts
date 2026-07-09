export type PatternPieceRole =
  | "front-panel"
  | "back-panel"
  | "sleeve"
  | "collar"
  | "cuff"
  | "pocket"
  | "waistband"
  | "lining"
  | "facing"
  | "hood"
  | "gusset"
  | "other";

export type PatternPieceRelationshipInput = {
  mainPieceName: string;
  mainPieceRole: PatternPieceRole;
  relatedPieceName: string;
  relatedPieceRole: PatternPieceRole;
  relationshipType:
    | "must-match"
    | "must-pair"
    | "mirror-pair"
    | "same-grain"
    | "same-stripe"
    | "same-print-repeat"
    | "can-optimize-separately";
};

export type PatternPieceRelationshipResult = {
  status: "ok" | "warning" | "critical";
  relationshipRiskScore: number;
  message: string;
  aiReason: string;
  recommendations: string[];
};

export function analyzePatternPieceRelationship(
  input: PatternPieceRelationshipInput
): PatternPieceRelationshipResult {
  const recommendations: string[] = [];
  let relationshipRiskScore = 0;

  if (input.relationshipType === "can-optimize-separately") {
    return {
      status: "ok",
      relationshipRiskScore: 10,
      message: "These pieces can be optimized separately.",
      aiReason:
        "AI asks this because independent pieces can be nested more freely to save fabric.",
      recommendations: [
        "Allow normal nesting for these pieces.",
        "Prioritize marker efficiency unless buyer specification requires matching.",
      ],
    };
  }

  if (input.relationshipType === "must-match") {
    relationshipRiskScore += 45;
    recommendations.push(
      "These pieces must be visually matched before fabric-saving optimization."
    );
  }

  if (input.relationshipType === "mirror-pair") {
    relationshipRiskScore += 40;
    recommendations.push(
      "Ensure left and right pieces are mirrored correctly before cutting."
    );
  }

  if (input.relationshipType === "must-pair") {
    relationshipRiskScore += 35;
    recommendations.push(
      "Keep paired pieces linked so quantity and assembly remain correct."
    );
  }

  if (input.relationshipType === "same-grain") {
    relationshipRiskScore += 30;
    recommendations.push(
      "Maintain the same grain direction between these related pieces."
    );
  }

  if (input.relationshipType === "same-stripe") {
    relationshipRiskScore += 45;
    recommendations.push(
      "Align stripe/check position between the related visible pieces."
    );
  }

  if (input.relationshipType === "same-print-repeat") {
    relationshipRiskScore += 45;
    recommendations.push(
      "Align print repeat before approving marker placement."
    );
  }

  if (
    input.mainPieceRole === "front-panel" ||
    input.relatedPieceRole === "front-panel"
  ) {
    relationshipRiskScore += 15;
    recommendations.push(
      "Front panel relationships are highly visible to buyer/customer."
    );
  }

  const status =
    relationshipRiskScore >= 70
      ? "critical"
      : relationshipRiskScore >= 35
        ? "warning"
        : "ok";

  return {
    status,
    relationshipRiskScore,
    message: "Pattern piece relationship analysis completed.",
    aiReason:
      "AI asks this because some pattern pieces must be cut as pairs or aligned together; otherwise sewing, appearance, and buyer quality can fail.",
    recommendations,
  };
}