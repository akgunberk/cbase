"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.postAuth = postAuth;

var _chalk = _interopRequireDefault(require("chalk"));

var _ora = _interopRequireDefault(require("ora"));

var _getProfile = require("../../codebase/api/get-profile");

var _getProjects = require("../../codebase/api/get-projects");

var _utils = require("../../codebase/utils");

var _prompts = require("../../prompts");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const spinner = (0, _ora.default)();

async function postAuth() {
  spinner.start("Connecting to Codebase...");
  const user = await (0, _getProfile.getProfile)();
  const isUserAuth = await _utils.DB.getActiveUser();

  if (isUserAuth) {
    spinner.fail("You already connected to codebase.\nIf you want to switch user change your credentials");
    process.exit(0);
  }

  const projects = await (0, _getProjects.getProjects)();
  spinner.stop();
  const {
    selectedProject
  } = await _prompts.PROMPTS.SELECT_PROJECT(projects.map(project => project.name.text));
  await _utils.DB.setUser({
    username: user.username.text,
    selectedProject
  });

  const username = _chalk.default.blueBright(user.username.text);

  spinner.succeed(`Connected to codebase as ${username}`);
}