"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getProfile = getProfile;

var _axios = _interopRequireDefault(require("axios"));

var _utils = require("../../lib/utils");

var _constants = require("./constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function getProfile() {
  try {
    const {
      data
    } = await _axios.default.get("/profile", { ..._constants.API_OPTIONS,
      auth: {
        username: process.env.username || "",
        password: process.env.password || ""
      }
    });
    return data.user;
  } catch (error) {
    if (error.status === 401) _utils.spinner.fail("Check your credentials.");else _utils.spinner.fail("An error occurred getting your profile.");
    process.exit(1);
  }
}