/*
  Warnings:

  - The primary key for the `Ticket` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Ticket` table. All the data in the column will be lost.
  - Added the required column `ticketId` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ticket" (
    "ticketId" TEXT NOT NULL PRIMARY KEY,
    "summary" TEXT NOT NULL,
    "ticketType" TEXT NOT NULL,
    "assignee" TEXT NOT NULL,
    "reporter" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "priorityId" TEXT NOT NULL,
    "statusId" TEXT NOT NULL,
    CONSTRAINT "Ticket_ticketType_fkey" FOREIGN KEY ("ticketType") REFERENCES "Type" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Ticket_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Ticket_priorityId_fkey" FOREIGN KEY ("priorityId") REFERENCES "Priority" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Ticket_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Ticket" ("assignee", "categoryId", "priorityId", "reporter", "statusId", "summary", "ticketType") SELECT "assignee", "categoryId", "priorityId", "reporter", "statusId", "summary", "ticketType" FROM "Ticket";
DROP TABLE "Ticket";
ALTER TABLE "new_Ticket" RENAME TO "Ticket";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
