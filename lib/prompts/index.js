"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PROMPTS = void 0;

var _child_process = require("child_process");

var _chalk = _interopRequireDefault(require("chalk"));

var _inquirer = _interopRequireDefault(require("inquirer"));

var _utils = require("../../lib/utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const prompt = _inquirer.default.prompt;
const PROMPTS = {
  ALIAS: async () => {
    await prompt([{
      type: "confirm",
      name: "addAlias",
      message: `Add 'cb' alias (${_chalk.default.redBright("may overwrite existing gh aliases")})`,
      default: true,

      when() {
        return !(0, _utils.checkAliasExist)("cb");
      }

    }]).then(({
      addAlias
    }) => {
      if (addAlias) {
        (0, _child_process.execSync)("gh alias set cb 'codebase'");

        _utils.spinner.succeed("Alias 'cb' for codebase is added.");
      }
    });
  },
  LOGIN: async () => {
    await prompt([{
      type: "input",
      name: "username",
      message: "API Username:"
    }, {
      type: "input",
      name: "password",
      message: "API Key:"
    }]).then(_utils.saveCredentialsToEnv);
  },
  SELECT_PROJECT: choices => prompt([{
    type: "list",
    name: "selectedProject",
    message: "Select the project you want to work with:",
    choices
  }]),
  CUSTOM_QUERY: async options => {
    if (options.list) {
      const savedQueries = await _utils.DB.getAllQueries();
      if (savedQueries.length) console.table(savedQueries.map(query => {
        const {
          id,
          userId,
          ...rest
        } = query;
        return rest;
      }));else _utils.spinner.info("There is no saved queries.");
    }

    await prompt([{
      type: "input",
      name: "name",
      message: "provide a name for your query: ",
      validate: async function (queryName) {
        const queryExists = await _utils.DB.getSavedQuery(queryName);

        if (options.overwrite && queryExists) {
          console.error("query already exist. try -o, --overwrite option if you want to overwrite");
        }

        return true;
      }
    }, {
      type: "input",
      name: "query",
      message: "provide a comma-seperated query (i.e assignee:janedoe,sorted:status)"
    }]).then(_utils.DB.upsertQuery);
  }
};
exports.PROMPTS = PROMPTS;