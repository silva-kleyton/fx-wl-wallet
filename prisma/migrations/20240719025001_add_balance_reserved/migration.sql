-- AlterEnum
ALTER TYPE "EnumTypeInput" ADD VALUE 'financialReserve';

-- AlterTable
ALTER TABLE "BalanceHistory" ADD COLUMN     "balanceReserved" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Wallet" ADD COLUMN     "balanceReserved" INTEGER NOT NULL DEFAULT 0;
