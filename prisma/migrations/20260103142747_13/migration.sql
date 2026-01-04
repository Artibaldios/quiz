/*
  Warnings:

  - You are about to drop the column `attempt` on the `UserQuizResult` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "accuracy" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "UserQuizResult" DROP COLUMN "attempt";
