#!/usr/bin/env node
import pkg from "../package.json";

import { Command } from "commander";

export const program = new Command();

program
  .version(pkg.version, "-v, --version", "display the current version")
  .command("auth", "log-in/out to codebase with your credentials", {
    executableFile: "commands/auth.js",
  })
  .alias("a")
  .command("query", "query your tickets and display in a table", {
    executableFile: "commands/query.js",
  })
  .alias("q")
  .command("ticket", "read/update ticket details", {
    executableFile: "commands/ticket.js",
  })
  .alias("t");

program.parse(process.argv);
