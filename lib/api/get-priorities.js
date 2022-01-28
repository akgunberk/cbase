"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPriorities = getPriorities;

var _api = require("../../lib/api");

var _utils = require("../../lib/utils");

async function getPriorities() {
  try {
    const user = await _utils.DB.getActiveUser();
    const res = await _api.CodebaseAPI.getInstance().get(`/${user.project.name}/tickets/priorities`);
    return (0, _utils.makeArray)(res.data["ticketing-priorities"]["ticketing-priority"]);
  } catch (error) {
    _utils.spinner.fail("An error occurred getting priorities of your project.");
  }
}