import { Prisma, PrismaClient } from "@prisma/client";
import { pickXmlContent, spinner } from "./utils";

export const prisma = new PrismaClient({ log: [] });

export async function upsertUser(user: Prisma.UserCreateInput) {
  return prisma.user.upsert({
    where: { id: user.id },
    update: { project: { connect: { projectName_userId: { projectName: process.env.project!, userId: user.id } } } },
    create: {
      ...user,
      project: { connect: { projectName_userId: { projectName: process.env.project!, userId: user.id } } },
    },
  });
}

export async function listProjectUsers() {
  return prisma.project.findUnique({
    where: { name: process.env.project },
    include: { users: true },
  });
}

export async function setProjectDetails([types, statuses, categories, priorities, users]: any) {
  const projectName = process.env.project!;

  try {
    for (const user of users) {
      const { id, username, firstName, lastName } = pickXmlContent(user, [
        "id",
        "username",
        "first-name",
        "last-name",
      ]) as Prisma.UserCreateInput;

      await prisma.user.upsert({
        where: { id },
        update: {},
        create: {
          id,
          username,
          firstName,
          lastName,
          project: {
            connectOrCreate: {
              where: { projectName_userId: { projectName, userId: id } },
              create: { projectName },
            },
          },
        },
      });
    }

    for (const type of types) {
      const data = { ...pickXmlContent(type, ["id", "name", "icon"]), projectName } as Prisma.TypeUpsertArgs["create"];

      await prisma.type.upsert({
        where: { name: data.name },
        update: { projectName },
        create: data,
      });
    }

    for (const status of statuses) {
      const data = {
        ...pickXmlContent(status, ["id", "name", "colour", "treat-as-closed"]),
        projectName,
      } as Prisma.StatusUpsertArgs["create"];

      await prisma.status.upsert({
        where: { name: data.name },
        update: { projectName },
        create: data,
      });
    }

    for (const category of categories) {
      const data = { ...pickXmlContent(category, ["id", "name"]), projectName } as Prisma.CategoryUpsertArgs["create"];

      await prisma.category.upsert({
        where: { name: data.name },
        update: { projectName },
        create: data,
      });
    }

    for (const priority of priorities) {
      const data = {
        ...pickXmlContent(priority, ["id", "name", "colour"]),
        projectName,
      } as Prisma.PriorityUpsertArgs["create"];

      await prisma.priority.upsert({
        where: { name: data.name },
        update: { projectName },
        create: data,
      });
    }
  } catch (error) {
    spinner.fail("Couldn't save project details.");
    process.exit(1);
  }

  return;
}

export async function upsertProjects(projects: string[]) {
  for (const name of projects) {
    await prisma.project.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  return;
}

export async function findSavedQuery(name: string) {
  return prisma.codebaseQuery.findUnique({ where: { name } });
}

export async function upsertUserQuery({ name, query }: { name: string; query: string }) {
  return prisma.codebaseQuery.upsert({
    where: {
      name,
    },
    update: {
      query,
    },
    create: {
      username: process.env.username!,
      name,
      query,
    },
  });
}

export async function listProjectDetails() {
  const project = await prisma.project.findFirst({
    where: { name: process.env.project! },
    include: {
      users: { orderBy: { user: { username: "desc" } } },
      priorities: { orderBy: { name: "desc" } },
      statuses: { orderBy: { name: "desc" } },
      types: { orderBy: { name: "desc" } },
      categories: { orderBy: { name: "desc" } },
      tickets: true,
    },
  });
  return project;
}

export async function listAllQueries() {
  return prisma.codebaseQuery.findMany({ where: { username: process.env.username } });
}

export async function listTicketStatuses() {
  const statuses = await prisma.status.findMany({ select: { id: true, name: true } });
  return statuses;
}

export async function listTicketPriorities() {
  const priorities = await prisma.priority.findMany({ select: { id: true, name: true } });

  return priorities;
}

export async function listUsers() {
  const users = await prisma.user.findMany({ select: { id: true, username: true } });

  return users;
}
