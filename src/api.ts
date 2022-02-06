import "dotenv/config";
import axios from "axios";
import { API_OPTIONS } from "./constants";

import { getCredentialsFromEnv, spinner, makeArray } from "./utils";

export type Auth = { username: string; password: string };

export type GetIinitialProjectDetailsParams = { project: string } & Auth;

const API = axios.create({
  ...API_OPTIONS,
});

export async function getProfile(auth: Auth) {
  try {
    spinner.start("Authenticating...");
    const { data } = await API.get("/profile", { auth });
    spinner.stop();
    return data.user;
  } catch (error: any) {
    if (error.status === 401) spinner.fail("Check your credentials.");
    else spinner.fail("An error occurred getting your profile.");
    process.exit(1);
  }
}

export async function getProjects() {
  try {
    const res = await API.get(`/projects`);
    return makeArray(res.data.projects.project);
  } catch (error: any) {
    spinner.fail("An error occurred getting projects that you involved.");
    process.exit(1);
  }
}

export async function getTicketTypes({ project, ...auth }: GetIinitialProjectDetailsParams) {
  try {
    const res = await API.get(`/${project}/tickets/types`, { auth });
    return makeArray(res.data["ticketing-types"]["ticketing-type"]);
  } catch (error: any) {
    spinner.fail("An error occurred getting ticket types of your project.");
  }
}

export async function getStatuses({ project, ...auth }: GetIinitialProjectDetailsParams) {
  try {
    const res = await API.get(`/${project}/tickets/statuses`, { auth });

    return makeArray(res.data["ticketing-statuses"]["ticketing-status"]);
  } catch (error: any) {
    spinner.fail("An error occurred getting your profile.");
  }
}

export async function getPriorities({ project, ...auth }: GetIinitialProjectDetailsParams) {
  try {
    const res = await API.get(`/${project}/tickets/priorities`, { auth });
    return makeArray(res.data["ticketing-priorities"]["ticketing-priority"]);
  } catch (error: any) {
    spinner.fail("An error occurred getting priorities of your project.");
  }
}

export async function getCategories({ project, ...auth }: GetIinitialProjectDetailsParams) {
  try {
    const res = await API.get(`/${project}/tickets/categories`, { auth });
    return makeArray(res.data["ticketing-categories"]["ticketing-category"]);
  } catch (error: any) {
    spinner.fail("An error occurred getting categories of your project.");
  }
}

export async function getUsers({ project, ...auth }: GetIinitialProjectDetailsParams) {
  try {
    const res = await API.get(`/${project}/assignments`, { auth });
    return makeArray(res.data["users"]["user"]);
  } catch (error: any) {
    spinner.fail("An error occurred getting assignees of your project.");
  }
}

export async function getTicketUpdates(id: string) {
  try {
    const res = await API.get(`/${process.env.project}/tickets/${id}/notes`);
    return makeArray(res.data["ticket-notes"]["ticket-note"]);
  } catch (error: any) {
    spinner.fail("An error occurred getting your ticket updates");
    process.exit(1);
  }
}

export async function getTicketDetailsWithQuery(query: string, page = 1) {
  const { project, ...auth } = getCredentialsFromEnv();

  try {
    const res = await API.get(`/${project}/tickets`, {
      auth,
      params: { query, page },
    });
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

export async function updateTicket(id: string, payload: string) {
  const { project, ...auth } = getCredentialsFromEnv();

  try {
    await API.post(`/${project}/tickets/${id}/notes`, {
      auth,
      data: payload,
    });
  } catch (error: any) {
    console.log(error.message);
    spinner.fail("Could not update the ticket");
    process.exit(1);
  }
}
