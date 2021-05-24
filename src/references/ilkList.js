import {
  USDTUSDC,
  USDTDAI,
  USDCDAI,
  USDTUSDN,
  USDNDAI,
  USDCUSDN

} from '../libs/dai-plugin-mcd/src/index.js';

export default [
  {
    slug: 'usdtusdc-a', // URL param
    symbol: 'USDTUSDC-A', // how it's displayed in the UI
    key: 'USDTUSDC-A', // the actual ilk name used in the vat
    gem: 'USDTUSDC', // the actual asset that's being locked
    platform: 'Uniswap',
    link: 'https://app.uniswap.org/#/add/',
    token1: '0xdAC17F958D2ee523a2206206994597C13D831ec7', //tonen contract
    token2: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', //tonen contract
    currency: USDTUSDC, // the associated dai.js currency type
    networks: ['kovan', 'mainnet', 'testnet', 'rinkeby', 'ropsten', 'goerli']
  },
  {
    slug: 'usdtdai-a', // URL param
    symbol: 'USDTDAI-A', // how it's displayed in the UI
    key: 'USDTDAI-A', // the actual ilk name used in the vat
    gem: 'USDTDAI', // the actual asset that's being locked
    platform: 'Uniswap',
    link: 'https://app.uniswap.org/#/add/',
    token1: '0xdAC17F958D2ee523a2206206994597C13D831ec7', //tonen contract
    token2: '0x6B175474E89094C44Da98b954EedeAC495271d0F', //tonen contract
    currency: USDTDAI, // the associated dai.js currency type
    networks: ['kovan', 'mainnet', 'testnet', 'rinkeby', 'ropsten', 'goerli']
  },
  {
    slug: 'usdcdai-a', // URL param
    symbol: 'USDCDAI-A', // how it's displayed in the UI
    key: 'USDCDAI-A', // the actual ilk name used in the vat
    gem: 'USDCDAI', // the actual asset that's being locked
    platform: 'Uniswap',
    link: 'https://app.uniswap.org/#/add/',
    token1: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', //tonen contract
    token2: '0x6B175474E89094C44Da98b954EedeAC495271d0F', //tonen contract
    currency: USDCDAI, // the associated dai.js currency type
    networks: ['kovan', 'mainnet', 'testnet', 'rinkeby', 'ropsten', 'goerli']
  },
  {
    slug: 'usdndai-a', // URL param
    symbol: 'USDNDAI-A', // how it's displayed in the UI
    key: 'USDNDAI-A', // the actual ilk name used in the vat
    gem: 'USDNDAI', // the actual asset that's being locked
    platform: 'Uniswap',
    link: 'https://app.uniswap.org/#/add/',
    token1: '0x674C6Ad92Fd080e4004b2312b45f796a192D27a0', //tonen contract
    token2: '0x6B175474E89094C44Da98b954EedeAC495271d0F', //tonen contract
    currency: USDNDAI, // the associated dai.js currency type
    networks: []
  },
  {
    slug: 'usdtusdn-a', // URL param
    symbol: 'USDTUSDN-A', // how it's displayed in the UI
    key: 'USDTUSDN-A', // the actual ilk name used in the vat
    gem: 'USDTUSDN', // the actual asset that's being locked
    platform: 'Uniswap',
    link: 'https://app.uniswap.org/#/add/',
    token1: '0xdAC17F958D2ee523a2206206994597C13D831ec7', //tonen contract
    token2: '0x674C6Ad92Fd080e4004b2312b45f796a192D27a0', //tonen contract
    currency: USDTUSDN, // the associated dai.js currency type
    networks: ['kovan', 'mainnet', 'testnet', 'rinkeby', 'ropsten', 'goerli']
  },
  {
    slug: 'usdcusdn-a', // URL param
    symbol: 'USDCUSDN-A', // how it's displayed in the UI
    key: 'USDCUSDN-A', // the actual ilk name used in the vat
    gem: 'USDCUSDN', // the actual asset that's being locked
    platform: 'Uniswap',
    link: 'https://app.uniswap.org/#/add/',
    token1: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', //tonen contract
    token2: '0x674C6Ad92Fd080e4004b2312b45f796a192D27a0', //tonen contract
    currency: USDCUSDN, // the associated dai.js currency type
    networks: []
  }
];
