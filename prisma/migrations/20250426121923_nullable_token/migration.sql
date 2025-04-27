/*
  Warnings:

  - A unique constraint covering the columns `[userId,id]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "RefreshToken_userId_key";

-- AlterTable
ALTER TABLE "RefreshToken" ALTER COLUMN "token" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_userId_id_key" ON "RefreshToken"("userId", "id");
