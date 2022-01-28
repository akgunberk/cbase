"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DB = void 0;

var _ora = _interopRequireDefault(require("ora"));

var _client = require("@prisma/client");

var _fs = require("fs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const prisma = new _client.PrismaClient();
const spinner = (0, _ora.default)();
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
    return prisma.user.create({
      data: { ...user,
        isActive: true
      }
    });
  },

  async setProjectDetails([types, categories, statuses, priorities]) {
    try {
      return Promise.allSettled([...types.map(({
        id,
        name,
        icon
      }) => prisma.type.create({
        data: {
          id: Number(id.text),
          name: name.text,
          icon: icon.text
        }
      })), ...categories.map(({
        id,
        name
      }) => prisma.category.create({
        data: {
          id: Number(id.text),
          name: name.text
        }
      })), ...statuses.map(({
        id,
        name,
        backgroundColour,
        order,
        treatAsClosed
      }) => prisma.status.create({
        data: {
          id: Number(id.text),
          name: name.text,
          backgroundColour: backgroundColour.text,
          order: Number(order.text),
          treatAsClosed: treatAsClosed.text === "true"
        }
      })), ...priorities.map(({
        id,
        name,
        colour
      }) => prisma.priority.create({
        data: {
          id: Number(id.text),
          name: name.text,
          colour: Number(colour.text)
        }
      }))]);
    } catch (error) {
      spinner.fail("An error occurred while getting project details.");
    }
  },

  async logout() {
    const user = await prisma.user.findFirst({
      where: {
        isActive: true
      }
    });

    if (user) {
      prisma.user.update({
        where: {
          id: user.id
        },
        data: { ...user,
          isActive: false
        }
      });
      (0, _fs.writeFileSync)(".env", "");
    } else {
      spinner.fail("There is no authenticated user to log out.");
    }
  },

  async saveAllProjects(projects) {
    return Promise.allSettled(projects.map(name => prisma.project.create({
      data: {
        name
      }
    })));
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
  }

};
exports.DB = DB;