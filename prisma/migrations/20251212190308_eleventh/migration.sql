-- AlterTable
ALTER TABLE "User" ADD COLUMN     "totalQuestions" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalRightAnswers" INTEGER NOT NULL DEFAULT 0;
