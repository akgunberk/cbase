"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CodebaseAPI = void 0;

require("dotenv/config");

var _axios = _interopRequireDefault(require("axios"));

var _constants = require("./constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const CodebaseAPI = {
  _api: undefined,
  initInstance: async function () {
    this._api = _axios.default.create(_constants.API_OPTIONS);
  },
  getInstance: function () {
    if (!this._api) this.initInstance();
    return this._api;
  }
};
exports.CodebaseAPI = CodebaseAPI;