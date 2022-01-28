"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTicketTypes = getTicketTypes;

var _api = require("../../lib/api");

var _utils = require("../../lib/utils");

async function getTicketTypes() {
  try {
    const user = await _utils.DB.getActiveUser();
    const res = await _api.CodebaseAPI.getInstance().get(`/${user.project.name}/tickets/types`);
    return (0, _utils.makeArray)(res.data["ticketing-types"]["ticketing-type"]);
  } catch (error) {
    _utils.spinner.fail("An error occurred getting ticket types of your project.");
  }
}