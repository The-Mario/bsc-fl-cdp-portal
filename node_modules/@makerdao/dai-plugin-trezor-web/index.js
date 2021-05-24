'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

exports.default = function (maker) {
  var _this = this;

  maker.service('accounts', true).addAccountType('trezor', function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(settings) {
      var subprovider, address, addresses;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              subprovider = (0, _trezorSubprovider2.default)({
                // options: networkId, path, accountsLength, accountsOffset
                accountsOffset: settings.accountsOffset || 0,
                accountsLength: settings.accountsLength || 1,
                networkId: maker.service('web3').networkId(),
                path: settings.path || defaultDerivationPath
              });
              address = void 0;

              if (!(settings.accountsLength && settings.accountsLength > 1)) {
                _context.next = 14;
                break;
              }

              if (settings.choose) {
                _context.next = 5;
                break;
              }

              throw new Error('If accountsLength > 1, "choose" must be defined in account options.');

            case 5:
              _context.next = 7;
              return new _promise2.default(function (resolve, reject) {
                return subprovider.getAccounts(function (err, addresses) {
                  return err ? reject(err) : resolve(addresses);
                });
              });

            case 7:
              addresses = _context.sent;
              _context.next = 10;
              return new _promise2.default(function (resolve, reject) {
                var callback = function callback(err, address) {
                  return err ? reject(err) : resolve(address);
                };

                // this chooser function allows the app using the plugin to display the
                // list of addresses to a human user and let them make a choice.
                settings.choose((0, _keys2.default)(addresses).map(function (k) {
                  return addresses[k];
                }), callback);
              });

            case 10:
              address = _context.sent;

              (0, _trezorSubprovider.setChosenAddress)(address);
              _context.next = 17;
              break;

            case 14:
              _context.next = 16;
              return new _promise2.default(function (resolve, reject) {
                return subprovider.getAccounts(function (err, addresses) {
                  return err ? reject(err) : resolve(addresses[0]);
                });
              });

            case 16:
              address = _context.sent;

            case 17:
              return _context.abrupt('return', { subprovider: subprovider, address: address });

            case 18:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
};

var _trezorSubprovider = require('./vendor/trezor-subprovider');

var _trezorSubprovider2 = _interopRequireDefault(_trezorSubprovider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultDerivationPath = "44'/60'/0'/0/0";