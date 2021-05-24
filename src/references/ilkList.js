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
    link: '#',
    token1: '', //tonen contract
    token2: '', //tonen contract
    currency: BUSDDAI, // the associated dai.js currency type
    networks: ['kovan', 'mainnet', 'testnet', 'rinkeby', 'ropsten', 'goerli']
  },
  {
    slug: 'busdusdt-a', // URL param
    symbol: 'BUSDUSDT-A', // how it's displayed in the UI
    key: 'BUSDUSDT-A', // the actual ilk name used in the vat
    gem: 'BUSDUSDT',
    platform: 'Pancakeswap',
    link: '#',
    token1: '', //tonen contract
    token2: '', //tonen contract 
    currency: BUSDUSDT, // the associated dai.js currency type
    networks: ['kovan', 'mainnet', 'testnet', 'rinkeby', 'ropsten', 'goerli']
  },
  {
    slug: 'busdusdc-a', // URL param
    symbol: 'BUSDUSDC-A', // how it's displayed in the UI
    key: 'BUSDUSDC-A', // the actual ilk name used in the vat
    gem: 'BUSDUSDC',
    platform: 'Pancakeswap',
    link: '#',
    token1: '', //tonen contract
    token2: '', //tonen contract
    currency: BUSDUSDC, // the associated dai.js currency type
    networks: ['kovan', 'mainnet', 'testnet', 'rinkeby', 'ropsten', 'goerli']
  }
];
