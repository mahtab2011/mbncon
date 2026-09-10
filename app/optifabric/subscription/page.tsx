"use client";

// Subscription/pricing page for OptiFabric — mirrors OptiSewing's subscription
// system exactly: free permanently for factories registered in Bangladesh (3
// seats included, extra seats billed offline by a representative), the same
// paid trial/plan terms for factories outside Bangladesh. Talks to
// server/optifabric-api/src/modules/subscription/subscription.controller.ts.
import { useEffect, useState } from "react";
import { apiFetch } from "../../../lib/optifabric/apiClient";

interface SubscriptionStatus {
  status: "FREE_REGIONAL" | "TRIALING" | "ACTIVE" | "GRACE_PERIOD" | "EXPIRED" | "CANCELLED";
  isAccessAllowed: boolean;
  daysUntilExpiry: number | null;
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

export default function OptiFabricSubscriptionPage() {
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [pricing, setPricing] = useState<Pricing | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<Pricing>("/subscription/pricing").then(setPricing).catch((err) => setError((err as Error).message));
    apiFetch<SubscriptionStatus>("/subscription/status")
      .then(setStatus)
      .catch((err) => setError((err as Error).message));
  }, []);

  const isFreeRegional = status?.status === "FREE_REGIONAL";

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-slate-800 bg-gradient-to-r from-emerald-950 via-slate-950 to-slate-950">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Subscription</h1>
          <h2 className="mt-2 text-2xl font-bold text-emerald-300">সাবস্ক্রিপশন</h2>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-10">
        {error && (
          <p className="mb-4 rounded-xl border border-red-500/40 bg-red-950/30 p-4 text-red-300">{error}</p>
        )}
        {status && (
          <p className="mb-4 leading-7 text-slate-300">
            Current status: <strong className="text-white">{status.status}</strong>
            {status.daysUntilExpiry !== null && ` — ${status.daysUntilExpiry} day(s) remaining`}
            {!status.isAccessAllowed && (
              <span className="ml-2 text-red-300">
                — access is currently blocked. Contact OptiFabric to activate a plan below.
              </span>
            )}
          </p>
        )}

        {isFreeRegional && (
          <div className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-6">
            <p className="text-lg font-black text-emerald-300">Free for Bangladesh.</p>
            <p className="mt-2 leading-7 text-slate-300">
              This factory is registered in Bangladesh, so OptiFabric is free for you, permanently — no
              trial countdown, no payment required.
            </p>
            <p className="mt-2 leading-7 text-slate-400">
              এই কারখানাটি বাংলাদেশে নিবন্ধিত, তাই OptiFabric আপনার জন্য স্থায়ীভাবে বিনামূল্যে — কোনো ট্রায়াল
              সময়সীমা নেই, কোনো অর্থ প্রদানের প্রয়োজন নেই।
            </p>

            {status?.includedSeats !== null && status?.extraSeats !== null && status?.seatsUsed !== null && (
              <p className="mt-4 font-bold text-white">
                Seats used: {status!.seatsUsed} of {(status!.includedSeats as number) + (status!.extraSeats as number)}{" "}
                free.
                <br />
                <span className="font-normal text-slate-400">
                  ব্যবহৃত সিট: {(status!.includedSeats as number) + (status!.extraSeats as number)}টির মধ্যে{" "}
                  {status!.seatsUsed}টি।
                </span>
              </p>
            )}

            {status && !status.canAddMoreUsers && (
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

        {!isFreeRegional && (
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
