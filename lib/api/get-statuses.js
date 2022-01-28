"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStatuses = getStatuses;

var _api = require("../../lib/api");

var _utils = require("../../lib/utils");

async function getStatuses() {
  try {
    const user = await _utils.DB.getActiveUser();
    const res = await _api.CodebaseAPI.getInstance().get(`/${user.project.name}/tickets/statuses`);
    return (0, _utils.makeArray)(res.data["ticketing-statuses"]["ticketing-status"]);
  } catch (error) {
    _utils.spinner.fail("An error occurred getting your profile.");
  }
}