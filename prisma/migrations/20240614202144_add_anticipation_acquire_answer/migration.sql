-- CreateEnum
CREATE TYPE "EnumSaleProvider" AS ENUM ('galaxyPay', 'simPay', 'credPay');

-- AlterTable
ALTER TABLE "Transactions" ADD COLUMN     "provider" "EnumSaleProvider",
ADD COLUMN     "providerId" TEXT,
ADD COLUMN     "providerdata" JSONB;

-- CreateTable
CREATE TABLE "AnticipationAcquirerAnswer" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "wasRequested" BOOLEAN NOT NULL DEFAULT false,
    "dataResponse" JSONB,
    "provider" "EnumSaleProvider",
    "value" DOUBLE PRECISION,

    CONSTRAINT "AnticipationAcquirerAnswer_pkey" PRIMARY KEY ("id")
);
