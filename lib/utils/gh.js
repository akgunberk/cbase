"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkAliasExist = checkAliasExist;

var _child_process = require("child_process");

function checkAliasExist(alias) {
  return !!(0, _child_process.execSync)(`gh alias list | grep ${alias}`).toString();
}