/*
  Warnings:

  - A unique constraint covering the columns `[adminId]` on the table `TransfeeraCredentials` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TransfeeraCredentials_adminId_key" ON "TransfeeraCredentials"("adminId");
