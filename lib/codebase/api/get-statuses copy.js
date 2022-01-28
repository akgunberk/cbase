"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStatuses = getStatuses;

var _ = require(".");

var _utils = require("../utils");

async function getStatuses() {
  try {
    const user = await _utils.DB.getActiveUser();
    await _.CodebaseAPI.getInstance().get(`/${user.selectedProject}/tickets/statuses`);
  } catch (error) {
    if (error.status === 401) throw new Error("Check your credentials.");else throw new Error("An error occurred getting your profile.");
  }
}