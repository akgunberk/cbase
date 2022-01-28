import { json2xml, xml2json } from "xml-js";

export const CODEBASE_API_URL = "https://api3.codebasehq.com";

export const XML2JSON_OPTIONS = {
  compact: true,
  trim: true,
  textKey: "text",
  ignoreComment: true,
  ignoreAttributes: true,
  ignoreDeclaration: true,
};

const JSON2XML_OPTIONS = { compact: true, ignoreComment: true, spaces: 4 };

export const API_OPTIONS = {
  baseURL: CODEBASE_API_URL,
  timeout: 3000,
  headers: {
    Accept: "application/xml",
    "Content-Type": "application/xml",
  },
  auth: {
    username: process.env.username || "",
    password: process.env.password || "",
  },
  transformRequest: [
    (data: Record<string, any>) => {
      if (data) {
        return json2xml(JSON.stringify(data), JSON2XML_OPTIONS);
      }
    },
  ],
  transformResponse: [
    (xml: string) => {
      if (xml) {
        return JSON.parse(xml2json(xml, XML2JSON_OPTIONS));
      }
    },
  ],
};

export const QUERIES = {
  assigned: "assignee:me",
  sort: "sort:priority",
};

export const TICKET_TABLE_HEADERS = [
  "#",
  "type",
  "status",
  "priority",
  "status",
  "summary",
];

export const TTY_WIDTH = process.stdout.columns - 4;
