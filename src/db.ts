import { Database } from "sqlite3";
import { join } from "path";
import { promisify } from "util";
import { readFileSync } from "fs";

import type { UserType, CategoryType, StatusType, PriorityType, TicketType } from "./api";

const db = new Database(join(__dirname, "database.db"));

const sqlite = {
  run(sql: string, ...params: any[]) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve(this);
      });
    });
  },
  get: promisify(db.get.bind(db)),
  all: promisify(db.all.bind(db)),
  exec: promisify(db.exec.bind(db)),
};

export function initDB() {
  const initialMigrations = readFileSync(join(__dirname, "migration.sql"), "utf8");
  return sqlite.exec(initialMigrations);
}

export async function insertProjects(projects: string[]) {
  for (const project of projects) {
    await sqlite.run(`INSERT INTO Project (name) VALUES (?)`, project);
  }

  return;
}

export type ProjectDetailsType = {
  users: UserType[];
  statuses: StatusType[];
  categories: CategoryType[];
  priorities: PriorityType[];
  types: TicketType[];
};
export async function listProjectDetails() {
  const [types, statuses, categories, priorities, users] = await Promise.all([
    sqlite.all(`SELECT * FROM Type WHERE projectName = '${process.env.project}'`),
    sqlite.all(`SELECT * FROM Status WHERE projectName = '${process.env.project}'`),
    sqlite.all(`SELECT * FROM Category WHERE projectName = '${process.env.project}'`),
    sqlite.all(`SELECT * FROM Priority WHERE projectName = '${process.env.project}'`),
    sqlite.all(`
  SELECT * FROM User
  LEFT JOIN UsersOnProjects ON User.id = UsersOnProjects.userId
  Where projectName = '${process.env.project}'`),
  ]);

  return { users, statuses, categories, priorities, types } as ProjectDetailsType;
}

export async function saveProjectDetails(projectDetails: any[], project: string) {
  const [types, statuses, categories, priorities, users] = projectDetails.map((detail) =>
    detail.map((row: Record<string, any>) => Object.values(row))
  );

  let stmt = db.prepare(`INSERT INTO Type (id,name,icon,projectName) VALUES (?,?,?,?)`);

  for (const type of types) {
    stmt.run(type);
  }

  stmt = db.prepare(`INSERT INTO Status (id,name,colour,treatAsClosed,projectName) VALUES (?,?,?,?,?)`);

  for (const status of statuses) {
    stmt.run(status);
  }

  stmt = db.prepare(`INSERT INTO Category (id,name,projectName) VALUES (?,?,?)`);

  for (const category of categories) {
    stmt.run(category);
  }

  stmt = db.prepare(`INSERT INTO Priority (id,name,colour,projectName) VALUES (?,?,?,?)`);

  for (const priority of priorities) {
    stmt.run(priority);
  }

  stmt = db.prepare(`INSERT INTO User (id,username,firstname,lastname) VALUES (?,?,?,?)`);
  const lookup_stmt = db.prepare(`INSERT INTO UsersOnProjects (projectName,userId) VALUES (?,?)`);

  for (const user of users) {
    const [userId] = user;
    stmt.run(user);
    lookup_stmt.run([project, userId]);
  }

  stmt.finalize();
}
