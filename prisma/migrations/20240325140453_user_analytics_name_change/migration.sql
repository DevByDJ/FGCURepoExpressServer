/*
  Warnings:

  - You are about to drop the `userAnalytics` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "userAnalytics";

-- CreateTable
CREATE TABLE "user_analytics" (
    "id" SERIAL NOT NULL,
    "total_users" INTEGER NOT NULL,
    "total_liked" INTEGER NOT NULL,
    "total_applied" INTEGER NOT NULL,
    "total_posts" INTEGER NOT NULL,
    "total_events" INTEGER NOT NULL,
    "internships_viewed" INTEGER NOT NULL,
    "companies_viewed" INTEGER NOT NULL,
    "active_users" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_analytics_pkey" PRIMARY KEY ("id")
);
