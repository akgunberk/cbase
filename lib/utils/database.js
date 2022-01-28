"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prisma = exports.DB = void 0;

var _client = require("@prisma/client");

var _fs = require("fs");

var _ = require(".");

const prisma = new _client.PrismaClient({
  log: []
});
exports.prisma = prisma;
const DB = {
  getActiveUser() {
    return prisma.user.findFirst({
      where: {
        isActive: true
      },
      include: {
        project: true
      }
    });
  },

  setUser(user) {
    return prisma.user.upsert({
      where: {
        username: user.username
      },
      update: {
        isActive: true
      },
      create: { ...user,
        isActive: true
      }
    });
  },

  setProjectDetails([types, statuses, categories, priorities]) {
    try {
      return Promise.allSettled([...types.map(({
        id,
        name,
        icon
      }) => prisma.type.create({
        data: {
          id: id.text,
          name: name.text,
          icon: icon.text
        }
      })), ...statuses.map(({
        id,
        name,
        colour,
        "treat-as-closed": treatAsClosed
      }) => prisma.status.create({
        data: {
          id: id.text,
          name: name.text,
          colour: colour.text,
          treatAsClosed: treatAsClosed.text === "true"
        }
      })), ...categories.map(({
        id,
        name
      }) => prisma.category.create({
        data: {
          id: id.text,
          name: name.text
        }
      })), ...priorities.map(({
        id,
        name,
        colour
      }) => prisma.priority.create({
        data: {
          id: id.text,
          name: name.text,
          colour: colour.text
        }
      }))]);
    } catch (error) {
      _.spinner.fail("An error occurred while getting project details.");

      process.exit(1);
    }
  },

  async logout() {
    const user = await prisma.user.findFirst({
      where: {
        isActive: true
      }
    });

    if (user) {
      await prisma.user.update({
        where: {
          id: user.id
        },
        data: { ...user,
          isActive: false
        }
      });
      (0, _fs.writeFileSync)(".env", "");

      _.spinner.succeed("Logout successfully.");
    } else {
      _.spinner.fail("There is no authenticated user to log out.");
    }
  },

  async saveAllProjects(projects) {
    for (const name of projects) {
      await prisma.project.upsert({
        where: {
          name
        },
        update: {},
        create: {
          name
        }
      });
    }

    return;
  },

  getSavedQuery(name) {
    return prisma.codebaseQuery.findUnique({
      where: {
        name
      }
    });
  },

  async upsertQuery({
    name,
    query
  }) {
    return prisma.codebaseQuery.upsert({
      where: {
        name
      },
      update: {
        query
      },
      create: {
        userId: 1,
        name,
        query
      }
    });
  },

  async getAllQueries() {
    const user = await this.getActiveUser();
    return prisma.codebaseQuery.findMany({
      where: {
        userId: user.id
      }
    });
  },

  async getTicketStatuses() {
    const statuses = await prisma.status.findMany();
    return statuses.reduce((statuses, status) => {
      statuses[status.id] = status.name;
      return statuses;
    }, {});
  },

  async getTicketPriorities() {
    const priorities = await prisma.priority.findMany();
    return priorities.reduce((priorities, priority) => {
      priorities[priority.id] = priority.name;
      return priorities;
    }, {});
  }

};
exports.DB = DB;