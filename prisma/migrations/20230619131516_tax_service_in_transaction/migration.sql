-- AlterEnum
ALTER TYPE "EnumTypeInput" ADD VALUE 'dischargeCard';

-- AlterTable
ALTER TABLE "Transactions" ADD COLUMN     "tax" INTEGER;
