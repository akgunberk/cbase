import { CodebaseAPI } from "@api";
import { DB, makeArray, spinner } from "@utils";

async function getStatuses() {
  try {
    const user = await DB.getActiveUser();
    const res = await CodebaseAPI.getInstance().get(
      `/${user!.project.name}/tickets/statuses`
    );

    return makeArray(res.data["ticketing-statuses"]["ticketing-status"]);
  } catch (error: any) {
    spinner.fail("An error occurred getting your profile.");
  }
}

export { getStatuses };
