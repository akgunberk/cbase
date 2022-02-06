import { unlinkSync } from "fs";
import chalk from "chalk";
import { Command } from "commander";

import { PROMPTS } from "../prompts";
import { spinner } from "../utils";

const program = new Command();

program
  .command("in")
  .description("login your codebase account with api credentials")
  .action(PROMPTS.LOGIN)
  .addHelpText("after", chalk.redBright("You can find your api credentials on codebasehq.com/settings/profile \n"));

program
  .command("out")
  .description("logout your current user")
  .action(() => {
    const user = process.env.username;

    if (user) {
      try {
        unlinkSync(".env");
      } catch (error) {
        spinner.fail("Could not delete env credentials");
      }

      spinner.succeed("Logout successfully.");
    } else {
      spinner.fail("There is no authenticated user to log out.");
    }
  });

program.parseAsync(process.argv);
