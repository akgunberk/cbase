import "dotenv/config";
import axios from "axios";
import { API_OPTIONS } from "./constants";

import { getCredentialsFromEnv, spinner, makeArray, pickXmlContent } from "./utils";

export type Auth = { username: string; password: string };

export type GetIinitialProjectDetailsParams = { project: string } & Auth;

const API = axios.create({
  ...API_OPTIONS,
});

export async function getProfile(auth: Auth) {
  try {
    const { data } = await API.get("/profile", { auth });
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

export type TicketType = { id: string; name: string; icon: string; projectName: string };
export async function getTicketTypes({ project, ...auth }: GetIinitialProjectDetailsParams) {
  try {
    const ticketTypes: TicketType[] = [];
    const res = await API.get(`/${project}/tickets/types`, { auth });
    for (const xmlType of makeArray(res.data["ticketing-types"]["ticketing-type"])) {
      ticketTypes.push({ ...pickXmlContent(xmlType, ["id", "name", "icon"]), projectName: project } as TicketType);
    }
    return ticketTypes;
  } catch (error: any) {
    spinner.fail("An error occurred getting ticket types of your project.");
  }
}

export type StatusType = { id: string; name: string; colour: string; treatAsClosed: string; projectName: string };
export async function getStatuses({ project, ...auth }: GetIinitialProjectDetailsParams) {
  try {
    const ticketStatuses: StatusType[] = [];
    const res = await API.get(`/${project}/tickets/statuses`, { auth });

    for (const xmlStatus of makeArray(res.data["ticketing-statuses"]["ticketing-status"])) {
      ticketStatuses.push({
        ...pickXmlContent(xmlStatus, ["id", "name", "colour", "treat-as-closed"]),
        projectName: project,
      } as StatusType);
    }
    return ticketStatuses;
  } catch (error: any) {
    spinner.fail("An error occurred getting your profile.");
  }
}

export type PriorityType = { id: string; name: string; colour: string; projectName: string };
export async function getPriorities({ project, ...auth }: GetIinitialProjectDetailsParams) {
  try {
    const ticketPriorities: PriorityType[] = [];
    const res = await API.get(`/${project}/tickets/priorities`, { auth });
    for (const xmlPriority of makeArray(res.data["ticketing-priorities"]["ticketing-priority"])) {
      ticketPriorities.push({
        ...pickXmlContent(xmlPriority, ["id", "name", "colour"]),
        projectName: project,
      } as PriorityType);
    }
    return ticketPriorities;
  } catch (error: any) {
    spinner.fail("An error occurred getting priorities of your project.");
  }
}

export type CategoryType = { id: string; name: string; projectName: string };
export async function getCategories({ project, ...auth }: GetIinitialProjectDetailsParams) {
  try {
    const ticketCategories: CategoryType[] = [];
    const res = await API.get(`/${project}/tickets/categories`, { auth });
    for (const xmlCategory of makeArray(res.data["ticketing-categories"]["ticketing-category"])) {
      ticketCategories.push({
        ...pickXmlContent(xmlCategory, ["id", "name"]),
        projectName: project,
      } as StatusType);
    }
    return ticketCategories;
  } catch (error: any) {
    spinner.fail("An error occurred getting categories of your project.");
  }
}

export type UserType = { id: string; username: string; firstname: string; lastname: string };
export async function getUsers({ project, ...auth }: GetIinitialProjectDetailsParams) {
  try {
    const projectUsers: UserType[] = [];
    const res = await API.get(`/${project}/assignments`, { auth });

    for (const xmlUser of makeArray(res.data["users"]["user"])) {
      projectUsers.push(pickXmlContent(xmlUser, ["id", "username", "first-name", "last-name"]) as UserType);
    }
    return projectUsers;
  } catch (error: any) {
    spinner.fail("An error occurred getting assignees of your project.");
  }
}

export type TicketUpdates = { content: string; updatedAt: string; userId: string; updates: string };
export async function getTicketUpdates(id: string) {
  const { project, ...auth } = getCredentialsFromEnv();
  try {
    const ticketUpdates: TicketUpdates[] = [];
    const res = await API.get(`/${project}/tickets/${id}/notes`, { auth });

    for (const xmlUpdate of makeArray(res.data["ticket-notes"]["ticket-note"])) {
      const { updates: jsonStringUpdates, ...rest } = pickXmlContent(xmlUpdate, [
        "content",
        "updated-at",
        "user-id",
        "updates",
      ]) as TicketUpdates;

      ticketUpdates.push({ ...rest, updates: JSON.parse(jsonStringUpdates) });
    }
    return ticketUpdates;
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
    await API.post(
      `/${project}/tickets/${id}/notes`,
      {
        data: payload,
      },
      { auth }
    );
  } catch (error: any) {
    spinner.fail("Could not update the ticket");
    process.exit(1);
  }
}
