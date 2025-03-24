-- AlterTable
ALTER TABLE "Wallet" ADD COLUMN     "adminId" TEXT,
ADD COLUMN     "isAdmin" BOOLEAN DEFAULT false;
