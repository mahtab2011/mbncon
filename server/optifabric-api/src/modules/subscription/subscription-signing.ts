// Extracted as plain, dependency-free functions so AuthService can create a
// Subscription row directly at signup without creating a circular module
// dependency (SubscriptionModule imports AuthModule for its guards; AuthModule
// must not import SubscriptionModule back).
import { createHmac, timingSafeEqual } from "crypto";

export interface SignableSubscriptionFields {
  factoryId: string;
  planType: "TRIAL" | "MONTHLY" | "ANNUAL" | "BD_FREE_REGIONAL";
  status: "TRIALING" | "ACTIVE" | "GRACE_PERIOD" | "EXPIRED" | "CANCELLED" | "FREE_REGIONAL";
  trialEndsAt: Date;
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
  graceEndsAt: Date | null;
  includedSeats: number;
  extraSeats: number;
  cancelAtPeriodEnd: boolean;
}

export function subscriptionSigningSecret(): string {
  const secret = process.env.LICENSE_SIGNING_SECRET;
  if (!secret || secret.length < 64) {
    throw new Error("LICENSE_SIGNING_SECRET must be at least 64 characters.");
  }
  return secret;
}

export function signSubscriptionFields(fields: SignableSubscriptionFields): string {
  const canonical = JSON.stringify({
    factoryId: fields.factoryId,
    planType: fields.planType,
    status: fields.status,
    trialEndsAt: fields.trialEndsAt.toISOString(),
    currentPeriodStart: fields.currentPeriodStart?.toISOString() ?? null,
    currentPeriodEnd: fields.currentPeriodEnd?.toISOString() ?? null,
    graceEndsAt: fields.graceEndsAt?.toISOString() ?? null,
    includedSeats: fields.includedSeats,
    extraSeats: fields.extraSeats,
    cancelAtPeriodEnd: fields.cancelAtPeriodEnd,
  });
  return createHmac("sha256", subscriptionSigningSecret()).update(canonical).digest("hex");
}

export function verifySubscriptionSignature(
  fields: SignableSubscriptionFields,
  signature: string,
): boolean {
  const expected = signSubscriptionFields(fields);
  const expectedBuf = Buffer.from(expected, "hex");
  const actualBuf = Buffer.from(signature, "hex");
  if (expectedBuf.length !== actualBuf.length) return false;
  return timingSafeEqual(expectedBuf, actualBuf);
}
