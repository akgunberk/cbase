"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCategories = getCategories;

var _ = require(".");

var _utils = require("../../utils");

async function getCategories() {
  try {
    const user = await _utils.DB.getActiveUser();
    const res = await _.CodebaseAPI.getInstance().get(`/${user.project.name}/tickets/categories`);
    return (0, _utils.makeArray)(res.data["ticketing-categories"]["ticketing-category"]);
  } catch (error) {
    throw new Error("An error occurred getting categories of your project.");
  }
}