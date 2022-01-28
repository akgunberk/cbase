"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.table = table;

var _cliTable = _interopRequireDefault(require("cli-table"));

var _chalk = _interopRequireDefault(require("chalk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function table(input, colWidths) {
  const width = process.stdout.columns;
  const column = Math.floor(width / 16);
  const headers = Object.keys(input[0]);
  const table = new _cliTable.default({
    head: headers.map(_chalk.default.bold.whiteBright),
    colWidths: colWidths ? colWidths : Array(headers.length).fill(column / headers.length)
  });
  console.log(Object.keys(input[0]));
  input.forEach(row => table.push(Object.values(row)));
  console.log(table.toString());
}