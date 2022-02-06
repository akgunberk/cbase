import { Command } from "commander";
import { getTicketDetailsWithQuery } from "../api";
import { HELP_TEXTS } from "../constants";
import { PROMPTS } from "../prompts";
import { displayTicketListTable, displayTicketTimeline, generateQueryString } from "../utils";

const program = new Command();

const query = program
  .name("cbase")
  .usage("get [ticket-id] [options]")
  .argument("[id]", "get specific ticket details")
  .option("-a, --assignee <assignee>", "List tickets by assignee", "me")
  .option("-p, --priority <priority>", "List tickets by priority")
  .option("-s, --status <status>", "List tickets by status")
  .option("-t, --type <type>", "List tickets by type")
  .option("-h, --head <number>", "Display top <number> ticket", "10")
  .option("-u, --updates <number>", "Display last <number> ticket updates (works only with given ticket-id)", "3")
  .option("-S, --sort <type>", "Sort ticket by <type>", "priority")
  .addHelpText("after", HELP_TEXTS.get)
  .action(async (ticketId, { updates, head, ...queries }: Record<string, string>) => {
    const finalQuery = ticketId ? `id:${ticketId}` : generateQueryString(queries);
    const tickets = await getTicketDetailsWithQuery(finalQuery);

    displayTicketListTable(tickets);

    if (ticketId) {
      displayTicketTimeline(ticketId, Number(updates));
    }
  });

query
  .command("add")
  .description("add custom query")
  .option("-o, --overwrite", "overwrite query if it exists")
  .option("-l, --list", "list added queries")
  .action(PROMPTS.CUSTOM_QUERY);

program.parse(process.argv);
