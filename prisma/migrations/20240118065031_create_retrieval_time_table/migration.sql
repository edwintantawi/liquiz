-- CreateEnum
CREATE TYPE "RetrievalTimeType" AS ENUM ('TOPIC', 'HISTORY', 'SUBJECT');

-- CreateTable
CREATE TABLE "retrieval_times" (
    "id" TEXT NOT NULL,
    "target_id" TEXT NOT NULL,
    "type" "RetrievalTimeType" NOT NULL,
    "duration" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "retrieval_times_pkey" PRIMARY KEY ("id")
);
