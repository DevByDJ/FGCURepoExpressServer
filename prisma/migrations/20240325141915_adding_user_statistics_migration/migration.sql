/*
  Warnings:

  - You are about to drop the column `total_liked` on the `user_analytics` table. All the data in the column will be lost.
  - Added the required column `total_alumni` to the `user_analytics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_comments` to the `user_analytics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_faculty` to the `user_analytics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_freshmen` to the `user_analytics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_gradutes` to the `user_analytics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_juniors` to the `user_analytics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_likes` to the `user_analytics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_seniors` to the `user_analytics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_sophomores` to the `user_analytics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_analytics" DROP COLUMN "total_liked",
ADD COLUMN     "total_alumni" INTEGER NOT NULL,
ADD COLUMN     "total_comments" INTEGER NOT NULL,
ADD COLUMN     "total_faculty" INTEGER NOT NULL,
ADD COLUMN     "total_freshmen" INTEGER NOT NULL,
ADD COLUMN     "total_gradutes" INTEGER NOT NULL,
ADD COLUMN     "total_juniors" INTEGER NOT NULL,
ADD COLUMN     "total_likes" INTEGER NOT NULL,
ADD COLUMN     "total_seniors" INTEGER NOT NULL,
ADD COLUMN     "total_sophomores" INTEGER NOT NULL;
