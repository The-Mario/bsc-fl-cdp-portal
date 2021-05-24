"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _TestAccountProvider = _interopRequireWildcard(require("./TestAccountProvider"));

test('should reject illegal indices', function () {
  var msg = 'Index must be a natural number between 0 and ' + (_TestAccountProvider["default"]._accounts.addresses.length - 1);
  expect(function () {
    return _TestAccountProvider["default"].setIndex(-1);
  }).toThrow(msg);
  expect(function () {
    return _TestAccountProvider["default"].setIndex(_TestAccountProvider["default"]._accounts.length);
  }).toThrow(msg);
  expect(function () {
    return _TestAccountProvider["default"].setIndex('Not a number');
  }).toThrow(msg);
});
test('should reject accounts objects', function () {
  expect(function () {
    return new _TestAccountProvider.TestAccountProvider({
      addresses: ['x'],
      keeys: ['y']
    });
  }).toThrow('Accounts must be an object with properties addresses and keys');
  expect(function () {
    return new _TestAccountProvider.TestAccountProvider({
      addresses: ['x', 'y', 'z'],
      keys: ['x', 'y']
    });
  }).toThrow('Accounts addresses and keys arrays must have the same length');
});
test('test provider provides 1000 addresses and keys', function () {
  var originalIndex = _TestAccountProvider["default"].getIndex();

  var error = -1;

  _TestAccountProvider["default"].setIndex(0);

  for (var i = 0; i < 500; i++) {
    var account = _TestAccountProvider["default"].nextAccount();

    if (typeof account.address !== 'string' || typeof account.key !== 'string') {
      error = i;
    }
  }

  for (var _i = 0; _i < 500; _i++) {
    var address = _TestAccountProvider["default"].nextAddress();

    if (typeof address !== 'string') {
      error = _i;
    }
  }

  expect(error).toBe(-1);
  expect(function () {
    return _TestAccountProvider["default"].nextAccount();
  }).toThrow('No more test accounts available.');

  _TestAccountProvider["default"].setIndex(originalIndex);

  expect(_TestAccountProvider["default"].getIndex()).toBe(originalIndex);
});