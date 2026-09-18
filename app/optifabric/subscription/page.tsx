"use client";

// Subscription/status page for OptiFabric.
//
// Stage 2F-2: the primary access/status display below now reads the SAME
// central entitlement decision that server/optifabric-api's SubscriptionGuard
// enforces on every protected OptiFabric request (GET /entitlements/me/optifabric
// — see server/optifabric-api/src/entitlement/entitlement-status.controller.ts).
// This page does not recompute trial/paid expiry, organisation mapping, or
// the Bangladesh transitional-access rule itself — it only displays what
// that endpoint reports, exactly as the task that introduced it required
// ("Do not create a second entitlement decision implementation in the
// frontend"). See docs/PHASE-2-ENTITLEMENT-CUTOVER.md and the Stage 2F-2
// report for why the previous version (reading only legacy
// SubscriptionService state) was a source-of-truth mismatch with what
// actually gates access.
//
// The legacy /subscription/status and /subscription/pricing endpoints are
// still used here, but ONLY for information central entitlement has no
// concept of at all: per-factory SEAT usage/pricing for the Bangladesh free
// tier and the commercial pricing table. Neither is used to decide whether
// access is allowed or which status is shown — that is exclusively the
// central entitlement response's job now. SubscriptionService itself is
// UNCHANGED and still authoritative for seats/pricing; it is simply no
// longer authoritative for protected OptiFabric access, which is what this
// page's status banner reflects.
import { useEffect, useState } from "react";
import { apiFetch } from "../../../lib/optifabric/apiClient";
import {
  describeEntitlement,
  isBangladeshFreeEntitlement,
  type OptiFabricEntitlementStatus,
} from "../../../lib/optifabric/entitlementStatusDisplay";

// Legacy shape — kept ONLY for the seat-usage fields below, which the
// central entitlement model has no equivalent of at all (it is a binary
// per-product access decision, not a seat count). Never read for
// isAccessAllowed/status purposes any more.
interface LegacySeatInfo {
  includedSeats: number | null;
  extraSeats: number | null;
  seatsUsed: number | null;
  canAddMoreUsers: boolean;
}

interface Pricing {
  monthly: { baseSeats: number; basePriceCents: number; extraSeatPriceCents: number };
  annual: { baseSeats: number; basePriceCents: number; extraSeatPriceCents: number };
  trialDays: number;
  gracePeriodDays: number;
  bangladeshFree: boolean;
  bangladeshIncludedSeats: number;
  bangladeshExtraSeatPriceCents: number;
  bangladeshNote: string;
  languageNote: string;
  contact: string;
}

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

const TONE_CLASSES: Record<"positive" | "warning" | "neutral", string> = {
  positive: "border-emerald-500/30 bg-emerald-950/20",
  warning: "border-amber-500/40 bg-amber-950/20",
  neutral: "border-slate-700 bg-slate-900/80",
};

const TONE_HEADLINE_CLASSES: Record<"positive" | "warning" | "neutral", string> = {
  positive: "text-emerald-300",
  warning: "text-amber-300",
  neutral: "text-slate-200",
};

export default function OptiFabricSubscriptionPage() {
  const [entitlement, setEntitlement] = useState<OptiFabricEntitlementStatus | null>(null);
  const [entitlementError, setEntitlementError] = useState<string | null>(null);
  const [seatInfo, setSeatInfo] = useState<LegacySeatInfo | null>(null);
  const [pricing, setPricing] = useState<Pricing | null>(null);
  const [pricingError, setPricingError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<Pricing>("/subscription/pricing")
      .then(setPricing)
      .catch((err) => setPricingError((err as Error).message));

    // Central entitlement — the authoritative access/status source (see the
    // file header). A failure here is a genuine technical/auth problem
    // (this route is never itself entitlement-gated, so it cannot fail with
    // "entitlement denied" — that concept doesn't apply to reading your own
    // status), never a sign the account or its data has been affected.
    apiFetch<OptiFabricEntitlementStatus>("/entitlements/me/optifabric")
      .then(setEntitlement)
      .catch((err) =>
        setEntitlementError(
          `Your current OptiFabric status could not be loaded: ${(err as Error).message}. Your account and data are unaffected — please try again.`
        )
      );

    // Legacy — read only for seat-usage display (see LegacySeatInfo above).
    // A failure here does not block the central status above; seat info
    // simply stays unavailable.
    apiFetch<LegacySeatInfo>("/subscription/status")
      .then(setSeatInfo)
      .catch(() => setSeatInfo(null));
  }, []);

  const isBangladeshFree = entitlement !== null && isBangladeshFreeEntitlement(entitlement);
  const statusDisplay = entitlement ? describeEntitlement(entitlement) : null;
  const showActivatePlan = entitlement !== null && !isBangladeshFree;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-slate-800 bg-gradient-to-r from-emerald-950 via-slate-950 to-slate-950">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Subscription</h1>
          <h2 className="mt-2 text-2xl font-bold text-emerald-300">সাবস্ক্রিপশন</h2>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-10">
        {entitlementError && (
          <p className="mb-4 rounded-xl border border-red-500/40 bg-red-950/30 p-4 text-red-300">
            {entitlementError}
          </p>
        )}

        {!entitlement && !entitlementError && (
          <p className="mb-4 leading-7 text-slate-400">Loading your OptiFabric status...</p>
        )}

        {statusDisplay && (
          <div className={`mb-6 rounded-2xl border p-6 ${TONE_CLASSES[statusDisplay.tone]}`}>
            <p className={`text-lg font-black ${TONE_HEADLINE_CLASSES[statusDisplay.tone]}`}>
              {statusDisplay.headline}
            </p>
            <p className={`text-base font-bold ${TONE_HEADLINE_CLASSES[statusDisplay.tone]}`}>
              {statusDisplay.headlineBangla}
            </p>
            <p className="mt-2 leading-7 text-slate-300">{statusDisplay.detail}</p>
            <p className="mt-2 leading-7 text-slate-400">{statusDisplay.detailBangla}</p>
          </div>
        )}

        {isBangladeshFree && (
          <div className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-6">
            {seatInfo !== null &&
              seatInfo.includedSeats !== null &&
              seatInfo.extraSeats !== null &&
              seatInfo.seatsUsed !== null && (
                <p className="font-bold text-white">
                  Seats used: {seatInfo.seatsUsed} of {seatInfo.includedSeats + seatInfo.extraSeats}{" "}
                  free.
                  <br />
                  <span className="font-normal text-slate-400">
                    ব্যবহৃত সিট: {seatInfo.includedSeats + seatInfo.extraSeats}টির মধ্যে{" "}
                    {seatInfo.seatsUsed}টি।
                  </span>
                </p>
              )}

            {seatInfo && !seatInfo.canAddMoreUsers && (
              <p className="mt-3 rounded-xl border border-amber-500/40 bg-amber-950/20 p-4 text-amber-300">
                All free seats are in use. Ask your OptiFabric Bangladesh representative to add extra seats
                ($5.00/user/month, or the BDT equivalent) before adding another user.
                <br />
                <span className="text-amber-200/80">
                  সব ফ্রি সিট ব্যবহার হয়ে গেছে। নতুন ব্যবহারকারী যোগ করার আগে আপনার OptiFabric বাংলাদেশ
                  প্রতিনিধিকে অতিরিক্ত সিট যোগ করতে বলুন।
                </span>
              </p>
            )}
          </div>
        )}

        {pricingError && (
          <p className="mb-4 rounded-xl border border-red-500/40 bg-red-950/30 p-4 text-red-300">{pricingError}</p>
        )}

        {pricing && (
          <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
            <p className="font-bold text-white">{pricing.bangladeshNote}</p>
            <ul className="mt-4 grid gap-2 leading-7 text-slate-300">
              <li>
                Monthly: {formatCents(pricing.monthly.basePriceCents)} for {pricing.monthly.baseSeats} users, +
                {formatCents(pricing.monthly.extraSeatPriceCents)}/extra user/month
              </li>
              <li>
                Annual: {formatCents(pricing.annual.basePriceCents)} for {pricing.annual.baseSeats} users
              </li>
              <li>
                Free trial (non-Bangladesh factories): {pricing.trialDays} days. Grace period after expiry:{" "}
                {pricing.gracePeriodDays} days.
              </li>
              <li className="text-slate-400">{pricing.languageNote}</li>
              <li>Contact: {pricing.contact}</li>
            </ul>
          </div>
        )}

        {showActivatePlan && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
            <h3 className="text-xl font-black text-white">Activate a Plan</h3>
            <p className="mt-2 leading-7 text-slate-300">
              Online activation isn&apos;t available yet. To activate a monthly or annual plan, contact{" "}
              <a
                href={`mailto:${pricing?.contact ?? "contact@bangladeshapparel.com"}`}
                className="font-bold text-emerald-300 underline underline-offset-2 hover:text-emerald-200"
              >
                {pricing?.contact ?? "contact@bangladeshapparel.com"}
              </a>{" "}
              and an OptiFabric representative will activate your subscription after confirming payment.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
