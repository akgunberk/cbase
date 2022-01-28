"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.program = void 0;

var _package = _interopRequireDefault(require("../../package.json"));

var _commander = _interopRequireDefault(require("commander"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const program = new _commander.default.Command();
exports.program = program;
program.name("gh").usage("codebase <command>").helpOption("-h, --help", "Output usage information.").version(_package.default.version, "-v, --version", "Output the current version.");