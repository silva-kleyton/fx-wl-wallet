-- CreateEnum
CREATE TYPE "ProviderCard" AS ENUM ('niky');

-- CreateEnum
CREATE TYPE "TypeCard" AS ENUM ('standard', 'facebook');

-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL,
    "typeCard" "TypeCard" NOT NULL DEFAULT 'standard',
    "provider" "ProviderCard" NOT NULL DEFAULT 'niky',
    "providerId" TEXT NOT NULL,
    "facebookDailyReleaseValue" INTEGER NOT NULL DEFAULT 0,
    "walletId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
