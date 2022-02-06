import { format } from "util";
import { writeFileSync } from "fs";
import dotenv from "dotenv";
import ora from "ora";
import chalk from "chalk";

import { Auth, getTicketUpdates } from "./api";
import { listProjectDetails, listUsers, prisma } from "./db";
import { Ticket } from "@prisma/client";
import { TICKET_CONTENT, TICKET_TABLE_HEADERS, TICKET_UPDATE_CONTENT, TTY_WIDTH } from "./constants";
import { Transform } from "stream";
import { Console } from "console";

export const spinner = ora();

/* ENV  */

export function saveCredentialsToEnv(answers: { project?: string } & Auth) {
  try {
    writeFileSync(
      ".env",
      Object.entries<string>(answers)
        .map((answer) => answer.join("="))
        .join("\n")
    );
  } catch (error) {
    spinner.fail("An error occurred while saving your credentials.");
    process.exit(1);
  }
}

export function getCredentialsFromEnv() {
  const { username, password, project } = dotenv.config().parsed || {};

  if (username && password) {
    return { username, password, project };
  }

  spinner.fail("You need to log in with: cbase log in");
  process.exit(0);
}

/* XML-2-JS  */

/**
 * xml-to-json parser may return the object directly for singular xml tags
 *
 * it return an array of objects for multiple tags
 */
export function makeArray(input: Record<string, any> | any): any[] {
  if (Array.isArray(input)) return input;

  return [input];
}

export function splitArrayIntoChunks(cells: any[], chunk: number): any[][] {
  const chunkSize = cells.length / chunk > 1 ? chunk : cells.length;

  return cells.reduce<any[][]>((tabular, cell, index) => {
    if (index % chunkSize === 0) tabular.push([]);

    tabular[tabular.length - 1].push(cell);

    return tabular;
  }, []);
}

/**
 * select text field from xml content if it has
 *
 * if xml element in kebab-case transform it to camel case
 * @param  {Record<string} obj
 * @param  {} any>
 * @param  {string[]} keys
 */
export function pickXmlContent(obj: Record<string, any>, keys: string[]) {
  const pickedObject: Record<string, any> = {};

  for (const key of keys) {
    if (key in obj) {
      let value = obj[key].text;

      if (["true", "false"].includes(obj[key].text)) {
        value = value === "true";
      }

      pickedObject[kebabToCamelCase(key)] = value;
    }
  }
  return pickedObject;
}

export function kebabToCamelCase(word: string): string {
  return word
    .split("-")
    .map((word, index) => (index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
    .join("");
}

export function generateQueryString(queries: Record<string, string>): string {
  return Object.entries(queries)
    .map((query) => query.join(":"))
    .join(" ");
}

interface UpdateTicketPayload {
  comment: string;
  subject: string;
  status: string;
  priority: string;
  category: string;
  assignee: string;
  type: string;
  privateUpdate: boolean;
}

export async function generateUpdateTicketPayload(answers: Partial<UpdateTicketPayload>) {
  const { comment, subject, privateUpdate, ...changes } = answers;

  const [status, priority, category, type, assignee] = await Promise.all([
    prisma.status.findUnique({ where: { name: changes.status ?? "*" } }),

    prisma.priority.findUnique({ where: { name: changes.priority ?? "*" } }),

    prisma.category.findUnique({ where: { name: changes.category ?? "*" } }),

    prisma.type.findUnique({ where: { name: changes.type ?? "*" } }),

    prisma.user.findUnique({ where: { username: changes.assignee ?? "*" } }),
  ]);

  const payload = `<ticket-note>
${comment && comment !== "*" ? `<content>${comment}</content>` : ""}
<changes>
${subject && subject !== "*" ? `<subject>${subject}</subject>` : ""}
${assignee ? `<assignee-id>${assignee.id}</assignee-id>` : ""}
${type ? `<ticket-type-id>${type.id}</ticket-type-id>` : ""}
${status ? `<status-id>${status.id}</status-id>` : ""}
${priority ? `<priority-id>${priority.id}</priority-id>` : ""}
${category ? `<category-id>${category.id}</category-id>` : ""}
</changes>
${privateUpdate ? "<private>1</private>" : ""}
</ticket-note>
`.replace(/\n/g, "");

  return payload;
}

/* UI */

export async function displayTicketTimeline(ticketId: string, limit: number) {
  const users = await listUsers();

  const timelineEvents: string[] = [];
  const timelineSeparator = chalk.redBright("\n┃\n┃\n");
  for (const xmlUpdateNote of (await getTicketUpdates(ticketId)).slice(limit * -1)) {
    const { content, updatedAt, userId, updates } = pickXmlContent(xmlUpdateNote, TICKET_UPDATE_CONTENT);

    const timestamp = "on " + new Date(updatedAt).toDateString() + " at " + updatedAt.replace("Z", "").split("T").pop();

    const username = users.find((user) => user.id === userId)?.username;

    const changedFields = Object.entries<[string, string]>(JSON.parse(updates));

    const changes: string[] = [];

    if (content) {
      const highlights = [username, timestamp]
        .map((item) => chalk.whiteBright(item))
        .concat(chalk.italic.redBright(content));
      changes.push(format("%s commented %s\n%s", ...highlights));
    }

    if (changedFields.length) {
      for (const [changedField, [from, to]] of changedFields) {
        const field = changedField.split("_")[0].toUpperCase();

        const highlights = [username, field, from, to, timestamp].map((item) => chalk.whiteBright(item));
        changes.push(format("%s changed %s from %s to %s on %s", ...highlights));
      }
    }

    timelineEvents.push(changes.join("\n"));
  }

  console.log(chalk.underline.greenBright(`Last ${limit} updates:`));
  console.log(timelineEvents.join(timelineSeparator));
  return;
}

export async function displayTicketListTable(tickets: Ticket[], limit = 10) {
  const { users, priorities, statuses, categories } = (await listProjectDetails())!;

  function formatXmlTicket(xmlTicket: Record<string, any>) {
    const { ticketId, ticketType, reporter, assigneeId, priorityId, categoryId, statusId, summary } = pickXmlContent(
      xmlTicket,
      TICKET_CONTENT
    );

    return {
      id: ticketId,
      type: ticketType,
      reporter,
      category: categories.find((category) => category.id === categoryId)?.name,
      priority: priorities.find((priority) => priority.id === priorityId)?.name,
      status: statuses.find((status) => status.id === statusId)?.name,
      assignee: users.find((user) => user.userId === assigneeId)?.username,
      summary: summary.slice(0, TTY_WIDTH / 3).padEnd(TTY_WIDTH / 3, " "),
    };
  }

  const tableContent: Record<string, any> =
    tickets.length === 1
      ? [formatXmlTicket(tickets[0])]
      : tickets.slice(0, limit).map((xmlTicket) => formatXmlTicket(xmlTicket));

  console.clear();
  console.table(tableContent, TICKET_TABLE_HEADERS);
  return;
}

export function displayTabularData(cells: string[], header: string, column = 6) {
  const stdout = new Transform({
    transform(chunk, _, cb) {
      cb(null, chunk);
    },
  });
  const logger = new Console({ stdout });

  const table = splitArrayIntoChunks(cells, column);

  logger.table(table);

  const rows = (stdout.read() || "").toString().split(/[\r\n]+/);
  const rowWidth = rows[0].length;

  return rows
    .map((row: string, index: number) => {
      if (index === 0) return row.replace(/┬/g, "─");
      if (index === 2) return row.replace(/┼/g, "┬");
      if (index === 1) {
        const pad = Math.floor((rowWidth - 2) / 2) + Math.floor(header.length / 2);
        return "│" + header.padStart(pad).padEnd(rowWidth - 2) + "│";
      }
      return row;
    })
    .join("\n");
}
