/*
  Warnings:

  - You are about to drop the `_SubjectNotes` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `branch` to the `Note` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subjectId` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_SubjectNotes" DROP CONSTRAINT "_SubjectNotes_A_fkey";

-- DropForeignKey
ALTER TABLE "_SubjectNotes" DROP CONSTRAINT "_SubjectNotes_B_fkey";

-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "branch" TEXT NOT NULL,
ADD COLUMN     "subjectId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_SubjectNotes";

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
