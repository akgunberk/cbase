import inquirer from "inquirer";
import { format } from "util";
import chalk from "chalk";

import { Auth, getCategories, getPriorities, getProfile, getStatuses, getTicketTypes, getUsers } from "./api";
import {
  listAllQueries,
  findSavedQuery,
  upsertUserQuery,
  upsertProjects,
  setProjectDetails,
  listProjectDetails,
} from "./db";
import { displayTabularData, makeArray, saveCredentialsToEnv, spinner } from "./utils";

const prompt = inquirer.prompt;

const PROMPTS = {
  LOGIN: async () => {
    const auth: Auth = await prompt([
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
    ]);

    const user = await getProfile(auth);
    const projects = makeArray(user.assignments.assignment).map((assignment) => assignment.name.text);
    const { project } = await prompt([
      {
        type: "list",
        name: "project",
        message: "Select the project you want to work with:",
        choices: projects,
      },
    ]);
    await upsertProjects(projects);
    saveCredentialsToEnv({ ...auth, project });

    spinner.start("Getting project details...");

    const getProjectDetails = [getTicketTypes, getStatuses, getCategories, getPriorities, getUsers].map((fn) =>
      fn.call(null, { ...auth, project })
    );
    await Promise.all(getProjectDetails).then(setProjectDetails);

    const successMessage = format(
      "Connected to %s as %s",
      ...[project, auth.username].map((name) => chalk.blueBright(name))
    );
    spinner.succeed(`Connected to ${project} as ${successMessage}`);
  },

  CUSTOM_QUERY: async (options: { list: boolean; overwrite: boolean }) => {
    if (options.list) {
      const savedQueries = await listAllQueries();
      if (savedQueries.length) {
        spinner.info("Saved custom queries:");
        console.table(
          savedQueries.map((query) => {
            const { id, ...queryDetails } = query;
            return queryDetails;
          })
        );
      } else spinner.info("There is no saved queries.");
      return;
    }

    await prompt([
      {
        type: "input",
        name: "name",
        message: "provide a name for your query: ",
        validate: async function (queryName: string) {
          const queryExists = await findSavedQuery(queryName);
          if (options.overwrite && queryExists) {
            console.error("query already exist. try -o, --overwrite option if you want to overwrite");
          }

          return true;
        },
      },
      {
        type: "input",
        name: "query",
        message: "provide a comma-seperated query (i.e assignee:janedoe,sorted:status)",
      },
    ]).then(upsertUserQuery);
  },

  INTERACTIVE_UPDATE: async function () {
    const { users, categories, priorities, types, statuses } = (await listProjectDetails())!;

    const editor = `{
  "assignee": "*",  
  "status":   "*", 
  "type":     "*",
  "priority": "*", 
  "category": "*", 
  "comment":  "*", 
  "subject":  "*" 
}

Note: Do no remove curly braces, change only * marks.

--- Project Details ---

${Object.entries({ statuses, types, categories, priorities })
  .map(([header, values]) =>
    displayTabularData(
      values.map((value) => value.name),
      header
    )
  )
  .join("\n")}

${displayTabularData(
  users.map((user) => user.username),
  "Users"
)}
`;

    const { payload } = await prompt([
      {
        type: "editor",
        name: "payload",
        message: "Fill the fields marked with *",
        default: editor,
      },
    ]);

    return JSON.parse(payload.slice(0, payload.indexOf("}") + 1));
  },
};

export { PROMPTS };
