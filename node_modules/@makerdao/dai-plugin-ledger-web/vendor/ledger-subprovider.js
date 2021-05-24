'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _values = require('babel-runtime/core-js/object/values');

var _values2 = _interopRequireDefault(_values);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.setChosenAddress = setChosenAddress;
exports.obtainPathComponentsFromDerivationPath = obtainPathComponentsFromDerivationPath;
exports.default = createLedgerSubprovider;

var _hwAppEth = require('@ledgerhq/hw-app-eth');

var _hwAppEth2 = _interopRequireDefault(_hwAppEth);

var _hookedWallet = require('web3-provider-engine/dist/es5/subproviders/hooked-wallet');

var _hookedWallet2 = _interopRequireDefault(_hookedWallet);

var _ethereumjsTx = require('ethereumjs-tx');

var _ethereumjsTx2 = _interopRequireDefault(_ethereumjsTx);

var _addressGenerator = require('./address-generator');

var _addressGenerator2 = _interopRequireDefault(_addressGenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable */
var allowedHdPaths = ["44'/1'", "44'/60'", "44'/61'"];

var chosenAddress = void 0;

function setChosenAddress(address) {
  chosenAddress = address;
}

function stripHexPrefix(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/^0x/, '');
}

var ledgerLiveRegex = /^(44'\/(?:1|60|61)'\/)(\d+)('?)$/;

function makeError(msg, id) {
  var err = new Error(msg);
  // $FlowFixMe
  err.id = id;
  return err;
}

function obtainPathComponentsFromDerivationPath(derivationPath) {
  // check if derivation path follows 44'/60'/x'/n pattern
  var regExp = /^(44'\/(?:1|60|61)'\/\d+'?\/(?:\d+'?\/)?)(\d+)$/;
  var matchResult = regExp.exec(derivationPath);
  if (matchResult === null) {
    throw makeError('invalid derivation path', 'InvalidDerivationPath');
  }
  return { basePath: matchResult[1], index: parseInt(matchResult[2], 10) };
}

/**
 */


var defaultOptions = {
  networkId: 1, // mainnet
  path: "44'/60'/0'/0",
  askConfirm: false,
  accountsLength: 1,
  accountsOffset: 0
};

/**
 * Create a HookedWalletSubprovider for Ledger devices.
 * @param getTransport gets lazily called each time the device is needed. It is a function that returns a Transport instance. You can typically give `()=>TransportU2F.create()`
 * @example
import Web3 from "web3";
import createLedgerSubprovider from "@ledgerhq/web3-subprovider";
import TransportU2F from "@ledgerhq/hw-transport-u2f";
import ProviderEngine from "web3-provider-engine";
import RpcSubprovider from "web3-provider-engine/subproviders/rpc";
const engine = new ProviderEngine();
const getTransport = () => TransportU2F.create();
const ledger = createLedgerSubprovider(getTransport, {
  accountsLength: 5
});
engine.addProvider(ledger);
engine.addProvider(new RpcSubprovider({ rpcUrl }));
engine.start();
const web3 = new Web3(engine);
 */
function createLedgerSubprovider(getTransport, options) {
  var _getAccounts = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
      var _this = this;

      var transport, eth, addresses, _loop, i, pathComponents, addressGenerator, _path, address;

      return _regenerator2.default.wrap(function _callee$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return getTransport();

            case 2:
              transport = _context2.sent;
              _context2.prev = 3;
              eth = new _hwAppEth2.default(transport);
              addresses = {};

              if (!path.match(ledgerLiveRegex)) {
                _context2.next = 16;
                break;
              }

              _loop = /*#__PURE__*/_regenerator2.default.mark(function _loop(i) {
                var newPath, _ref2, address;

                return _regenerator2.default.wrap(function _loop$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        newPath = path.replace(ledgerLiveRegex, function (_, g1, g2, g3) {
                          return g1 + String(parseInt(g2) + accountsOffset + i) + g3;
                        }) + '/0/0';
                        _context.next = 3;
                        return eth.getAddress(newPath, askConfirm, true);

                      case 3:
                        _ref2 = _context.sent;
                        address = _ref2.address;

                        addresses[newPath] = address;
                        addressToPathMap[address.toLowerCase()] = newPath;

                      case 7:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _loop, _this);
              });
              i = 0;

            case 9:
              if (!(i < accountsLength)) {
                _context2.next = 14;
                break;
              }

              return _context2.delegateYield(_loop(i), 't0', 11);

            case 11:
              i++;
              _context2.next = 9;
              break;

            case 14:
              _context2.next = 25;
              break;

            case 16:
              pathComponents = obtainPathComponentsFromDerivationPath(path);
              _context2.t1 = _addressGenerator2.default;
              _context2.next = 20;
              return eth.getAddress(pathComponents.basePath, askConfirm, true);

            case 20:
              _context2.t2 = _context2.sent;
              _context2.next = 23;
              return new _context2.t1(_context2.t2);

            case 23:
              addressGenerator = _context2.sent;

              for (i = accountsOffset; i < accountsOffset + accountsLength; i++) {
                _path = pathComponents.basePath + (pathComponents.index + i).toString();
                address = addressGenerator.getAddressString(i);

                addresses[_path] = address;
                addressToPathMap[address.toLowerCase()] = _path;
              }

            case 25:
              return _context2.abrupt('return', addresses);

            case 26:
              _context2.prev = 26;

              transport.close();
              return _context2.finish(26);

            case 29:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee, this, [[3,, 26, 29]]);
    }));

    return function _getAccounts() {
      return _ref.apply(this, arguments);
    };
  }();

  var _signPersonalMessage = function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(msgData) {
      var path, transport, eth, result, v, vHex;
      return _regenerator2.default.wrap(function _callee2$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (chosenAddress) {
                msgData.from = chosenAddress;
              }
              path = addressToPathMap[msgData.from.toLowerCase()];

              if (path) {
                _context3.next = 4;
                break;
              }

              throw new Error('address unknown \'' + msgData.from + '\'');

            case 4:
              _context3.next = 6;
              return getTransport();

            case 6:
              transport = _context3.sent;
              _context3.prev = 7;
              eth = new _hwAppEth2.default(transport);
              _context3.next = 11;
              return eth.signPersonalMessage(path, stripHexPrefix(msgData.data));

            case 11:
              result = _context3.sent;
              v = parseInt(result.v, 10) - 27;
              vHex = v.toString(16);

              if (vHex.length < 2) {
                vHex = '0' + v;
              }
              return _context3.abrupt('return', '0x' + result.r + result.s + vHex);

            case 16:
              _context3.prev = 16;

              transport.close();
              return _context3.finish(16);

            case 19:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee2, this, [[7,, 16, 19]]);
    }));

    return function _signPersonalMessage(_x) {
      return _ref3.apply(this, arguments);
    };
  }();

  var _signTransaction = function () {
    var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(txData) {
      var path, transport, eth, tx, result, signedChainId, validChainId;
      return _regenerator2.default.wrap(function _callee3$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              if (chosenAddress) {
                txData.from = chosenAddress;
              }
              path = addressToPathMap[txData.from.toLowerCase()];

              if (path) {
                _context4.next = 4;
                break;
              }

              throw new Error('address unknown \'' + txData.from + '\'');

            case 4:
              _context4.next = 6;
              return getTransport();

            case 6:
              transport = _context4.sent;
              _context4.prev = 7;
              eth = new _hwAppEth2.default(transport);
              tx = new _ethereumjsTx2.default(txData);

              // Set the EIP155 bits

              tx.raw[6] = Buffer.from([networkId]); // v
              tx.raw[7] = Buffer.from([]); // r
              tx.raw[8] = Buffer.from([]); // s

              // Pass hex-rlp to ledger for signing
              _context4.next = 15;
              return eth.signTransaction(path, tx.serialize().toString('hex'));

            case 15:
              result = _context4.sent;


              // Store signature in transaction
              tx.v = Buffer.from(result.v, 'hex');
              tx.r = Buffer.from(result.r, 'hex');
              tx.s = Buffer.from(result.s, 'hex');

              // EIP155: v should be chain_id * 2 + {35, 36}
              signedChainId = Math.floor((tx.v[0] - 35) / 2);
              validChainId = networkId & 0xff; // FIXME this is to fixed a current workaround that app don't support > 0xff

              if (!(signedChainId !== validChainId)) {
                _context4.next = 23;
                break;
              }

              throw makeError('Invalid networkId signature returned. Expected: ' + networkId + ', Got: ' + signedChainId, 'InvalidNetworkId');

            case 23:
              return _context4.abrupt('return', '0x' + tx.serialize().toString('hex'));

            case 24:
              _context4.prev = 24;

              transport.close();
              return _context4.finish(24);

            case 27:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee3, this, [[7,, 24, 27]]);
    }));

    return function _signTransaction(_x2) {
      return _ref4.apply(this, arguments);
    };
  }();

  var _defaultOptions$optio = (0, _extends3.default)({}, defaultOptions, options),
      networkId = _defaultOptions$optio.networkId,
      path = _defaultOptions$optio.path,
      askConfirm = _defaultOptions$optio.askConfirm,
      accountsLength = _defaultOptions$optio.accountsLength,
      accountsOffset = _defaultOptions$optio.accountsOffset;

  if (!allowedHdPaths.some(function (hdPref) {
    return path.startsWith(hdPref);
  })) {
    throw makeError('Ledger derivation path allowed are ' + allowedHdPaths.join(', ') + '. ' + path + ' is not supported', 'InvalidDerivationPath');
  }

  var addressToPathMap = {};

  if (options.promisify) {
    return new _hookedWallet2.default({
      getAccounts: _getAccounts,
      signPersonalMessage: _signPersonalMessage,
      signTransaction: _signTransaction
    });
  }

  return new _hookedWallet2.default({
    getAccounts: function getAccounts(callback) {
      return _getAccounts().then(function (res) {
        return callback(null, (0, _values2.default)(res));
      }).catch(function (err) {
        return callback(err, null);
      });
    },
    signPersonalMessage: function signPersonalMessage(txData, callback) {
      return _signPersonalMessage(txData).then(function (res) {
        return callback(null, res);
      }).catch(function (err) {
        return callback(err, null);
      });
    },
    signTransaction: function signTransaction(txData, callback) {
      _signTransaction(txData).then(function (res) {
        return callback(null, res);
      }).catch(function (err) {
        return callback(err, null);
      });
    }
  });
}