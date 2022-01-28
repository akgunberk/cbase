import { execSync } from "child_process";
import chalk from "chalk";
import inquirer from "inquirer";

import { checkAliasExist, DB, saveCredentialsToEnv, spinner } from "@utils";

const prompt = inquirer.prompt;

const PROMPTS = {
  ALIAS: async () => {
    await prompt([
      {
        type: "confirm",
        name: "addAlias",
        message: `Add 'cb' alias (${chalk.redBright(
          "may overwrite existing gh aliases"
        )})`,
        default: true,
        when() {
          return !checkAliasExist("cb");
        },
      },
    ]).then(({ addAlias }) => {
      if (addAlias) {
        execSync("gh alias set cb 'codebase'");
        spinner.succeed("Alias 'cb' for codebase is added.");
      }
    });
  },
  LOGIN: async () => {
    await prompt([
      {
        type: "input",
        name: "username",
        message: "API Username:",
      },
      {
        type: "input",
        name: "password",
        message: "API Key:",
      },
    ]).then(saveCredentialsToEnv);
  },

  SELECT_PROJECT: (choices: string[]) =>
    prompt([
      {
        type: "list",
        name: "selectedProject",
        message: "Select the project you want to work with:",
        choices,
      },
    ]),

  CUSTOM_QUERY: async (options: { list: boolean; overwrite: boolean }) => {
    if (options.list) {
      const savedQueries = await DB.getAllQueries();
      if (savedQueries.length)
        console.table(
          savedQueries.map((query) => {
            const { id, userId, ...rest } = query;
            return rest;
          })
        );
      else spinner.info("There is no saved queries.");
    }

    await prompt([
      {
        type: "input",
        name: "name",
        message: "provide a name for your query: ",
        validate: async function (queryName: string) {
          const queryExists = await DB.getSavedQuery(queryName);
          if (options.overwrite && queryExists) {
            console.error(
              "query already exist. try -o, --overwrite option if you want to overwrite"
            );
          }

          return true;
        },
      },
      {
        type: "input",
        name: "query",
        message:
          "provide a comma-seperated query (i.e assignee:janedoe,sorted:status)",
      },
    ]).then(DB.upsertQuery);
  },
};

export { PROMPTS };
