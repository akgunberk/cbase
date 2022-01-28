"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.postAuth = postAuth;

var _chalk = _interopRequireDefault(require("chalk"));

var _utils = require("../../lib/utils");

var _prompts = require("../../lib/prompts");

var _api = require("../../lib/api");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function postAuth() {
  _utils.spinner.start("Connecting to Codebase...");

  let user;
  const isUserAuth = await _utils.DB.getActiveUser();

  if (isUserAuth) {
    _utils.spinner.fail(["You already connected to codebase.", "If you want to switch user change your credentials", "See logout: gh codebase logout"].join("\n"));

    process.exit(0);
  } else {
    user = await (0, _api.getProfile)();

    _utils.spinner.stop();
  }

  const xmlProjects = await (0, _api.getProjects)();
  const projects = xmlProjects.map(project => project.name.text);
  await _utils.DB.saveAllProjects(projects);
  const {
    selectedProject
  } = await _prompts.PROMPTS.SELECT_PROJECT(projects);
  await _utils.DB.setUser({
    username: user.username.text,
    selectedProject
  });

  _utils.spinner.start("Getting project details...");

  const getProjectDetails = [(0, _api.getTicketTypes)(), (0, _api.getStatuses)(), (0, _api.getCategories)(), (0, _api.getPriorities)()];
  await Promise.all(getProjectDetails).then(_utils.DB.setProjectDetails);

  _utils.spinner.succeed(`Connected to ${selectedProject} as ${_chalk.default.blueBright(user.username.text)}`);

  await _prompts.PROMPTS.ALIAS();
}