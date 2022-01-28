"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTicketTypes = getTicketTypes;

var _ = require(".");

var _utils = require("../../utils");

async function getTicketTypes() {
  try {
    const user = await _utils.DB.getActiveUser();
    const res = await _.CodebaseAPI.getInstance().get(`/${user.project.name}/tickets/types`);
    return (0, _utils.makeArray)(res.data["ticketing-types"]["ticketing-type"]);
  } catch (error) {
    throw new Error("An error occurred getting ticket types of your project.");
  }
}