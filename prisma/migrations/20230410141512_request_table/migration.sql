/*
  Warnings:

  - The values [comission,sale,comissionCheckout] on the enum `EnumTypeInput` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `requestAntecipationId` on the `Transactions` table. All the data in the column will be lost.
  - You are about to drop the `RequestAntecipation` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "EnumTypeRequest" AS ENUM ('antecipation', 'withdraw');

-- AlterEnum
BEGIN;
CREATE TYPE "EnumTypeInput_new" AS ENUM ('affiliationCommission', 'salesCommission', 'salesCommission360', 'releaseMoney', 'antecipation', 'withdrawal', 'chargeback', 'saleRefund');
ALTER TABLE "Transactions" ALTER COLUMN "typeInput" TYPE "EnumTypeInput_new" USING ("typeInput"::text::"EnumTypeInput_new");
ALTER TYPE "EnumTypeInput" RENAME TO "EnumTypeInput_old";
ALTER TYPE "EnumTypeInput_new" RENAME TO "EnumTypeInput";
DROP TYPE "EnumTypeInput_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Transactions" DROP CONSTRAINT "Transactions_requestAntecipationId_fkey";

-- AlterTable
ALTER TABLE "Transactions" DROP COLUMN "requestAntecipationId",
ADD COLUMN     "requestId" TEXT;

-- DropTable
DROP TABLE "RequestAntecipation";

-- CreateTable
CREATE TABLE "Request" (
    "id" TEXT NOT NULL,
    "emailUser" TEXT NOT NULL,
    "status" "EnumRequestStatusAntecipation" NOT NULL DEFAULT 'waiting',
    "description" TEXT,
    "evaluatorEmail" TEXT,
    "typeRequest" "EnumTypeRequest" NOT NULL,
    "closed" BOOLEAN NOT NULL DEFAULT false,
    "valorRequest" INTEGER NOT NULL,
    "valorDescount" INTEGER NOT NULL,
    "validate" TIMESTAMP(3) NOT NULL,
    "typeDescount" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;
