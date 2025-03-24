-- AlterEnum
ALTER TYPE "EnumTypeInput" ADD VALUE 'recharge';

-- AlterTable
ALTER TABLE "Transactions" ADD COLUMN     "rechargeId" VARCHAR(36);
