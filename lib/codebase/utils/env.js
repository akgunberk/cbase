"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.saveCredentialsToEnv = void 0;

var _fs = require("fs");

const saveCredentialsToEnv = answers => {
  try {
    (0, _fs.writeFileSync)(".env", Object.entries(answers).map(answer => answer.join("=")).join("\n"));
  } catch (error) {
    throw new Error("An error occurred while saving your credentials.");
  }
};

exports.saveCredentialsToEnv = saveCredentialsToEnv;