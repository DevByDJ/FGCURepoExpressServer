/*
  Warnings:

  - You are about to drop the column `total_gradutes` on the `user_analytics` table. All the data in the column will be lost.
  - Added the required column `total_graduates` to the `user_analytics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_analytics" DROP COLUMN "total_gradutes",
ADD COLUMN     "total_graduates" INTEGER NOT NULL;
