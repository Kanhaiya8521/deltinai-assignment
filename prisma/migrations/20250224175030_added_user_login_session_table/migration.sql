-- CreateTable
CREATE TABLE "UserLoginSession" (
    "id" TEXT NOT NULL,
    "login_session" TEXT NOT NULL,
    "ip_address" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserLoginSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserLoginSession_id_key" ON "UserLoginSession"("id");
