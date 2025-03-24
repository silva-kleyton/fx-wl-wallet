-- CreateTable
CREATE TABLE "ConfigService" (
    "id" TEXT NOT NULL,
    "nikySession" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ConfigService_pkey" PRIMARY KEY ("id")
);
