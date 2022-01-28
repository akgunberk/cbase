import { CodebaseAPI } from "@api";
import { DB, makeArray, spinner } from "@utils";

async function getPriorities() {
  try {
    const user = await DB.getActiveUser();
    const res = await CodebaseAPI.getInstance().get(
      `/${user!.project.name}/tickets/priorities`
    );
    return makeArray(res.data["ticketing-priorities"]["ticketing-priority"]);
  } catch (error: any) {
    spinner.fail("An error occurred getting priorities of your project.");
  }
}

export { getPriorities };
