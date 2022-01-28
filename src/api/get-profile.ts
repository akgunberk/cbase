import axios from "axios";
import { spinner } from "@utils";

import { API_OPTIONS } from "./constants";

async function getProfile() {
  try {
    const { data } = await axios.get("/profile", {
      ...API_OPTIONS,
      auth: {
        username: process.env.username || "",
        password: process.env.password || "",
      },
    });
    return data.user;
  } catch (error: any) {
    if (error.status === 401) spinner.fail("Check your credentials.");
    else spinner.fail("An error occurred getting your profile.");
    process.exit(1);
  }
}

export { getProfile };
