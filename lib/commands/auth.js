"use strict";

var _chalk = _interopRequireDefault(require("chalk"));

var _commander = require("commander");

var _hooks = require("../hooks");

var _prompts = require("../prompts");

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const program = new _commander.Command();
program.command("login").description("login your codebase account with api credentials").action(_prompts.PROMPTS.LOGIN).hook("postAction", _hooks.postAuth).addHelpText("after", _chalk.default.redBright("You can find your api credentials on codebasehq.com/settings/profile \n"));
program.command("logout").description("logout your current user").action(_utils.DB.logout);
program.parseAsync(process.argv);