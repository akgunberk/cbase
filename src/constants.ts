import { xml2json } from "xml-js";
import { getCredentialsFromEnv } from "./utils";

/* API */

export const CODEBASE_API_URL = "https://api3.codebasehq.com";

export const XML2JSON_OPTIONS = {
  compact: true,
  trim: true,
  textKey: "text",
  ignoreComment: true,
  ignoreAttributes: true,
  ignoreDeclaration: true,
  explicitArray: true,
};

export const API_OPTIONS = {
  baseURL: CODEBASE_API_URL,
  timeout: 3000,
  headers: {
    Accept: "application/xml",
    "Content-Type": "application/xml",
  },
  transformResponse: [
    (xml: string) => {
      if (xml) {
        try {
          const json = JSON.parse(xml2json(xml, XML2JSON_OPTIONS));
          return json;
        } catch (error) {
          return xml;
        }
      }
    },
  ],
};

export const QUERIES = {
  assigned: "assignee:me",
  sort: "sort:priority",
};

/* UI */

export const TICKET_TABLE_HEADERS = ["id", "type", "status", "priority", "status", "summary"];

export const TTY_WIDTH = process.stdout.columns - 4;

export const TICKET_CONTENT = [
  "ticket-id",
  "ticket-type",
  "reporter",
  "assignee-id",
  "priority-id",
  "category-id",
  "status-id",
  "summary",
];

export const TICKET_UPDATE_CONTENT = ["content", "updated-at", "user-id", "updates"];

/* COMMAND */

export const HELP_TEXTS = {
  get: `
Get last 10 tickets assigned to me: 
cbase get  
By default, assigned tickets are queried. use -a to specify assignee
cbase get -a <username> 

Negative values: Add a ! before the field name
cbase get -t !Bug      display tickets with type not(Bug)

You can use multiple word queries by comma
cbase get -t Bug,Feature     display Bug and Feature type tickets

Multiple values: Comma separate values
cbase get -t Bug -p High     display assigned High priority Bug type tickets
`,
  set: `
Update status:
$ gh codebase (ticket|t) <id> -s "In Progress"

Update multiple field: (you can use interactive mode: gh codebase t -i)
$ gh codebase (ticket|t) <id> -s "In Progress" -a berk-akgun

Display timeline of the ticket:
$ gh codebase (ticket|t) <id> -n
    or
$ gh codebase (ticket|t) <id> -n 5 (Last 5 updates)


Add a comment:
$ gh codebase (ticket|t) <id> -C "Who wants to grab a beer after work?"
or
$ gh codebase (ticket|t) <id> -S "(DUPLICATE): ...." -C "Ticket is duplicated, updating it as invalid." -s Invalid

`,
};
