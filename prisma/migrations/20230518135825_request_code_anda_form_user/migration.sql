-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "providerCodeRequest" TEXT;

-- AlterTable
ALTER TABLE "UserInfo" ADD COLUMN     "form" JSONB;
