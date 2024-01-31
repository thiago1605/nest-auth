-- CreateEnum
CREATE TYPE "Profile" AS ENUM ('admin', 'intern');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'inactive');

-- CreateTable
CREATE TABLE "users" (
    "email" VARCHAR(60) NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "profile" "Profile" NOT NULL,
    "status" "UserStatus" NOT NULL,
    "password" VARCHAR(200) NOT NULL,
    "cell_phone_number" VARCHAR(11) NOT NULL,
    "contract_id" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("email")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_cell_phone_number_key" ON "users"("cell_phone_number");
