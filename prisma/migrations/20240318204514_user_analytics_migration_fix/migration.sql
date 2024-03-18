-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "providerType" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refreshToken" TEXT,
    "accessToken" TEXT,
    "accessTokenExpires" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comment" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "fk_user_id" INTEGER NOT NULL,
    "event_id" INTEGER,
    "post_id" INTEGER,
    "liked_by_users" INTEGER[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "fk_user_id" INTEGER NOT NULL,
    "header" TEXT NOT NULL,
    "image" TEXT,
    "location" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT,
    "liked_by_users" INTEGER[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3) NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "internships" (
    "id" TEXT NOT NULL,
    "employer_name" TEXT NOT NULL,
    "employer_logo" TEXT,
    "employer_company_type" TEXT,
    "employer_website" TEXT,
    "job_id" TEXT NOT NULL,
    "job_apply_quality_score" DOUBLE PRECISION,
    "job_publisher" TEXT,
    "job_employment_type" TEXT,
    "job_title" TEXT,
    "job_apply_link" TEXT,
    "job_description" TEXT,
    "job_is_remote" BOOLEAN,
    "job_required_skills" JSONB,
    "job_posted_at_timestamp" INTEGER,
    "job_posted_at_datetime_utc" TIMESTAMP(3),
    "job_city" TEXT,
    "job_state" TEXT,
    "job_country" TEXT,
    "job_benefits" JSONB,
    "job_highlights" JSONB,
    "job_job_title" TEXT,
    "job_min_salary" DOUBLE PRECISION,
    "job_max_salary" DOUBLE PRECISION,
    "user_views" INTEGER[],

    CONSTRAINT "internships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "text" TEXT NOT NULL,
    "fk_user_id" INTEGER NOT NULL,
    "liked_by_users" INTEGER[],

    CONSTRAINT "post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "companies_viewed" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "internships_applied" TEXT[],
    "internships_favorited" TEXT[],
    "internships_viewed" TEXT[],
    "last_login" TIMESTAMP(3),
    "major" TEXT,
    "minor" TEXT,
    "password" TEXT NOT NULL,
    "photo_url" TEXT,
    "portfolio_link" TEXT,
    "profile_bio" TEXT,
    "role" TEXT DEFAULT 'user',
    "social_media" TEXT,
    "current_class" TEXT,
    "full_name" TEXT NOT NULL,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "verification_token" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userAnalytics" (
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

    CONSTRAINT "userAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "session_sessionToken_key" ON "session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "session_accessToken_key" ON "session"("accessToken");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_fk_user_id_fkey" FOREIGN KEY ("fk_user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_fk_user_id_fkey" FOREIGN KEY ("fk_user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_fk_user_id_fkey" FOREIGN KEY ("fk_user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
