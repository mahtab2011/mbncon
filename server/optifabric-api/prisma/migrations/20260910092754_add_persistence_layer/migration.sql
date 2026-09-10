-- Backs ProjectsService's server-side, concurrency-safe Project.code
-- generation (code = "OF-{year}-{nextval padded to 6 digits}"). A Postgres
-- sequence's nextval() is atomic and never returns the same value twice to
-- concurrent callers, regardless of transaction outcome — the simplest way
-- to guarantee unique codes under concurrent POST /projects requests without
-- a retry loop. Not represented in schema.prisma (Prisma has no native
-- sequence primitive); accessed only via $queryRaw.
CREATE SEQUENCE "ProjectCodeSeq" START 1;

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "factoryId" TEXT NOT NULL,
    "createdByUserId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatternPiece" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "patternId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL DEFAULT 0,
    "cutQuantity" INTEGER NOT NULL DEFAULT 1,
    "cutOnFold" BOOLEAN NOT NULL DEFAULT false,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "custom" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PatternPiece_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatternGeometry" (
    "id" TEXT NOT NULL,
    "patternPieceId" TEXT NOT NULL,
    "polygonJson" JSONB NOT NULL,
    "calibrationJson" JSONB,
    "grainLineJson" JSONB,
    "measurementJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PatternGeometry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FabricProfile" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "fabricType" TEXT NOT NULL,
    "construction" TEXT NOT NULL,
    "grainControl" TEXT NOT NULL,
    "faceDirection" TEXT NOT NULL,
    "nap" TEXT NOT NULL,
    "allowableRotation" TEXT NOT NULL,
    "stretch" TEXT NOT NULL,
    "knitOrientation" TEXT,
    "lengthWarpShrinkagePercent" DOUBLE PRECISION,
    "widthWeftShrinkagePercent" DOUBLE PRECISION,
    "matchingRequirement" TEXT NOT NULL,
    "horizontalRepeat" DOUBLE PRECISION,
    "verticalRepeat" DOUBLE PRECISION,
    "repeatUnit" TEXT,
    "directionalFabric" TEXT NOT NULL,
    "nominalFabricWidthCm" DOUBLE PRECISION,
    "usableFabricWidthCm" DOUBLE PRECISION NOT NULL,
    "fabricWidthUnit" TEXT NOT NULL,
    "maximumMarkerLengthOption" TEXT NOT NULL,
    "maximumMarkerLengthCm" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FabricProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarkerRun" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdByUserId" TEXT NOT NULL,
    "snapshotJson" JSONB NOT NULL,
    "resultJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarkerRun_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_code_key" ON "Project"("code");

-- CreateIndex
CREATE INDEX "Project_factoryId_idx" ON "Project"("factoryId");

-- CreateIndex
CREATE INDEX "PatternPiece_projectId_idx" ON "PatternPiece"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "PatternPiece_projectId_patternId_key" ON "PatternPiece"("projectId", "patternId");

-- CreateIndex
CREATE UNIQUE INDEX "PatternGeometry_patternPieceId_key" ON "PatternGeometry"("patternPieceId");

-- CreateIndex
CREATE UNIQUE INDEX "FabricProfile_projectId_key" ON "FabricProfile"("projectId");

-- CreateIndex
CREATE INDEX "MarkerRun_projectId_idx" ON "MarkerRun"("projectId");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES "Factory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatternPiece" ADD CONSTRAINT "PatternPiece_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatternGeometry" ADD CONSTRAINT "PatternGeometry_patternPieceId_fkey" FOREIGN KEY ("patternPieceId") REFERENCES "PatternPiece"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FabricProfile" ADD CONSTRAINT "FabricProfile_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarkerRun" ADD CONSTRAINT "MarkerRun_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarkerRun" ADD CONSTRAINT "MarkerRun_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
