import tokens from '../../contracts/tokens';
import values from 'lodash/values';

import {
  createCurrency,
  createCurrencyRatio,
  createGetCurrency
} from '@makerdao/currency';

export const currencies = values(tokens).reduce(
  (output, symbol) => {
    output[symbol] = createCurrency(symbol);
    return output;
  },
  {
    USD: createCurrency('USD')
  }
);

export const getCurrency = createGetCurrency(currencies);

// we export both the currencies object and the individual currencies because
// the latter is convenient when you know what you want to use, and the former
// is convenient when you are picking a currency based on a symbol from input

export const ETH = currencies.ETH;
export const FL = currencies.FL;
export const PETH = currencies.PETH;
export const WETH = currencies.WETH;
export const USD = currencies.USD;

export const USD_ETH = createCurrencyRatio(USD, ETH);
export const USD_FL = createCurrencyRatio(USD, FL);
export const USD_PETH = createCurrencyRatio(USD, PETH);
export const USD_WETH = createCurrencyRatio(USD, WETH);

Object.assign(currencies, {
  USD_ETH,
  USD_FL,
  USD_PETH,
  USD_WETH
});
