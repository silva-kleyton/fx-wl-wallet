-- CreateEnum
CREATE TYPE "EnumRequestStatusAntecipation" AS ENUM ('aproved', 'waiting', 'denied');

-- CreateEnum
CREATE TYPE "EnumTypeTransaction" AS ENUM ('deposit', 'debit', 'movement');

-- CreateEnum
CREATE TYPE "EnumTypeInput" AS ENUM ('comission', 'affiliationCommission', 'sale', 'salesCommission', 'comissionCheckout', 'salesCommission360', 'releaseMoney', 'antecipation', 'withdrawal');

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL,
    "user" VARCHAR(36) NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "negativeBalanceLimit" INTEGER NOT NULL DEFAULT 0,
    "balanceBlocked" INTEGER NOT NULL DEFAULT 0,
    "balanceToRelease" INTEGER NOT NULL DEFAULT 0,
    "balanceDisponilibity" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transactions" (
    "id" TEXT NOT NULL,
    "saleId" VARCHAR(36),
    "code" VARCHAR(11),
    "referenceComissionSale" VARCHAR(36),
    "type" "EnumTypeTransaction" NOT NULL,
    "typeInput" "EnumTypeInput",
    "requestAntecipationId" TEXT,
    "priceSale" INTEGER,
    "value" INTEGER NOT NULL,
    "valueBlocked" INTEGER NOT NULL DEFAULT 0,
    "valueToRelease" INTEGER NOT NULL DEFAULT 0,
    "valueDisponilibity" INTEGER NOT NULL DEFAULT 0,
    "comission" DOUBLE PRECISION DEFAULT 0.0,
    "date" DATE NOT NULL,
    "dateUnlock" DATE,
    "walletId" TEXT NOT NULL,
    "description" TEXT,
    "anteciped" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BalanceHistory" (
    "id" TEXT NOT NULL,
    "balanceBlocked" INTEGER NOT NULL,
    "balanceToRelease" INTEGER NOT NULL,
    "balanceDisponilibity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "transactionId" TEXT NOT NULL,

    CONSTRAINT "BalanceHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestAntecipation" (
    "id" TEXT NOT NULL,
    "emailUser" TEXT NOT NULL,
    "status" "EnumRequestStatusAntecipation" NOT NULL DEFAULT 'waiting',
    "description" TEXT,
    "evaluatorEmail" TEXT,
    "valorRequest" INTEGER NOT NULL,
    "valorDescount" INTEGER NOT NULL,
    "typeDescount" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "RequestAntecipation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_user_key" ON "Wallet"("user");

-- CreateIndex
CREATE UNIQUE INDEX "Transactions_code_key" ON "Transactions"("code");

-- CreateIndex
CREATE INDEX "Transactions_code_idx" ON "Transactions"("code");

-- CreateIndex
CREATE UNIQUE INDEX "BalanceHistory_transactionId_key" ON "BalanceHistory"("transactionId");

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_requestAntecipationId_fkey" FOREIGN KEY ("requestAntecipationId") REFERENCES "RequestAntecipation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BalanceHistory" ADD CONSTRAINT "BalanceHistory_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
