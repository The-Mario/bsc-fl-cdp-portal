import {
  BUSDDAI,
  BUSDUSDT,
  BUSDUSDC

} from '../libs/dai-plugin-mcd/src/index.js';

export default [
  {
    slug: 'busddai-a', // URL param
    symbol: 'BUSDDAI-A', // how it's displayed in the UI
    key: 'BUSDDAI-A', // the actual ilk name used in the vat
    gem: 'BUSDDAI',
    platform: 'Pancakeswap',
    link: 'https://exchange.pancakeswap.finance/#/add/',
    token1: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', //tonen contract
    token2: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3', //tonen contract
    currency: BUSDDAI, // the associated dai.js currency type
    networks: ['kovan', 'mainnet', 'testnet', 'rinkeby', 'ropsten', 'goerli', 'bsc']
  },
  {
    slug: 'busdusdt-a', // URL param
    symbol: 'BUSDUSDT-A', // how it's displayed in the UI
    key: 'BUSDUSDT-A', // the actual ilk name used in the vat
    gem: 'BUSDUSDT',
    platform: 'Pancakeswap',
    link: 'https://exchange.pancakeswap.finance/#/add/',
    token1: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', //tonen contract
    token2: '0x55d398326f99059fF775485246999027B3197955', //tonen contract
    currency: BUSDUSDT, // the associated dai.js currency type
    networks: ['kovan', 'mainnet', 'testnet', 'rinkeby', 'ropsten', 'goerli', 'bsc']
  },
  {
    slug: 'busdusdc-a', // URL param
    symbol: 'BUSDUSDC-A', // how it's displayed in the UI
    key: 'BUSDUSDC-A', // the actual ilk name used in the vat
    gem: 'BUSDUSDC',
    platform: 'Pancakeswap',
    link: 'https://exchange.pancakeswap.finance/#/add/',
    token1: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', //tonen contract
    token2: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', //tonen contract
    currency: BUSDUSDC, // the associated dai.js currency type
    networks: ['kovan', 'mainnet', 'testnet', 'rinkeby', 'ropsten', 'goerli', 'bsc']
  }
];
