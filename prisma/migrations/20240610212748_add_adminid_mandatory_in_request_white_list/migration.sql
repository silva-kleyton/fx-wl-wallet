/*
  Warnings:

  - Made the column `adminId` on table `RequestWhiteList` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "RequestWhiteList" ALTER COLUMN "adminId" SET NOT NULL;
