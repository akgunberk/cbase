import { CodebaseAPI } from "@api";
import { DB, makeArray, spinner } from "@utils";

async function getTicketTypes() {
  try {
    const user = await DB.getActiveUser();
    const res = await CodebaseAPI.getInstance().get(
      `/${user!.project.name}/tickets/types`
    );
    return makeArray(res.data["ticketing-types"]["ticketing-type"]);
  } catch (error: any) {
    spinner.fail("An error occurred getting ticket types of your project.");
  }
}

export { getTicketTypes };
