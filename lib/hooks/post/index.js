"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _postAuth = require("../post-auth");

Object.keys(_postAuth).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _postAuth[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _postAuth[key];
    }
  });
});