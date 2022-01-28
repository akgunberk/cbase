"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPriorities = getPriorities;

var _ = require(".");

var _utils = require("../../utils");

async function getPriorities() {
  try {
    const user = await _utils.DB.getActiveUser();
    const res = await _.CodebaseAPI.getInstance().get(`/${user.project.name}/tickets/priorities`);
    return res.data;
  } catch (error) {
    throw new Error("An error occurred getting priorities of your project.");
  }
}