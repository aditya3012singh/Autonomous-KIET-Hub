/*
  Warnings:

  - You are about to drop the column `branch` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `subjectId` on the `Note` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_subjectId_fkey";

-- AlterTable
ALTER TABLE "Note" DROP COLUMN "branch",
DROP COLUMN "subjectId";

-- CreateTable
CREATE TABLE "_SubjectNotes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SubjectNotes_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_SubjectNotes_B_index" ON "_SubjectNotes"("B");

-- AddForeignKey
ALTER TABLE "_SubjectNotes" ADD CONSTRAINT "_SubjectNotes_A_fkey" FOREIGN KEY ("A") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubjectNotes" ADD CONSTRAINT "_SubjectNotes_B_fkey" FOREIGN KEY ("B") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
