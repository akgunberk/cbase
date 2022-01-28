#!/usr/bin/env node
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.program = void 0;

var _package = _interopRequireDefault(require("../package.json"));

var _commander = require("commander");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const program = new _commander.Command();
exports.program = program;
program.version(_package.default.version, "-v, --version", "display the current version").command("auth", "log-in/out to codebase with your credentials", {
  executableFile: "commands/auth.js"
}).alias("a").command("query", "query your tickets and display in a table", {
  executableFile: "commands/query.js"
}).alias("q").command("ticket", "read/update ticket details", {
  executableFile: "commands/ticket.js"
}).alias("t");
program.parse(process.argv);