"use strict";

var _commander = require("commander");

const program = new _commander.Command();
program.argument("<ticket-id>", "number of the ticket to operate").usage("<ticket-id> [options]").description("read/update ticket details").option("-s, --status", "").action(options => {
  console.log(options);
});
program.parse(process.argv);