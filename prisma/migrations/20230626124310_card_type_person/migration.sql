-- CreateEnum
CREATE TYPE "EnumTypePerson" AS ENUM ('PF', 'PJ');

-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "typePerson" "EnumTypePerson" NOT NULL DEFAULT 'PF';
