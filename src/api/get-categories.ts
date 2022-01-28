import { CodebaseAPI } from "@api";
import { DB, makeArray, spinner } from "@utils";

async function getCategories() {
  try {
    const user = await DB.getActiveUser();
    const res = await CodebaseAPI.getInstance().get(
      `/${user!.project.name}/tickets/categories`
    );
    return makeArray(res.data["ticketing-categories"]["ticketing-category"]);
  } catch (error: any) {
    spinner.fail("An error occurred getting categories of your project.");
  }
}

export { getCategories };
