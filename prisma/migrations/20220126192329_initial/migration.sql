/*
  Warnings:

  - The primary key for the `Type` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Ticket` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `typeName` on the `Ticket` table. All the data in the column will be lost.
  - The primary key for the `Category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Status` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Priority` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `ticketType` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Type" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL
);
INSERT INTO "new_Type" ("icon", "id", "name") SELECT "icon", "id", "name" FROM "Type";
DROP TABLE "Type";
ALTER TABLE "new_Type" RENAME TO "Type";
CREATE UNIQUE INDEX "Type_name_key" ON "Type"("name");
CREATE TABLE "new_Ticket" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
INSERT INTO "new_Ticket" ("assignee", "categoryId", "id", "priorityId", "reporter", "statusId", "summary") SELECT "assignee", "categoryId", "id", "priorityId", "reporter", "statusId", "summary" FROM "Ticket";
DROP TABLE "Ticket";
ALTER TABLE "new_Ticket" RENAME TO "Ticket";
CREATE TABLE "new_Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);
INSERT INTO "new_Category" ("id", "name") SELECT "id", "name" FROM "Category";
DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
CREATE TABLE "new_Status" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "colour" TEXT NOT NULL,
    "treatAsClosed" BOOLEAN NOT NULL
);
INSERT INTO "new_Status" ("colour", "id", "name", "treatAsClosed") SELECT "colour", "id", "name", "treatAsClosed" FROM "Status";
DROP TABLE "Status";
ALTER TABLE "new_Status" RENAME TO "Status";
CREATE UNIQUE INDEX "Status_name_key" ON "Status"("name");
CREATE TABLE "new_Priority" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "colour" TEXT NOT NULL
);
INSERT INTO "new_Priority" ("colour", "id", "name") SELECT "colour", "id", "name" FROM "Priority";
DROP TABLE "Priority";
ALTER TABLE "new_Priority" RENAME TO "Priority";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
