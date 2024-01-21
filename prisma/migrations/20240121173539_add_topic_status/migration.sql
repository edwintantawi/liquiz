-- CreateEnum
CREATE TYPE "TopicStatus" AS ENUM ('NONE', 'PENDING', 'COMPLETED');

-- AlterTable
ALTER TABLE "topics" ADD COLUMN     "status" "TopicStatus" NOT NULL DEFAULT 'NONE';
