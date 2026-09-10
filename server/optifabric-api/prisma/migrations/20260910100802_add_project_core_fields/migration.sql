/*
  Warnings:

  - Added the required column `customer` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fabricWidth` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `garmentCategory` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderQuantity` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scaleLength` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `styleNumber` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "customer" TEXT NOT NULL,
ADD COLUMN     "fabricWidth" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "garmentCategory" TEXT NOT NULL,
ADD COLUMN     "mainCategory" TEXT,
ADD COLUMN     "orderQuantity" INTEGER NOT NULL,
ADD COLUMN     "scaleLength" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "styleNumber" TEXT NOT NULL,
ADD COLUMN     "subcategory" TEXT;
