import chalk from "chalk";
import { Command } from "commander";

import { postAuth } from "@hooks";
import { PROMPTS } from "@prompts";
import { DB } from "@utils";

const program = new Command();

program
  .command("login")
  .description("login your codebase account with api credentials")
  .action(PROMPTS.LOGIN)
  .hook("postAction", postAuth)
  .addHelpText(
    "after",
    chalk.redBright(
      "You can find your api credentials on codebasehq.com/settings/profile \n"
    )
  );

program
  .command("logout")
  .description("logout your current user")
  .action(DB.logout);

program.parseAsync(process.argv);
