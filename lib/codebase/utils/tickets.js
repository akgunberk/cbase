"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.geTicketStatuses = geTicketStatuses;
exports.getTickets = getTickets;

var _api = require("../api");

var _array = require("./array");

async function geTicketStatuses() {
  let status;

  try {
    const result = await _api.CodebaseAPI.getInstance().get(`/${process.env.project}/tickets/statuses`);
    status = result.data;
  } catch (error) {
    throw error;
  }

  return status;
}

async function getTickets(query) {
  const response = await _api.CodebaseAPI.getInstance().get( ///project/tickets?query=query
  `/${process.env.selected_project}/tickets?query=${query}`);
  return (0, _array.makeArray)(response.data.tickets.ticket);
}