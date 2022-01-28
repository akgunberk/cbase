/*
  Warnings:

  - You are about to drop the column `typeId` on the `Ticket` table. All the data in the column will be lost.
  - Added the required column `typeName` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ticket" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "summary" TEXT NOT NULL,
    "typeName" TEXT NOT NULL,
    "assignee" TEXT NOT NULL,
    "reporter" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "priorityId" INTEGER NOT NULL,
    "statusId" INTEGER NOT NULL,
    CONSTRAINT "Ticket_typeName_fkey" FOREIGN KEY ("typeName") REFERENCES "Type" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Ticket_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Ticket_priorityId_fkey" FOREIGN KEY ("priorityId") REFERENCES "Priority" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Ticket_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Ticket" ("assignee", "categoryId", "id", "priorityId", "reporter", "statusId", "summary") SELECT "assignee", "categoryId", "id", "priorityId", "reporter", "statusId", "summary" FROM "Ticket";
DROP TABLE "Ticket";
ALTER TABLE "new_Ticket" RENAME TO "Ticket";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
