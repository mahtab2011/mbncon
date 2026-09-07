// Mirrors OptiSewing's apps/api/src/modules/subscription/subscription.types.ts.
// See docs/LICENSE-AND-SUBSCRIPTION-TERMS.md (this repo) for the commercial
// terms this encodes.
export const TRIAL_PERIOD_DAYS = 90; // "free for 3 months"
export const GRACE_PERIOD_DAYS = 7; // "automatically cancelled after 7 days"

export const MONTHLY_BASE_PRICE_CENTS = 2998; // $29.98 for 2 users
export const MONTHLY_BASE_SEATS = 2;
export const MONTHLY_EXTRA_SEAT_PRICE_CENTS = 500; // $5.00 per extra user

export const ANNUAL_BASE_PRICE_CENTS = 30000; // $300.00 for 5 users
export const ANNUAL_BASE_SEATS = 5;
export const ANNUAL_EXTRA_SEAT_PRICE_CENTS = MONTHLY_EXTRA_SEAT_PRICE_CENTS * 12;

// Bangladesh-registered factories get 3 free included seats, permanently — no
// trial countdown, no online payment. Extra seats beyond the 3 cost
// $5.00/user/month (or the BDT equivalent), billed offline by an OptiFabric
// Bangladesh representative (see SubscriptionService.grantBangladeshExtraSeats
// / PlatformRepGuard), not through the online activate/cancel flow foreign
// factories use.
export const BD_INCLUDED_FREE_SEATS = 3;
export const BD_EXTRA_SEAT_PRICE_CENTS = 500; // $5.00 / extra user / month, billed by the BD rep

// Added at the user's explicit request: no payment gateway exists yet (planned
// after a 1-2 month trial period), so instead of a hard reject, ANY factory —
// Bangladeshi or foreign — can freely sign up its first 3 users. A 4th+ signup
// is accepted but held with isActive=false until an MBNCON/OptiFabric
// representative manually approves it (confirming payment was arranged
// offline) via AuthService.approvePendingUser. Deliberately a flat constant
// independent of MONTHLY_BASE_SEATS/BD_INCLUDED_FREE_SEATS — those describe
// what a *plan* includes; this describes how many seats never need approval
// at all, for anyone.
export const SEATS_ALLOWED_BEFORE_APPROVAL = 3;

export interface EffectiveSubscriptionState {
  status: "FREE_REGIONAL" | "TRIALING" | "ACTIVE" | "GRACE_PERIOD" | "EXPIRED" | "CANCELLED";
  isAccessAllowed: boolean;
  daysUntilExpiry: number | null;
  tampered: boolean;
  includedSeats: number | null;
  extraSeats: number | null;
  seatsUsed: number | null;
  canAddMoreUsers: boolean;
}

// The app is free, permanently, for factories registered in Bangladesh — the
// paid trial/subscription terms apply only to factories outside Bangladesh.
// Matched case-insensitively, including the Bangla spelling, so a factory can
// register in either script.
const BANGLADESH_COUNTRY_VALUES = ["bangladesh", "bd", "বাংলাদেশ"];

export function isBangladeshFactory(country: string): boolean {
  return BANGLADESH_COUNTRY_VALUES.includes(country.trim().toLowerCase());
}
