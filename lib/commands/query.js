"use strict";

var _commander = require("commander");

var _api = require("../api");

var _constants = require("../api/constants");

var _prompts = require("../prompts");

var _utils = require("../utils");

const program = new _commander.Command();
const query = program
/*   .command("query")
.alias("q")
.description("query your tickets and display them in a well printed way") */
.option("-a, --assignee <assignee>", "List tickets by assignee", "me").option("-p, --priority <priority>", "List tickets by priority").option("-s, --status <status>", "List tickets by status").option("-t, --type <type>", "List tickets by type").option("-h, --head <number>", "Display top <number> ticket", "5").addHelpText("after", [" Example:", " By default, assigned tickets are queried. use -a to specify assignee", "gh codebase (query | q), display assigned tickets", "gh codebase (query | q) -t Bug -p High, display assigned High priority Bug type tickets", "gh codebase (query | q) -a -b, display assigned bug type tickets"].join("\n")).action(async ({
  head,
  ...options
}) => {
  const finalQuery = Object.entries(options).map(query => query.join(":")).join(" ");
  const tickets = await (0, _api.getTickets)(finalQuery);
  const priorities = await _utils.DB.getTicketPriorities();
  const statuses = await _utils.DB.getTicketStatuses();
  const selectedTickets = tickets.map(xmlTicket => {
    const ticket = (0, _utils.pickXmlContent)(xmlTicket, ["ticket-id", "ticket-type", "reporter", "assignee", "priority-id", "category-id", "status-id", "summary"]);
    ticket["#"] = ticket.ticketId;
    ticket.type = ticket.ticketType;
    ticket.priority = priorities[ticket.priorityId];
    ticket.status = statuses[ticket.statusId];
    ticket.summary = ticket.summary.slice(0, _constants.TTY_WIDTH / 3).padEnd(_constants.TTY_WIDTH / 3, " ");
    return ticket;
  });
  console.table(selectedTickets, [..._constants.TICKET_TABLE_HEADERS, ...(options.assignee !== "me" ? ["assignee"] : [])]);
});
query.command("add").description("add custom query").option("-o, --overwrite", "overwrite query if it exists").option("-l, --list", "list added queries").action(_prompts.PROMPTS.CUSTOM_QUERY);
program.parse(process.argv);