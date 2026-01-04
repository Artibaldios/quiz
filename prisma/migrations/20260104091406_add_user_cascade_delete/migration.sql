-- DropForeignKey
ALTER TABLE "UserQuizResult" DROP CONSTRAINT "UserQuizResult_userId_fkey";

-- AddForeignKey
ALTER TABLE "UserQuizResult" ADD CONSTRAINT "UserQuizResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
