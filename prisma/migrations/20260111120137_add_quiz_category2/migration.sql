/*
  Warnings:

  - The `category` column on the `Quiz` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Quiz" DROP COLUMN "category",
ADD COLUMN     "category" JSONB;
