"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCategories = getCategories;

var _api = require("../../lib/api");

var _utils = require("../../lib/utils");

async function getCategories() {
  try {
    const user = await _utils.DB.getActiveUser();
    const res = await _api.CodebaseAPI.getInstance().get(`/${user.project.name}/tickets/categories`);
    return (0, _utils.makeArray)(res.data["ticketing-categories"]["ticketing-category"]);
  } catch (error) {
    _utils.spinner.fail("An error occurred getting categories of your project.");
  }
}