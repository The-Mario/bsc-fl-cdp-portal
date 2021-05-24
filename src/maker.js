// import Maker from './libs/dai/src/index';
import Maker from './libs/dai/src/index.js';
import McdPlugin, {
  ETH,
  BUSDDAI,
  BUSDUSDT,
  BUSDUSDC,
  USD,
  USDFL,
  SAI,
  defaultCdpTypes
} from './libs/dai-plugin-mcd/src/index.js';

import trezorPlugin from '@makerdao/dai-plugin-trezor-web';
import ledgerPlugin from '@makerdao/dai-plugin-ledger-web';
import walletLinkPlugin from '@makerdao/dai-plugin-walletlink';
import walletConnectPlugin from '@makerdao/dai-plugin-walletconnect';
import networkConfig from './references/config';
import { networkNameToId } from './utils/network';
import { getQueryParamByName } from './utils/dev';

import rinkebyAddresses from './references/contracts/rinkeby';
import goerliAddresses from './references/contracts/goerli';
import ropstenAddresses from './references/contracts/ropsten';
import testnetAddresses from './references/contracts/testnet';

let _maker;

const otherNetworksOverrides = [
  {
    network: 'rinkeby',
    contracts: rinkebyAddresses
  },
  { network: 'goerli', contracts: goerliAddresses },
  { network: 'ropsten', contracts: ropstenAddresses },
  { network: 'testnet', contracts: testnetAddresses }
].reduce((acc, { network, contracts }) => {
  for (const [contractName, contractAddress] of Object.entries(contracts)) {
    if (!acc[contractName]) acc[contractName] = {};
    acc[contractName][network] = contractAddress;
  }
  return acc;
}, {});

export function getMaker() {
  if (_maker === undefined) throw new Error('Maker has not been instatiated');
  return _maker;
}

export async function instantiateMaker({
  rpcUrl,
  network,
  testchainId,
  backendEnv
}) {
  const addressOverrides = ['rinkeby', 'ropsten', 'goerli', 'testnet'].some(
    networkName => networkName === network
  )
    ? otherNetworksOverrides
    : {};

  const mcdPluginConfig = {
    defaultCdpTypes,
    prefetch: false,
    addressOverrides
  };
  const walletLinkPluginConfig = {
    rpcUrl: networkConfig.rpcUrls[networkNameToId(network)]
  };

  const config = {
    log: false,
    plugins: [
      trezorPlugin,
      ledgerPlugin,
      [walletLinkPlugin, walletLinkPluginConfig],
      walletConnectPlugin,
      [McdPlugin, mcdPluginConfig]
    ],
    smartContract: {
      addressOverrides
    },
    provider: {
      url: rpcUrl,
      type:
        network === 'testnet'
          ? 'HTTP'
          : getQueryParamByName('ws') === '0'
            ? 'HTTP'
            : 'WEBSOCKET'
    },
    web3: {
      pollingInterval: network === 'testnet' ? 100 : null
    },
    gas: {
      apiKey: '3e722dd73e76ba3d2eb7507e316727db8a71d1fbc960ed1018e999a53f75'
    },
    multicall: true
  };

  // Use the config plugin, if we have a testchainConfigId
  if (testchainId) {
    console.log('testchainId mode is not unsupported:' + testchainId);
    throw new Error('testchainId mode is not unsupported.');
  } else if (!rpcUrl) {
    if (config.provider.type === 'HTTP')
      rpcUrl = networkConfig.rpcUrls[networkNameToId(network)];
    else if (config.provider.type === 'WEBSOCKET')
      rpcUrl = networkConfig.wsRpcUrls[networkNameToId(network)];
    else throw new Error(`Unsupported provider type: ${config.provider.type}`);
    if (!rpcUrl) throw new Error(`Unsupported network: ${network}`);
    config.provider.url = rpcUrl;
  }

  const maker = await Maker.create('http', config);

  // for debugging
  window.maker = maker;

  return maker;
}

export {
  USD,
  USDFL,
  ETH,
  BUSDDAI,
  BUSDUSDT,
  BUSDUSDC,
  SAI
};
