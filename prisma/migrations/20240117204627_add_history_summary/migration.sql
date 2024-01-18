-- CreateEnum
CREATE TYPE "HistoryStatus" AS ENUM ('NONE', 'PENDING', 'COMPLETED');

-- AlterTable
ALTER TABLE "histories" ADD COLUMN     "feedbacks" TEXT[],
ADD COLUMN     "status" "HistoryStatus" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "suggestions" TEXT[];
