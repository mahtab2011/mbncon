/**
 * OptiFabric AI
 * RC5-004-014 — Canonical Marker Rotation Policy Engine
 *
 * SINGLE SOURCE OF TRUTH for which orientations a marker piece may legally
 * take, replacing the previous fixed/global rotation behaviour.
 *
 * BACKGROUND (from the Step 2 audit)
 *
 * The live marker page's `resolveAllowedRotations()` read a field
 * (`pattern.rotationRules?.allowedAngles`) that is never written anywhere in
 * the codebase, and its return type structurally excluded 180°/270° even
 * when angles were supplied. In practice every real pattern today resolves
 * to a single fixed 0° orientation, regardless of whether the fabric or
 * pattern piece actually has any rotation restriction at all.
 *
 * Meanwhile the pattern-recognition -> geometry pipeline
 * (patternRecognitionTypes.ts -> patternGeometryEngine.ts) already computes
 * real, per-piece production-rule signals and saves them on every pattern as
 * `PatternGeometryResult.constraints` (see patternGeometryTypes.ts):
 *
 *   grainControlled: boolean       — grain direction is known and matters
 *   rotation: GeometryRotation      — "fixed" | "rotate-180" | "rotate-90" | "free"
 *   directionalFabric: boolean      — the piece's own recognised rotation rule is "fixed"
 *   napDirection: boolean           — a "directional-fabric" restriction was recorded
 *   stripeMatch / checkMatch        — read but NOT used for rotation gating here (see below)
 *
 * That saved data was never read by the marker page at all — its
 * `MarkerGeometryPattern` type does not even declare a `constraints` field,
 * so the signal is lost before nesting, not merely mis-weighted.
 *
 * WHAT THIS ENGINE DOES
 *
 * Given a piece's production-rule signals, it computes THREE things:
 *
 *   geometricRotations    — orientations that are mathematically possible
 *                            for this piece considered alone (from its own
 *                            rotation freedom, ignoring fabric constraints).
 *   permittedRotations     — orientations actually permitted for production,
 *                            after also applying grain and nap/one-way
 *                            restrictions. THIS is the hard constraint every
 *                            nesting/repacking/hole-filling call site must
 *                            use.
 *   usedFallbackPolicy     — true when no production-rule metadata was
 *                            available at all (e.g. a project saved before
 *                            this engine existed). The conservative,
 *                            backward-compatible answer in that case is "no
 *                            rotation" (0° only) — identical to what every
 *                            real pattern already resolved to before this
 *                            step, so nothing regresses.
 *
 * COMPOSITION RULES (deliberately conservative — see "Do not invent
 * textile rules" in the Step 2 brief)
 *
 * 1. Grain: a 90°/270° turn rotates the grain line onto the cross-grain
 *    axis. When `grainControlled` is true, only 0° and 180° are permitted —
 *    180° preserves which axis the grain line runs along (only which end
 *    faces which way changes), so it is not a grain violation by itself.
 *
 * 2. Nap / one-way / directional fabric: a 180° reversal changes which end
 *    of the piece points toward the fabric's nap/print direction. When
 *    `directionalFabric` or `napDirection` is true, 180° is removed from the
 *    permitted set. This is applied independently of the grain rule, so a
 *    piece that is both grain-controlled AND on directional fabric ends up
 *    with 0° only — the intersection of both restrictions, which is
 *    correct: {0,180} ∩ {0,90,270} = {0}.
 *
 * 3. stripeMatch / checkMatch are intentionally NOT used to restrict
 *    rotation in this step. Stripe/check REPEAT ALIGNMENT is explicitly out
 *    of scope for Step 2 ("Do NOT implement plaid/stripe repeat alignment
 *    yet"), and turning them into a rotation restriction here would be
 *    inventing a textile rule the brief did not ask for. They are exposed
 *    on the input/result so a later step can use them once that alignment
 *    work is actually implemented.
 *
 * 4. The piece's OWN geometric rotation rule (`rotation`) is applied first
 *    and is never widened by the fabric-level rules above — only narrowed.
 */

export type MarkerRotationAngle = 0 | 90 | 180 | 270;

/**
 * Mirrors GeometryRotation (patternGeometryTypes.ts) / MarkerRotationRule
 * (patternRecognitionTypes.ts) structurally, without importing them, so this
 * engine has no hard dependency on the geometry pipeline's module graph.
 * Any value structurally matching one of these strings is accepted.
 */
export type MarkerGeometricRotationRule =
  | "fixed"
  | "rotate-180"
  | "rotate-90"
  | "free";

export interface MarkerRotationPolicyInput {
  /**
   * The piece's own geometric rotation freedom, e.g.
   * PatternGeometryResult.constraints.rotation. Undefined means the
   * geometry pipeline has not supplied this pattern at all (legacy/unknown
   * pattern) — see usedFallbackPolicy.
   */
  readonly geometricRotationRule?: MarkerGeometricRotationRule;

  /** e.g. PatternGeometryResult.constraints.grainControlled */
  readonly grainControlled?: boolean;

  /** e.g. PatternGeometryResult.constraints.directionalFabric */
  readonly directionalFabric?: boolean;

  /** e.g. PatternGeometryResult.constraints.napDirection */
  readonly napDirection?: boolean;

  /**
   * Read but not yet used for rotation gating — see module doc, rule 3.
   */
  readonly stripeMatch?: boolean;
  readonly checkMatch?: boolean;
}

export interface MarkerRotationPolicyResult {
  /** Orientations mathematically possible for this piece alone. */
  readonly geometricRotations: ReadonlyArray<MarkerRotationAngle>;

  /**
   * Orientations actually permitted for production. This is the hard
   * constraint — every nesting, repacking, recovery and hole-filling call
   * site must draw candidate orientations only from this list.
   */
  readonly permittedRotations: ReadonlyArray<MarkerRotationAngle>;

  /** True when grain control removed at least one orientation. */
  readonly grainRestricted: boolean;

  /** True when nap/one-way/directional fabric removed 180°. */
  readonly directionRestricted: boolean;

  /**
   * True when no production-rule metadata was supplied at all. The result
   * is then the conservative fallback (0° only), not a claim of compliance.
   */
  readonly usedFallbackPolicy: boolean;

  /** Short, UI-safe status text — see statusLabel usage notes below. */
  readonly statusLabel: string;
}

const ALL_ANGLES: ReadonlyArray<MarkerRotationAngle> = [0, 90, 180, 270];
const GRAIN_SAFE_ANGLES: ReadonlyArray<MarkerRotationAngle> = [0, 180];
const DIRECTION_SAFE_ANGLES: ReadonlyArray<MarkerRotationAngle> = [
  0, 90, 270,
];

function resolveGeometricRotations(
  rule: MarkerGeometricRotationRule | undefined
): ReadonlyArray<MarkerRotationAngle> {
  switch (rule) {
    case "fixed":
      return [0];

    case "rotate-180":
      return [0, 180];

    case "rotate-90":
    case "free":
      return ALL_ANGLES;

    default:
      return [0];
  }
}

function intersectAngles(
  base: ReadonlyArray<MarkerRotationAngle>,
  restriction: ReadonlyArray<MarkerRotationAngle>
): MarkerRotationAngle[] {
  return base.filter((angle) => restriction.includes(angle));
}

/**
 * Computes the production-safe rotation policy for one marker piece.
 *
 * ABSOLUTE and REPRODUCIBLE: a pure function of this piece's own signals.
 */
export function resolveMarkerRotationPolicy(
  input: MarkerRotationPolicyInput
): MarkerRotationPolicyResult {
  const usedFallbackPolicy =
    input.geometricRotationRule === undefined &&
    input.grainControlled === undefined &&
    input.directionalFabric === undefined &&
    input.napDirection === undefined;

  const geometricRotations = resolveGeometricRotations(
    input.geometricRotationRule
  );

  let permitted: MarkerRotationAngle[] = [...geometricRotations];

  const grainRestrictionApplies = input.grainControlled === true;

  if (grainRestrictionApplies) {
    permitted = intersectAngles(permitted, GRAIN_SAFE_ANGLES);
  }

  const directionRestrictionApplies =
    input.directionalFabric === true || input.napDirection === true;

  if (directionRestrictionApplies) {
    permitted = intersectAngles(permitted, DIRECTION_SAFE_ANGLES);
  }

  /**
   * A piece must always have at least one usable orientation. If every
   * angle got filtered out (only possible if the geometric rule itself was
   * already more restrictive than assumed), 0° — the orientation the piece
   * was originally traced in — is always safe to fall back to.
   */
  if (permitted.length === 0) {
    permitted = [0];
  }

  const grainRestricted =
    grainRestrictionApplies &&
    permitted.length < geometricRotations.length;

  const directionRestricted =
    directionRestrictionApplies && !permitted.includes(180);

  const statusLabel = usedFallbackPolicy
    ? "Fallback rotation policy — no grain/direction metadata available"
    : permitted.length === 1
      ? "Rotation fixed at 0°"
      : grainRestricted && directionRestricted
        ? "Grain and direction compliant (0° only)"
        : grainRestricted
          ? "Grain compliant (0°/180° only)"
          : directionRestricted
            ? "Direction/nap compliant (180° prohibited)"
            : "Unrestricted rotation";

  return {
    geometricRotations,
    permittedRotations: permitted,
    grainRestricted,
    directionRestricted,
    usedFallbackPolicy,
    statusLabel,
  };
}

/** True when the given angle is one of the piece's permitted orientations. */
export function isRotationPermitted(
  policy: MarkerRotationPolicyResult,
  angle: number
): boolean {
  return policy.permittedRotations.includes(angle as MarkerRotationAngle);
}
