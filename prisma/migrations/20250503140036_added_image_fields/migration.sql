/*
  Warnings:

  - Added the required column `MediaType` to the `Upload` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Upload` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "Upload" ADD COLUMN     "MediaType" "MediaType" NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "category" ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "profilePicture" TEXT;
