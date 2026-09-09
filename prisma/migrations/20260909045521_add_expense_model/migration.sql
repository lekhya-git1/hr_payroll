/*
  Warnings:

  - You are about to drop the column `date` on the `Expense` table. All the data in the column will be lost.
  - Added the required column `title` to the `Expense` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Expense" DROP COLUMN "date",
ADD COLUMN     "approvedBy" INTEGER,
ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'general',
ADD COLUMN     "title" TEXT NOT NULL;
