"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.spinner = void 0;

var _ora = _interopRequireDefault(require("ora"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const spinner = (0, _ora.default)();
exports.spinner = spinner;