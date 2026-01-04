-- DropForeignKey
ALTER TABLE "UserAnswer" DROP CONSTRAINT "UserAnswer_userQuizResultId_fkey";

-- AddForeignKey
ALTER TABLE "UserAnswer" ADD CONSTRAINT "UserAnswer_userQuizResultId_fkey" FOREIGN KEY ("userQuizResultId") REFERENCES "UserQuizResult"("id") ON DELETE CASCADE ON UPDATE CASCADE;
