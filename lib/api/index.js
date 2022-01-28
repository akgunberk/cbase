"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _api = require("./api");

Object.keys(_api).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _api[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _api[key];
    }
  });
});

var _getCategories = require("./get-categories");

Object.keys(_getCategories).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _getCategories[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _getCategories[key];
    }
  });
});

var _getPriorities = require("./get-priorities");

Object.keys(_getPriorities).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _getPriorities[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _getPriorities[key];
    }
  });
});

var _getProfile = require("./get-profile");

Object.keys(_getProfile).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _getProfile[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _getProfile[key];
    }
  });
});

var _getProjects = require("./get-projects");

Object.keys(_getProjects).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _getProjects[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _getProjects[key];
    }
  });
});

var _getStatuses = require("./get-statuses");

Object.keys(_getStatuses).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _getStatuses[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _getStatuses[key];
    }
  });
});

var _getTickets = require("./get-tickets");

Object.keys(_getTickets).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _getTickets[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _getTickets[key];
    }
  });
});

var _getTicketTypes = require("./get-ticket-types");

Object.keys(_getTicketTypes).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _getTicketTypes[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _getTicketTypes[key];
    }
  });
});