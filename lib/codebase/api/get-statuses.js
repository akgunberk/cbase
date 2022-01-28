"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStatuses = getStatuses;

var _ = require(".");

var _utils = require("../../utils");

async function getStatuses() {
  try {
    const user = await _utils.DB.getActiveUser();
    const res = await _.CodebaseAPI.getInstance().get(`/${user.project.name}/tickets/statuses`);
    return (0, _utils.makeArray)(res.data["ticketing-statuses"]["ticketing-status"]);
  } catch (error) {
    throw new Error("An error occurred getting your profile.");
  }
}