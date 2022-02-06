#!/usr/bin/env node
import pkg from "../package.json";

import { Command } from "commander";
import chalk from "chalk";
import {
  displayTicketListTable,
  displayTicketTimeline,
  generateQueryString,
  generateUpdateTicketPayload,
  spinner,
} from "./utils";
import { unlinkSync } from "fs";
import { PROMPTS } from "./prompts";
import { getTicketDetailsWithQuery, updateTicket } from "./api";
import { HELP_TEXTS } from "./constants";

export const program = new Command();

const cbase = program
  .name("cbase")
  .addHelpText("beforeAll", chalk.bold.whiteBright("Bring codebase into your terminal"))
  .version(pkg.version, "-v, --version", "display the current version");

const log = cbase.command("log").description("log-in/out to codebase with your credentials");

log
  .command("in")
  .description("login your codebase account with api credentials")
  .action(PROMPTS.LOGIN)
  .addHelpText("after", chalk.redBright("You can find your api credentials on codebasehq.com/settings/profile \n"));

log
  .command("out")
  .description("logout your current user")
  .action(() => {
    const user = process.env.username;

    if (user) {
      try {
        unlinkSync(".env");
      } catch (error) {
        spinner.fail("Could not delete env credentials");
      }

      spinner.succeed("Logout successfully.");
    } else {
      spinner.fail("There is no authenticated user to log out.");
    }
  });

const get = cbase.command("get").description("get your ticket details").alias("g");

get
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

const set = cbase.command("set").description("set your ticket details").alias("s");

set
  .usage("cbase set <ticket-id> [options]")
  .argument("<id>", "ticket id")
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

program.parse(process.argv);
