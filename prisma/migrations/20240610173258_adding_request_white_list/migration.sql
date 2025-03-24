-- CreateTable
CREATE TABLE "RequestWhiteList" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "typeRequest" "EnumTypeRequest" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "RequestWhiteList_pkey" PRIMARY KEY ("id")
);
