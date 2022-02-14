import inquirer from "inquirer";
import { format } from "util";
import chalk from "chalk";

import { Auth, getCategories, getPriorities, getProfile, getStatuses, getTicketTypes, getUsers } from "./api";
import { insertProjects, initDB, saveProjectDetails, listProjectDetails } from "./db";
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

    spinner.start("Authenticating...");
    const user = await getProfile(auth);
    spinner.stop();

    const projects = makeArray(user.assignments.assignment).map((assignment) => assignment.name.text);
    const { project } = await prompt([
      {
        type: "list",
        name: "project",
        message: "Select the project you want to work with:",
        choices: projects,
      },
    ]);
    await initDB();
    await insertProjects(projects);
    saveCredentialsToEnv({ ...auth, project });
    spinner.start("Getting project details...");

    const getProjectDetails = [getTicketTypes, getStatuses, getCategories, getPriorities, getUsers].map((fn) =>
      fn({ project, ...auth })
    );
    await Promise.all(getProjectDetails).then(async (details) => await saveProjectDetails(details, project));

    const successMessage = format(
      "Connected to %s as %s",
      ...[project, auth.username].map((name) => chalk.blueBright(name))
    );
    spinner.succeed(successMessage);
  },
  INTERACTIVE_UPDATE: async function () {
    const { users, categories, priorities, types, statuses } = await listProjectDetails();

    const editor = `{
   "assignee": "*",  
   "status":   "*", 
   "type":     "*",
   "priority": "*", 
   "category": "*", 
   "comment":  "*", 
   "subject":  "*" 
 }
 
 Note: Do no add or remove curly braces or commas, change only * marks.
 
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
