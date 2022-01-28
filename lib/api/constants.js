"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.XML2JSON_OPTIONS = exports.TTY_WIDTH = exports.TICKET_TABLE_HEADERS = exports.QUERIES = exports.CODEBASE_API_URL = exports.API_OPTIONS = void 0;

var _xmlJs = require("xml-js");

const CODEBASE_API_URL = "https://api3.codebasehq.com";
exports.CODEBASE_API_URL = CODEBASE_API_URL;
const XML2JSON_OPTIONS = {
  compact: true,
  trim: true,
  textKey: "text",
  ignoreComment: true,
  ignoreAttributes: true,
  ignoreDeclaration: true
};
exports.XML2JSON_OPTIONS = XML2JSON_OPTIONS;
const JSON2XML_OPTIONS = {
  compact: true,
  ignoreComment: true,
  spaces: 4
};
const API_OPTIONS = {
  baseURL: CODEBASE_API_URL,
  timeout: 3000,
  headers: {
    Accept: "application/xml",
    "Content-Type": "application/xml"
  },
  auth: {
    username: process.env.username || "",
    password: process.env.password || ""
  },
  transformRequest: [data => {
    if (data) {
      return (0, _xmlJs.json2xml)(JSON.stringify(data), JSON2XML_OPTIONS);
    }
  }],
  transformResponse: [xml => {
    if (xml) {
      return JSON.parse((0, _xmlJs.xml2json)(xml, XML2JSON_OPTIONS));
    }
  }]
};
exports.API_OPTIONS = API_OPTIONS;
const QUERIES = {
  assigned: "assignee:me",
  sort: "sort:priority"
};
exports.QUERIES = QUERIES;
const TICKET_TABLE_HEADERS = ["#", "type", "status", "priority", "status", "summary"];
exports.TICKET_TABLE_HEADERS = TICKET_TABLE_HEADERS;
const TTY_WIDTH = process.stdout.columns - 4;
exports.TTY_WIDTH = TTY_WIDTH;