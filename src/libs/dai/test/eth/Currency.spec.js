// we just do some quick tests of the exports here, since the core functionality
// is being tested in @makerdao/currency

import { getCurrency, ETH, PETH, WETH, FL } from '../../src/eth/Currency';

test('parses an amount and currency symbol', () => {
  expect(getCurrency(1, 'mkr').toString()).toBe('1.00 FL');
  expect(getCurrency(1, 'weth').toString()).toBe('1.00 WETH');
  expect(getCurrency(1, 'peth').toString()).toBe('1.00 PETH');
  expect(getCurrency(1, 'eth').toString()).toBe('1.00 ETH');
});

test('parses an amount + currency class', () => {
  expect(getCurrency(1, ETH).toString()).toBe('1.00 ETH');
  expect(getCurrency(1, PETH).toString()).toBe('1.00 PETH');
  expect(getCurrency(1, WETH).toString()).toBe('1.00 WETH');
  expect(getCurrency(1, FL).toString()).toBe('1.00 FL');
});
