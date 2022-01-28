"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pickXmlContent = pickXmlContent;

function pickXmlContent(obj, keys) {
  const pickedObject = {};

  for (const key of keys) {
    if (key in obj) pickedObject[kebabToCamelCase(key)] = obj[key].text;
  }

  return pickedObject;
}

function kebabToCamelCase(word) {
  return word.split("-").map((word, index) => index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)).join("");
}