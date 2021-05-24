"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = callGanache;

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var ganacheAddress = 'http://localhost:2000';
var requestCount = 0;

function callGanache(method) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return (0, _nodeFetch["default"])(ganacheAddress, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: method,
      params: params,
      id: requestCount++
    })
  });
}