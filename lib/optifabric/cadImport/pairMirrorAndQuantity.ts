/**
 * OptiFabric AI
 * RC5-005-008 — Pair/Mirror & Quantity Classification (Step 5B §11, §14, §15)
 *
 * Purpose:
 * - Step 5A documented a real semantic gap: `cutQuantity = 2` does not by
 *   itself mean "two identical, orientation-free copies." A left/right
 *   pair, a cut-on-fold symmetric piece, and two truly identical pieces are
 *   all different production realities that a bare quantity number cannot
 *   distinguish. This module represents that distinction explicitly rather
 *   than collapsing it, and marks anything without real evidence as
 *   unevidenced "single" — never a fabricated pair/mirror claim.
 */

import type { CadPairMirrorMetadata, CadPairRole } from "./importedPatternSetTypes";
import type { TextEvidence } from "./garmentSemanticsExtraction";
import type { ExtractedInsert } from "./dxfEntityExtraction";

/**
 * HEURISTIC text-keyword lists for pair/mirror/quantity evidence — not a
 * confirmed AAMA standard (see garmentSemanticsExtraction.ts's header note;
 * the same caveat applies here).
 */
const PAIR_KEYWORDS: ReadonlyArray<{ pattern: RegExp; role: CadPairRole }> = [
  { pattern: /\bleft\b/i, role: "left" },
  { pattern: /\bright\b/i, role: "right" },
  { pattern: /\bcut\s*on\s*fold\b/i, role: "symmetric" },
  { pattern: /\bsymmetric\b/i, role: "symmetric" },
  { pattern: /\bmirror(ed)?\b/i, role: "mirroredPairUnspecifiedSide" },
  { pattern: /\bpair\b/i, role: "mirroredPairUnspecifiedSide" },
];

const QUANTITY_PATTERN = /\b(?:cut|qty|quantity)\s*[:\-]?\s*(\d{1,3})\b/i;

export function classifyPairMirror(
  textEvidence: TextEvidence,
  inserts: ReadonlyArray<ExtractedInsert>
): CadPairMirrorMetadata {
  for (const text of textEvidence.allNearbyText) {
    for (const { pattern, role } of PAIR_KEYWORDS) {
      if (pattern.test(text)) {
        return {
          role,
          evidenced: true,
          note: `Derived from nearby annotation text "${text}".`,
        };
      }
    }
  }

  // A negative X or Y scale on an INSERT is the standard DXF mechanism for
  // a mirrored block instance — real evidence, not a guess, when present.
  const mirroredInsert = inserts.find(
    (insert) => insert.blockName && (insert.xScale < 0 || insert.yScale < 0)
  );

  if (mirroredInsert) {
    return {
      role: "mirroredPairUnspecifiedSide",
      evidenced: true,
      note: `Derived from a mirrored INSERT of block "${mirroredInsert.blockName}".`,
    };
  }

  return {
    role: "single",
    evidenced: false,
    note: "No left/right, fold, mirror, or pair evidence found in nearby text or block inserts. Treated as a single piece — this is NOT a claim that the piece has no pair/mirror requirement, only that no evidence was found; confirm with the engineer before assuming orientation-free cutting.",
  };
}

export interface QuantityEvidence {
  readonly cutQuantity?: number;
  readonly source: "annotationText" | "none";
  readonly note: string;
}

export function classifyQuantity(textEvidence: TextEvidence): QuantityEvidence {
  for (const text of textEvidence.allNearbyText) {
    const match = QUANTITY_PATTERN.exec(text);

    if (match) {
      const quantity = Number(match[1]);

      if (Number.isFinite(quantity) && quantity >= 1) {
        return {
          cutQuantity: quantity,
          source: "annotationText",
          note: `Derived from nearby annotation text "${text}".`,
        };
      }
    }
  }

  return {
    cutQuantity: undefined,
    source: "none",
    note: "No cut-quantity annotation found. Per the Step 4C cutQuantity honesty precedent, this is left undefined rather than assumed to be 1 — engineering confirmation is required before this piece reaches the marker.",
  };
}
