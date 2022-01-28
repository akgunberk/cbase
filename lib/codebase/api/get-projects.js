"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getProjects = getProjects;

var _ = require(".");

var _utils = require("../../utils");

async function getProjects() {
  try {
    const res = await _.CodebaseAPI.getInstance().get(`/projects`);
    return (0, _utils.makeArray)(res.data.projects.project);
  } catch (error) {
    throw new Error("An error occurred getting projects that you involved.");
  }
}