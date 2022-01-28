import { PrismaClient } from "@prisma/client";
import { writeFileSync } from "fs";
import { spinner } from ".";

type xmlString = { text: string } & Record<string, any>;

export const prisma = new PrismaClient({ log: [] });

export const DB = {
  getActiveUser() {
    return prisma.user.findFirst({
      where: { isActive: true },
      include: { project: true },
    });
  },

  setUser(user: { username: string; selectedProject: string }) {
    return prisma.user.upsert({
      where: {
        username: user.username,
      },
      update: { isActive: true },
      create: { ...user, isActive: true },
    });
  },

  setProjectDetails([types, statuses, categories, priorities]: any) {
    try {
      return Promise.allSettled([
        ...types.map(({ id, name, icon }: Record<string, xmlString>) =>
          prisma.type.create({
            data: {
              id: id.text,
              name: name.text,
              icon: icon.text,
            },
          })
        ),

        ...statuses.map(
          ({
            id,
            name,
            colour,
            "treat-as-closed": treatAsClosed,
          }: Record<string, xmlString>) =>
            prisma.status.create({
              data: {
                id: id.text,
                name: name.text,
                colour: colour.text,
                treatAsClosed: treatAsClosed.text === "true",
              },
            })
        ),

        ...categories.map(({ id, name }: Record<string, xmlString>) =>
          prisma.category.create({
            data: {
              id: id.text,
              name: name.text,
            },
          })
        ),

        ...priorities.map(({ id, name, colour }: Record<string, xmlString>) =>
          prisma.priority.create({
            data: {
              id: id.text,
              name: name.text,
              colour: colour.text,
            },
          })
        ),
      ]);
    } catch (error: any) {
      spinner.fail("An error occurred while getting project details.");
      process.exit(1);
    }
  },

  async logout() {
    const user = await prisma.user.findFirst({ where: { isActive: true } });

    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { ...user, isActive: false },
      });

      writeFileSync(".env", "");

      spinner.succeed("Logout successfully.");
    } else {
      spinner.fail("There is no authenticated user to log out.");
    }
  },

  async saveAllProjects(projects: string[]) {
    for (const name of projects) {
      await prisma.project.upsert({
        where: { name },
        update: {},
        create: { name },
      });
    }
    return;
  },

  getSavedQuery(name: string) {
    return prisma.codebaseQuery.findUnique({ where: { name } });
  },

  async upsertQuery({ name, query }: { name: string; query: string }) {
    return prisma.codebaseQuery.upsert({
      where: {
        name,
      },
      update: {
        query,
      },
      create: {
        userId: 1,
        name,
        query,
      },
    });
  },

  async getAllQueries() {
    const user = await this.getActiveUser();

    return prisma.codebaseQuery.findMany({ where: { userId: user!.id } });
  },

  async getTicketStatuses() {
    const statuses = await prisma.status.findMany();

    return statuses.reduce((statuses, status) => {
      statuses[status.id] = status.name;
      return statuses;
    }, {} as Record<string, string>);
  },

  async getTicketPriorities() {
    const priorities = await prisma.priority.findMany();

    return priorities.reduce((priorities, priority) => {
      priorities[priority.id] = priority.name;
      return priorities;
    }, {} as Record<string, string>);
  },
};
