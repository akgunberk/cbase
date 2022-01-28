"use strict";

var _database = require("./database");

let statuses, priorities;

(async () => {
  priorities = (await _database.prisma.priority.findMany()).reduce((priorities, priority) => {
    priorities[priority.id] = priority.name;
    return priorities;
  }, {});
  statuses = (await _database.prisma.status.findMany()).reduce((statuses, status) => {
    statuses[status.id] = status.name;
    return statuses;
  }, {});
})();

function getTicketStatus(ticket) {}

function getTicketPriority(ticket) {}