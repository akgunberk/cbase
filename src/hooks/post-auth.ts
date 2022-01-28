import chalk from "chalk";

import { DB, spinner } from "@utils";
import { PROMPTS } from "@prompts";
import {
  getProfile,
  getProjects,
  getTicketTypes,
  getStatuses,
  getCategories,
  getPriorities,
} from "@api";

async function postAuth() {
  spinner.start("Connecting to Codebase...");

  let user;
  const isUserAuth = await DB.getActiveUser();

  if (isUserAuth) {
    spinner.fail(
      [
        "You already connected to codebase.",
        "If you want to switch user change your credentials",
        "See logout: gh codebase logout",
      ].join("\n")
    );
    process.exit(0);
  } else {
    user = await getProfile();
    spinner.stop();
  }

  const xmlProjects = await getProjects();
  const projects = xmlProjects.map((project) => project.name.text) as string[];
  await DB.saveAllProjects(projects);

  const { selectedProject } = await PROMPTS.SELECT_PROJECT(projects);

  await DB.setUser({
    username: user.username.text,
    selectedProject,
  });

  spinner.start("Getting project details...");
  const getProjectDetails = [
    getTicketTypes(),
    getStatuses(),
    getCategories(),
    getPriorities(),
  ];
  await Promise.all(getProjectDetails).then(DB.setProjectDetails);
  spinner.succeed(
    `Connected to ${selectedProject} as ${chalk.blueBright(user.username.text)}`
  );

  await PROMPTS.ALIAS();
}

export { postAuth };
