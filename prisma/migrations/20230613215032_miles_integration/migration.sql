-- CreateEnum
CREATE TYPE "EnumStatusMiles" AS ENUM ('active', 'inactive', 'blocked', 'deleted');

-- CreateTable
CREATE TABLE "UserMiles" (
    "id" TEXT NOT NULL,
    "user" VARCHAR(36) NOT NULL,
    "pointsToRedeem" INTEGER NOT NULL DEFAULT 0,
    "pointsAccumulated" INTEGER NOT NULL DEFAULT 0,
    "status" "EnumStatusMiles" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "UserMiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MilesConfig" (
    "id" TEXT NOT NULL,
    "quotation" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "percentage" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "MilesConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserMiles_user_key" ON "UserMiles"("user");
