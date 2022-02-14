-- CreateTable
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,

    PRIMARY KEY ("id", "username")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Project" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "UsersOnProjects" (
    "projectName" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("projectName", "userId"),
    CONSTRAINT "UsersOnProjects_userId_username_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UsersOnProjects_projectName_fkey" FOREIGN KEY ("projectName") REFERENCES "Project" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Status" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "colour" TEXT NOT NULL,
    "treatAsClosed" BOOLEAN NOT NULL,
    "projectName" TEXT NOT NULL,
    CONSTRAINT "Status_projectName_fkey" FOREIGN KEY ("projectName") REFERENCES "Project" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    CONSTRAINT "Category_projectName_fkey" FOREIGN KEY ("projectName") REFERENCES "Project" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Type" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    CONSTRAINT "Type_projectName_fkey" FOREIGN KEY ("projectName") REFERENCES "Project" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Priority" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "colour" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    CONSTRAINT "Priority_projectName_fkey" FOREIGN KEY ("projectName") REFERENCES "Project" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Project_name_key" ON "Project"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Status_name_key" ON "Status"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Type_name_key" ON "Type"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Priority_name_key" ON "Priority"("name");
