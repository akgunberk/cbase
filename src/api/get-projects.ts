import { CodebaseAPI } from "@api";
import { makeArray, spinner } from "@utils";

async function getProjects() {
  try {
    const res = await CodebaseAPI.getInstance().get(`/projects`);
    return makeArray(res.data.projects.project);
  } catch (error: any) {
    spinner.fail("An error occurred getting projects that you involved.");
    process.exit(1);
  }
}

export { getProjects };
