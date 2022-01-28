"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.saveCredentialsToEnv = void 0;

var _fs = require("fs");

var _ = require(".");

const saveCredentialsToEnv = answers => {
  try {
    (0, _fs.writeFileSync)(".env", Object.entries(answers).map(answer => answer.join("=")).join("\n"));
  } catch (error) {
    _.spinner.fail("An error occurred while saving your credentials.");

    process.exit(1);
  }
};

exports.saveCredentialsToEnv = saveCredentialsToEnv;