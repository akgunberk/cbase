#!/usr/bin/env node
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.program = void 0;

var _package = _interopRequireDefault(require("../package.json"));

var _path = _interopRequireDefault(require("path"));

var _commander = require("commander");

var _chalk = _interopRequireDefault(require("chalk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const program = new _commander.Command();
exports.program = program;
const paths = {
  log: _path.default.join(__dirname, "commands", "log.js"),
  get: _path.default.join(__dirname, "commands", "get.js"),
  set: _path.default.join(__dirname, "commands", "set.js")
};
program.name("cbase").addHelpText("beforeAll", _chalk.default.bold.whiteBright("Bring codebase into your terminal")).version(_package.default.version, "-v, --version", "display the current version").command("log", "log-in/out to codebase with your credentials", {
  executableFile: paths.log
}).command("get", "get your ticket details", {
  executableFile: paths.get
}).alias("g").command("set", "set your ticket details", {
  executableFile: paths.set
}).alias("s");
program.parse(process.argv);