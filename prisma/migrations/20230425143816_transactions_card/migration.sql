-- AlterEnum
ALTER TYPE "EnumTypeInput" ADD VALUE 'cardAds';

-- AlterTable
ALTER TABLE "Transactions" ADD COLUMN     "cardId" TEXT;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;
