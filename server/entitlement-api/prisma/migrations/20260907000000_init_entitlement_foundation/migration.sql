-- Phase 1 central entitlement foundation — initial schema.
--
-- GENERATED ONLY, NOT APPLIED. Produced via:
--   npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script
-- against no live database connection (--from-empty needs none). This has
-- NOT been run against any database, local or otherwise — no `prisma
-- migrate dev` / `migrate deploy` was executed. Purely additive: creates 4
-- new enums and 3 new tables, none of which exist in, alter, or reference
-- server/optifabric-api's schema or OptiSewing's apps/api schema.

-- CreateEnum
CREATE TYPE "ExternalSystem" AS ENUM ('BANGLADESH_APPAREL', 'OPTIFABRIC', 'OPTISEWING');

-- CreateEnum
CREATE TYPE "Product" AS ENUM ('OPTIFABRIC', 'OPTISEWING');

-- CreateEnum
CREATE TYPE "EntitlementSource" AS ENUM ('BANGLADESH_FREE', 'INTERNATIONAL_TRIAL', 'PAID');

-- CreateEnum
CREATE TYPE "PlanCode" AS ENUM ('OPTIFABRIC_MONTHLY', 'OPTISEWING_MONTHLY', 'BUNDLE_MONTHLY');

-- CreateTable
CREATE TABLE "Organisation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "countryCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organisation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganisationExternalRef" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "system" "ExternalSystem" NOT NULL,
    "externalFactoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrganisationExternalRef_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductEntitlement" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "product" "Product" NOT NULL,
    "source" "EntitlementSource" NOT NULL,
    "planCode" "PlanCode",
    "trialStartedAt" TIMESTAMP(3),
    "trialEndsAt" TIMESTAMP(3),
    "currentPeriodStart" TIMESTAMP(3),
    "currentPeriodEnd" TIMESTAMP(3),
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductEntitlement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OrganisationExternalRef_organisationId_idx" ON "OrganisationExternalRef"("organisationId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganisationExternalRef_system_externalFactoryId_key" ON "OrganisationExternalRef"("system", "externalFactoryId");

-- CreateIndex
CREATE INDEX "ProductEntitlement_organisationId_idx" ON "ProductEntitlement"("organisationId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductEntitlement_organisationId_product_key" ON "ProductEntitlement"("organisationId", "product");

-- AddForeignKey
ALTER TABLE "OrganisationExternalRef" ADD CONSTRAINT "OrganisationExternalRef_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductEntitlement" ADD CONSTRAINT "ProductEntitlement_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
