import { Command } from "commander";

import { updateTicket } from "../api";
import { generateUpdateTicketPayload, spinner } from "../utils";
import { HELP_TEXTS } from "../constants";
import { PROMPTS } from "../prompts";

const program = new Command();

program
  .usage("cbase set <ticket-id> [options]")
  .argument("<id>", "ticket id")
  .description("Update tickets on your terminal")
  .option("-a, --assignee <assignee>", "Update assignee")
  .option("-c, --category <category>", "Update category")
  .option("-C, --comment <comment>", "Add ticket comment")
  .option("-p, --priority <priority>", "Update priority")
  .option("-s, --status <status>", "Update status")
  .option("-S, --subject <subject>", "Update ticket header")
  .option("-t, --type <type>", "Update ticket type")
  .option("-T, --tag <tag>", "Add ticket tag")
  .option("-P, --private-update", "Make updates private")
  .option("-i, --interactive", "Update ticket interactively in a more concise way")
  .action(async (id, { notes, interactive, ...options }) => {
    const updatedFields = interactive ? await PROMPTS.INTERACTIVE_UPDATE() : options;
    const payload = await generateUpdateTicketPayload(updatedFields);

    spinner.start("Updating ticket...");
    await updateTicket(id, payload);
    spinner.succeed("Ticket updated.");
  })
  .addHelpText("after", HELP_TEXTS.set);

program.parseAsync(process.argv);
