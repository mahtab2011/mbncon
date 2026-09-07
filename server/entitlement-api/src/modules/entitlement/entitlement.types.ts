// Phase 1 central entitlement constants and shapes. These are a NEW,
// independent namespace — deliberately not imported from, or exported to,
// server/optifabric-api/src/modules/subscription/subscription.types.ts. The
// legacy $29.98/2-seat OptiFabric pricing model is untouched by this file;
// see CENTRAL-ENTITLEMENT-PHASE-1.md for how/when the two get reconciled.
import { EntitlementSource, PlanCode, Product } from "@prisma/client";

export { EntitlementSource, PlanCode, Product };

export const TRIAL_PERIOD_DAYS = 90;

// Monthly period convention: a FIXED 30-day window from the activation
// timestamp (currentPeriodStart + 30 * 24h), matching the exact convention
// already used by the legacy subscription.service.ts
// (`periodDays = planType === "ANNUAL" ? 365 : 30`) rather than true
// calendar-month arithmetic. This is a deliberate choice for
// existing-system compatibility and to avoid calendar edge cases (e.g. a
// plan activated on Jan 31 has no well-defined "one calendar month later"
// date). No auto-renewal exists yet — see EntitlementService docs.
export const MONTHLY_PERIOD_DAYS = 30;

export const OPTIFABRIC_MONTHLY_PRICE_CENTS = 1998; // US$19.98/month
export const OPTISEWING_MONTHLY_PRICE_CENTS = 1498; // US$14.98/month
export const BUNDLE_MONTHLY_PRICE_CENTS = 2998; // US$29.98/month

export const BANGLADESH_COUNTRY_VALUES = ["bangladesh", "bd", "বাংলাদেশ"];

// Deliberately NOT used to grant BANGLADESH_FREE entitlement in Phase 1 —
// see EntitlementService.grantBangladeshFreeEntitlement()'s own comment.
// Kept here only as a recognised-value list for a future trusted signal
// (e.g. a verified field coming from Bangladesh Apparel), not as a
// self-service country-text check.
export function isRecognisedBangladeshCountryValue(country: string): boolean {
  return BANGLADESH_COUNTRY_VALUES.includes(country.trim().toLowerCase());
}

export interface EffectiveEntitlement {
  organisationId: string;
  product: Product;
  isAccessAllowed: boolean;
  source: EntitlementSource | null;
  planCode: PlanCode | null;
  trialEndsAt: Date | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  reason:
    | "NO_ENTITLEMENT"
    | "BANGLADESH_FREE"
    | "TRIAL_ACTIVE"
    | "TRIAL_EXPIRED"
    | "PAID_ACTIVE"
    | "PAID_EXPIRED";
}

export interface TrialPair {
  optifabric: EffectiveEntitlement;
  optisewing: EffectiveEntitlement;
}
