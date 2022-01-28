import { Command } from "commander";

const program = new Command();

program
  .argument("<ticket-id>", "number of the ticket to operate")
  .usage("<ticket-id> [options]")
  .description("read/update ticket details")
  .option("-s, --status", "")
  .action((options) => {
    console.log(options);
  });

program.parse(process.argv);
