'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _values = require('babel-runtime/core-js/object/values');

var _values2 = _interopRequireDefault(_values);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.setChosenAddress = setChosenAddress;
exports.default = createTrezorSubprovider;

var _hookedWallet = require('web3-provider-engine/dist/es5/subproviders/hooked-wallet');

var _hookedWallet2 = _interopRequireDefault(_hookedWallet);

var _ethereumjsTx = require('ethereumjs-tx');

var _ethereumjsTx2 = _interopRequireDefault(_ethereumjsTx);

var _trezorConnect = require('trezor-connect');

var _trezorConnect2 = _interopRequireDefault(_trezorConnect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var allowedHdPaths = ["44'/1'", "44'/60'", "44'/61'"];


var chosenAddress = void 0;

function setChosenAddress(address) {
  chosenAddress = address;
}

function makeError(msg, id) {
  var err = new Error(msg);
  // $FlowFixMe
  err.id = id;
  return err;
}

function obtainPathComponentsFromDerivationPath(derivationPath) {
  // check if derivation path follows 44'/60'/x'/n pattern
  var regExp = /^(44'\/(?:1|60|61)'\/\d+'\/\d+?\/)(\d+)$/;
  var matchResult = regExp.exec(derivationPath);
  if (matchResult === null) {
    throw makeError("To get multiple accounts your derivation path must follow pattern 44'/60|61'/x'/n ", 'InvalidDerivationPath');
  }
  return { basePath: matchResult[1], index: parseInt(matchResult[2], 10) };
}

var defaultOptions = {
  networkId: 1, // mainnet
  path: "44'/60'/0'/0/0", // trezor default derivation path
  accountsLength: 1,
  accountsOffset: 0
};

/**
 * Create a HookedWalletSubprovider for Trezor devices.
 */
function createTrezorSubprovider(options) {
  var _getAccounts = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
      var addresses, accountsBundle, i, _path, addressData, addressDataArray, _i, _path2, address;

      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;

              if (alreadyOpenTrezorModal) {
                _context.next = 16;
                break;
              }

              alreadyOpenTrezorModal = true;
              addresses = {};
              accountsBundle = [];

              for (i = accountsOffset; i < accountsOffset + accountsLength; i++) {
                _path = pathComponents.basePath + (pathComponents.index + i).toString();

                accountsBundle.push({ path: 'm/' + _path, showOnTrezor: false });
              }
              _context.next = 8;
              return _trezorConnect2.default.ethereumGetAddress({
                bundle: accountsBundle
              });

            case 8:
              addressData = _context.sent;

              if (addressData.success) {
                _context.next = 11;
                break;
              }

              throw makeError(addressData.payload.error);

            case 11:
              addressDataArray = addressData.payload;

              for (_i = 0; _i < addressDataArray.length; _i++) {
                _path2 = addressDataArray[_i].serializedPath;
                address = addressDataArray[_i].address;

                addresses[_path2] = address;
                addressToPathMap[address.toLowerCase()] = _path2;
              }
              return _context.abrupt('return', addresses);

            case 16:
              return _context.abrupt('return', (0, _keys2.default)(addressToPathMap).reduce(function (obj, key) {
                obj[addressToPathMap[key]] = key;
                return obj;
              }, {}));

            case 17:
              _context.next = 22;
              break;

            case 19:
              _context.prev = 19;
              _context.t0 = _context['catch'](0);
              throw makeError(_context.t0);

            case 22:
              _context.prev = 22;
              return _context.finish(22);

            case 24:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this, [[0, 19, 22, 24]]);
    }));

    return function _getAccounts() {
      return _ref.apply(this, arguments);
    };
  }();

  var _signPersonalMessage = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(msgData) {
      var path, result;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (chosenAddress) {
                msgData.from = chosenAddress;
              }
              path = addressToPathMap[msgData.from.toLowerCase()];

              if (path) {
                _context2.next = 4;
                break;
              }

              throw new Error('address unknown \'' + msgData.from + '\'');

            case 4:
              _context2.prev = 4;
              _context2.next = 7;
              return trezorSignMessage(path, msgData.data);

            case 7:
              result = _context2.sent;

              if (result.success) {
                _context2.next = 10;
                break;
              }

              throw makeError(result.payload.error);

            case 10:
              return _context2.abrupt('return', '0x' + result.payload.signature);

            case 13:
              _context2.prev = 13;
              _context2.t0 = _context2['catch'](4);
              throw makeError(_context2.t0);

            case 16:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this, [[4, 13]]);
    }));

    return function _signPersonalMessage(_x) {
      return _ref2.apply(this, arguments);
    };
  }();

  var _signTransaction = function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(txData) {
      var path, tx, resultObj, result, signedChainId, validChainId;
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (chosenAddress) {
                txData.from = chosenAddress;
              }
              path = addressToPathMap[txData.from.toLowerCase()];

              if (path) {
                _context3.next = 4;
                break;
              }

              throw new Error('address unknown \'' + txData.from + '\'');

            case 4:
              _context3.prev = 4;
              tx = new _ethereumjsTx2.default(txData);
              _context3.next = 8;
              return trezorSignTransaction(path, txData);

            case 8:
              resultObj = _context3.sent;

              if (resultObj.success) {
                _context3.next = 11;
                break;
              }

              throw makeError(resultObj.payload.error);

            case 11:
              result = resultObj.payload;

              tx.v = result.v;
              tx.r = result.r;
              tx.s = result.s;
              // EIP155: v should be chain_id * 2 + {35, 36}
              signedChainId = Math.floor((tx.v[0] - 35) / 2);
              validChainId = networkId & 0xff; // FIXME this is to fixed a current workaround that app don't support > 0xff

              if (!(signedChainId !== validChainId)) {
                _context3.next = 19;
                break;
              }

              throw makeError('Invalid networkId signature returned. Expected: ' + networkId + ', Got: ' + signedChainId, 'InvalidNetworkId');

            case 19:
              return _context3.abrupt('return', '0x' + tx.serialize().toString('hex'));

            case 22:
              _context3.prev = 22;
              _context3.t0 = _context3['catch'](4);
              throw makeError(_context3.t0);

            case 25:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this, [[4, 22]]);
    }));

    return function _signTransaction(_x2) {
      return _ref3.apply(this, arguments);
    };
  }();

  var _defaultOptions$optio = (0, _extends3.default)({}, defaultOptions, options),
      networkId = _defaultOptions$optio.networkId,
      path = _defaultOptions$optio.path,
      accountsLength = _defaultOptions$optio.accountsLength,
      accountsOffset = _defaultOptions$optio.accountsOffset;

  if (!allowedHdPaths.some(function (hdPref) {
    return path.startsWith(hdPref);
  })) {
    throw makeError('Trezor derivation path allowed are ' + allowedHdPaths.join(', ') + '. ' + path + ' is not supported', 'InvalidDerivationPath');
  }

  var pathComponents = obtainPathComponentsFromDerivationPath(path);

  var addressToPathMap = {};

  var alreadyOpenTrezorModal = false;

  _trezorConnect2.default.manifest({
    email: 'tyler@makerdao.com',
    appUrl: 'https://makerdao.com'
  });

  function trezorSignMessage(path, data) {
    return _trezorConnect2.default.ethereumSignMessage({
      path: path,
      message: data
    });
  }

  function trezorSignTransaction(path, txData) {
    return _trezorConnect2.default.ethereumSignTransaction({
      path: path,
      transaction: {
        nonce: txData.nonce,
        gasPrice: txData.gasPrice,
        gasLimit: txData.gas,
        to: txData.to,
        value: txData.value ? txData.value : "",
        data: txData.data ? txData.data : "",
        chainId: parseInt(networkId, 10)
      }
    });
  }

  if (options.promisify) {
    return new _hookedWallet2.default({
      getAccounts: _getAccounts,
      signPersonalMessage: _signPersonalMessage,
      signTransaction: _signTransaction
    });
  }

  var subprovider = new _hookedWallet2.default({
    getAccounts: function getAccounts(callback) {
      _getAccounts().then(function (res) {
        return callback(null, (0, _values2.default)(res));
      }).catch(function (err) {
        return callback(err, null);
      });
    },
    signPersonalMessage: function signPersonalMessage(txData, callback) {
      _signPersonalMessage(txData).then(function (res) {
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

  return subprovider;
}