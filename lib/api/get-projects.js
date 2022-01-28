"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getProjects = getProjects;

var _api = require("../../lib/api");

var _utils = require("../../lib/utils");

async function getProjects() {
  try {
    const res = await _api.CodebaseAPI.getInstance().get(`/projects`);
    return (0, _utils.makeArray)(res.data.projects.project);
  } catch (error) {
    _utils.spinner.fail("An error occurred getting projects that you involved.");

    process.exit(1);
  }
}