"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTickets = getTickets;

var _api = require("../../lib/api");

var _utils = require("../../lib/utils");

async function getTickets(query) {
  try {
    const user = await _utils.DB.getActiveUser();
    const res = await _api.CodebaseAPI.getInstance().get(`/${user.project.name}/tickets?query=${query}`);
    return (0, _utils.makeArray)(res.data["tickets"]["ticket"]);
  } catch (error) {
    var _error$response;

    if ((error === null || error === void 0 ? void 0 : (_error$response = error.response) === null || _error$response === void 0 ? void 0 : _error$response.status) === 404) {
      _utils.spinner.info("There is no ticket matching your query.");

      process.exit(0);
    } else {
      _utils.spinner.fail("An error occurred querying your tickets.");

      process.exit(1);
    }
  }
}