import { CodebaseAPI } from "@api";
import { DB, makeArray, spinner } from "@utils";

async function getTickets(query: string) {
  try {
    const user = await DB.getActiveUser();
    const res = await CodebaseAPI.getInstance().get(
      `/${user!.project.name}/tickets?query=${query}`
    );
    return makeArray(res.data["tickets"]["ticket"]);
  } catch (error: any) {
    if (error?.response?.status === 404) {
      spinner.info("There is no ticket matching your query.");
      process.exit(0);
    } else {
      spinner.fail("An error occurred querying your tickets.");
      process.exit(1);
    }
  }
}

export { getTickets };
