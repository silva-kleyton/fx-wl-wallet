-- AlterEnum
ALTER TYPE "EnumRequestStatusAntecipation" ADD VALUE 'simulationFailed';

-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "errorDescription" TEXT;
