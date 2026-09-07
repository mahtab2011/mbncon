export type MarkerPriority =
  | "maximum-utilisation"
  | "lowest-cost"
  | "shortest-marker"
  | "minimum-waste"
  | "highest-throughput"
  | "balanced";

export interface MarkerDecisionCandidate {
  garments: number;

  utilisation: number;

  waste: number;

  markerLength: number;

  estimatedCost: number;

  confidence: number;
}

export interface MarkerDecision {

  selected: MarkerDecisionCandidate;

  reason: string;

  engineeringComment: string;

  priority: MarkerPriority;

  /**
   * Decision-arbitration score for the "balanced" priority mode — it
   * measures how well the selected candidate satisfies a blend of
   * utilisation, waste, confidence and throughput chosen BY PRIORITY, not
   * the canonical marker-layout quality score. See
   * lib/optifabric/marker/markerScoringEngine.ts for that. Previously this
   * field used a different weighting (0.5/0.3/0.2) than the one actually
   * used to select the "balanced" candidate (0.4/0.25/0.2/0.15), so the
   * reported score did not necessarily reflect why that candidate won. Both
   * now use calculateBalancedScore below.
   */
  score: number;

}

function calculateBalancedScore(
  candidate: MarkerDecisionCandidate
): number {

  return (

    candidate.utilisation * 0.40 +

    (100 - candidate.waste) * 0.25 +

    candidate.confidence * 0.20 +

    candidate.garments * 0.15

  );

}

export function decideBestMarker(

  candidates: MarkerDecisionCandidate[],

  priority: MarkerPriority = "balanced"

): MarkerDecision {

  if (candidates.length === 0) {

    throw new Error("No marker candidates supplied.");

  }

  let selected = candidates[0];

  for (const candidate of candidates) {

    switch (priority) {

      case "maximum-utilisation":

        if (
          candidate.utilisation >
          selected.utilisation
        ) {
          selected = candidate;
        }

        break;

      case "minimum-waste":

        if (
          candidate.waste <
          selected.waste
        ) {
          selected = candidate;
        }

        break;

      case "shortest-marker":

        if (
          candidate.markerLength <
          selected.markerLength
        ) {
          selected = candidate;
        }

        break;

      case "lowest-cost":

        if (
          candidate.estimatedCost <
          selected.estimatedCost
        ) {
          selected = candidate;
        }

        break;

      case "highest-throughput":

        if (
          candidate.garments >
          selected.garments
        ) {
          selected = candidate;
        }

        break;

      case "balanced":

      default:

        const candidateScore =
          calculateBalancedScore(candidate);

        const selectedScore =
          calculateBalancedScore(selected);

        if (candidateScore > selectedScore) {

          selected = candidate;

        }

    }

  }

  return {

    selected,

    priority,

    score:

      Math.round(
        calculateBalancedScore(selected)
      ),

    reason:

      buildReason(selected, priority),

    engineeringComment:

      buildEngineeringComment(selected)

  };

}

function buildReason(

  candidate: MarkerDecisionCandidate,

  priority: MarkerPriority

): string {

  switch (priority) {

    case "maximum-utilisation":

      return "Selected because it delivers the highest fabric utilisation.";

    case "lowest-cost":

      return "Selected because it provides the lowest estimated cutting cost.";

    case "minimum-waste":

      return "Selected because it produces the lowest material waste.";

    case "shortest-marker":

      return "Selected because it minimises marker length.";

    case "highest-throughput":

      return "Selected because it maximises garments produced per marker.";

    default:

      return "Selected because it offers the best engineering balance.";

  }

}

function buildEngineeringComment(

  candidate: MarkerDecisionCandidate

): string {

  if (candidate.utilisation >= 90)

    return "Excellent engineering marker. Suitable for production.";

  if (candidate.utilisation >= 85)

    return "Very good marker with high production efficiency.";

  if (candidate.utilisation >= 80)

    return "Acceptable production marker.";

  if (candidate.utilisation >= 70)

    return "Marker can be improved through optimisation.";

  return "Marker should be re-optimised before production.";

}