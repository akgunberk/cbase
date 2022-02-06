#!/usr/bin/env node
import pkg from "../package.json";

import path from "path";
import { Command } from "commander";
import chalk from "chalk";

import "./commands/log";
import "./commands/get";
import "./commands/set";

export const program = new Command();

const paths = {
  log: path.join(__dirname, "commands", "log.js"),
  get: path.join(__dirname, "commands", "get.js"),
  set: path.join(__dirname, "commands", "set.js"),
};

program
  .name("cbase")
  .addHelpText("beforeAll", chalk.bold.whiteBright("Bring codebase into your terminal"))
  .version(pkg.version, "-v, --version", "display the current version")
  .command("log", "log-in/out to codebase with your credentials", {
    executableFile: paths.log,
  })
  .command("get", "get your ticket details", {
    executableFile: paths.get,
  })
  .alias("g")
  .command("set", "set your ticket details", {
    executableFile: paths.set,
  })
  .alias("s");

program.parse(process.argv);
