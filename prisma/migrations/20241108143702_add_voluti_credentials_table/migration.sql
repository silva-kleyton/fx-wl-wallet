-- CreateTable
CREATE TABLE "VolutiCredentials" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "clientSecret" TEXT NOT NULL,
    "certificateCrt" TEXT NOT NULL,
    "certificateKey" TEXT NOT NULL,
    "certificatePfx" TEXT NOT NULL,
    "pfxPassword" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "VolutiCredentials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VolutiCredentials_adminId_key" ON "VolutiCredentials"("adminId");
