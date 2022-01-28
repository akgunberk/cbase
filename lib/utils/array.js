"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeArray = makeArray;

/**
 * xml-to-json parser may return the object directly for singular xml tags
 *
 * it return an array of objects for multiple tags
 */
function makeArray(input) {
  if (Array.isArray(input)) return input;
  return [input];
}