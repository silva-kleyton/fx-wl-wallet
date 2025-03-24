-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "EnumRequestStatusAntecipation" ADD VALUE 'processing';
ALTER TYPE "EnumRequestStatusAntecipation" ADD VALUE 'failed';

-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "acquirerTax" INTEGER,
ADD COLUMN     "automaticPayment" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "companyId" TEXT;

-- AlterTable
ALTER TABLE "Transactions" ADD COLUMN     "antecipedAmount" INTEGER;
