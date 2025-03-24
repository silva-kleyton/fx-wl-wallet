/*
  Warnings:

  - Added the required column `validate` to the `RequestAntecipation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RequestAntecipation" ADD COLUMN     "validate" TIMESTAMP(3) NOT NULL;
