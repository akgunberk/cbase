import { Ticket } from "@prisma/client";
import { Command } from "commander";

import { getTickets } from "@api";
import { TTY_WIDTH, TICKET_TABLE_HEADERS } from "@api/constants";
import { PROMPTS } from "@prompts";
import { DB, pickXmlContent } from "@utils";

const program = new Command();

const query = program
  /*   .command("query")
  .alias("q")
  .description("query your tickets and display them in a well printed way") */
  .option("-a, --assignee <assignee>", "List tickets by assignee", "me")
  .option("-p, --priority <priority>", "List tickets by priority")
  .option("-s, --status <status>", "List tickets by status")
  .option("-t, --type <type>", "List tickets by type")
  .option("-h, --head <number>", "Display top <number> ticket", "5")
  .addHelpText(
    "after",
    [
      " Example:",
      " By default, assigned tickets are queried. use -a to specify assignee",
      "gh codebase (query | q), display assigned tickets",
      "gh codebase (query | q) -t Bug -p High, display assigned High priority Bug type tickets",
      "gh codebase (query | q) -a -b, display assigned bug type tickets",
    ].join("\n")
  )
  .action(async ({ head, ...options }: Record<string, string>) => {
    const finalQuery = Object.entries(options)
      .map((query) => query.join(":"))
      .join(" ");

    const tickets: Ticket[] = await getTickets(finalQuery);
    const priorities = await DB.getTicketPriorities();
    const statuses = await DB.getTicketStatuses();

    const selectedTickets = tickets.map((xmlTicket) => {
      const ticket = pickXmlContent(xmlTicket, [
        "ticket-id",
        "ticket-type",
        "reporter",
        "assignee",
        "priority-id",
        "category-id",
        "status-id",
        "summary",
      ]);

      ticket["#"] = ticket.ticketId;
      ticket.type = ticket.ticketType;
      ticket.priority = priorities[ticket.priorityId];
      ticket.status = statuses[ticket.statusId];
      ticket.summary = ticket.summary
        .slice(0, TTY_WIDTH / 3)
        .padEnd(TTY_WIDTH / 3, " ");

      return ticket;
    });

    console.table(selectedTickets, [
      ...TICKET_TABLE_HEADERS,
      ...(options.assignee !== "me" ? ["assignee"] : []),
    ]);
  });

query
  .command("add")
  .description("add custom query")
  .option("-o, --overwrite", "overwrite query if it exists")
  .option("-l, --list", "list added queries")
  .action(PROMPTS.CUSTOM_QUERY);

program.parse(process.argv);
