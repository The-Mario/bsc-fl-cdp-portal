import { toHex, fromRay, fromWei } from '../utils';
import BigNumber from 'bignumber.js';
import { WAD } from '../constants';

import { validateAddress } from './_validators';

import {
  REWARD_AMOUNT,
  REWARD_FIRST_STAGE_DURATION,
  REWARD_START_TIME,
  REWARD_EARNED_EX,
  REWARD_PAIRINFO,
  REWARD_PAIRINFO_GEM,
  REWARD_PAIRINFO_AVAIL,
  REWARD_PAIRINFO_LOCKED,
  REWARD_PAIRINFO_LOCKEDVALUE,
  REWARD_PAIRINFO_AVAILVALUE,
  REWARD_CURRENT_EPOCH,
  REWARD_PAIRINFO_REWARDPERHOUR,
  REWARD_FAIR_DISTRIBUTION_MAX_VALUE,
  REWARD_FAIR_DISTRIBUTION_TIME,
  REWARD_PAIRINFO_GETPRICE,
  REWARD_GET_AMOUNTS_OUT,
  REWARD_GET_AMOUNTS_IN,
  REWARD_GET_APY_BY_PRICE
} from './_constants';

export const rewardAmount = {
  generate: address => ({
    id: `FL_REWARDER(${address})`,
    contract: 'FL_REWARDER',
    call: ['earned(address)(uint256)', address]
  }),
  validate: {
    args: validateAddress`Invalid address: ${'address'}`
  },
  returns: [[REWARD_AMOUNT, fromWei]]
};

export const rewardPairInfo = {
  generate: (name, address, hiRisk) => ({
    id: `FL_REWARD_PAIRINFO(${name},${hiRisk},${address})`,
    contract: hiRisk ? 'FL_REWARDER_GOV_USD' : 'FL_REWARDER_STABLES',
    call: [
      'getPairInfo(bytes32,address)(address,uint,uint,uint,uint)',
      toHex(name),
      address
    ]
  }),
  returns: [
    [REWARD_PAIRINFO_GEM],
    [REWARD_PAIRINFO_AVAIL, fromWei],
    [REWARD_PAIRINFO_LOCKED, fromWei],
    [REWARD_PAIRINFO_LOCKEDVALUE, fromWei],
    [REWARD_PAIRINFO_AVAILVALUE, fromWei]
  ]
};

export const rewardPairInfoGetPrice = {
  generate: (name, hiRisk) => ({
    id: `FL_REWARD_PAIRINFO_GETPRICE(${name},${hiRisk})`,
    contract: hiRisk ? 'FL_REWARDER_GOV_USD' : 'FL_REWARDER_STABLES',
    call: ['getPrice(bytes32)(uint256)', toHex(name)]
  }),
  returns: [[REWARD_PAIRINFO_GETPRICE]]
};

export const rewardPerHour = {
  generate: hiRisk => ({
    id: `FL_REWARD_PER_HOUR.${hiRisk}`,
    contract: hiRisk ? 'FL_REWARDER_GOV_USD' : 'FL_REWARDER_STABLES',
    call: ['getRewardPerHour()(uint256)']
  }),
  returns: [[REWARD_PAIRINFO_REWARDPERHOUR, fromWei]]
};

export const rewardStartTime = {
  generate: () => ({
    id: `FL_REWARD_STARTTIME`,
    contract: 'FL_REWARDER',
    call: ['starttime()(uint256)']
  }),
  returns: [[REWARD_START_TIME, v => BigNumber(v)]]
};

export const rewardFairDistributionMaxValue = {
  generate: () => ({
    id: `FL_REWARD_FAIR_DISTRIBUTION_MAX_VALUE`,
    contract: 'FL_REWARDER',
    call: ['fairDistributionMaxValue()(uint256)']
  }),
  returns: [[REWARD_FAIR_DISTRIBUTION_MAX_VALUE, fromWei]]
};

export const rewardFairDistributionTime = {
  generate: () => ({
    id: `FL_REWARD_FAIR_DISTRIBUTION_TIME`,
    contract: 'FL_REWARDER',
    call: ['fairDistributionTime()(uint256)']
  }),
  returns: [[REWARD_FAIR_DISTRIBUTION_TIME, v => BigNumber(v)]]
};

export const rewardFirstStageDuration = {
  generate: () => ({
    id: `FL_REWARD_FIRST_STAGE_DURATION`,
    contract: 'FL_REWARDER',
    call: ['duration()(uint256)']
  }),
  returns: [[REWARD_FIRST_STAGE_DURATION, v => BigNumber(v)]]
};

export const rewardEarnedEx = {
  generate: (address, hiRisk) => ({
    id: `FL_EARNED_REWARD_EX(${hiRisk},${address})`,
    contract: hiRisk ? 'FL_REWARDER_GOV_USD' : 'FL_REWARDER_STABLES',
    call: ['earned(address)(uint256)', address]
  }),
  returns: [[REWARD_EARNED_EX, fromWei]]
};

export const rewardCurrentEpoch = {
  generate: hiRisk => ({
    id: `REWARD_CURRENT_EPOCH(${hiRisk})`,
    contract: hiRisk ? 'FL_REWARDER_GOV_USD' : 'FL_REWARDER_STABLES',
    call: ['calcCurrentEpoch()(uint256)']
  }),
  returns: [[REWARD_CURRENT_EPOCH]]
};

export const getApyByPrice = {
  generate: (hiRisk, amount, price) => ({
    id: `REWARD_GET_APY_BY_PRICE(${hiRisk})`,
    contract: 'FL_STATS',
    call: [
      `${hiRisk ? 'getHiRiskApy' : 'getLowRiskApy'}(uint256,uint256)(uint256)`,
      BigNumber(amount)
        .shiftedBy(18)
        .toFixed(),
      BigNumber(price)
        .shiftedBy(18)
        .toFixed()
    ]
  }),
  returns: [[REWARD_GET_APY_BY_PRICE, fromWei]]
};

export const getAmountsOut = {
  generate: (amount, t0, t1) => ({
    id: `GET_AMOUNTS_OUT()`,
    contract: 'UNI_ROUTER',
    call: ['getAmountsOut(uint256,address[])(uint256[])', amount, [t0, t1]]
  }),
  returns: [[REWARD_GET_AMOUNTS_OUT, v => v[v.length - 1].toNumber()]]
};

export const getAmountsIn = {
  generate: (amount, t0, t1) => ({
    id: `GET_AMOUNTS_IN()`,
    contract: 'UNI_ROUTER',
    call: ['getAmountsIn(uint256,address[])(uint256[])', amount, [t0, t1]]
  }),
  returns: [[REWARD_GET_AMOUNTS_IN, v => v[0].toNumber()]]
};

export default {
  rewardAmount,
  rewardPairInfo,
  rewardPerHour,
  rewardStartTime,
  rewardEarnedEx,
  rewardFirstStageDuration,
  rewardCurrentEpoch,
  rewardFairDistributionMaxValue,
  rewardFairDistributionTime,
  rewardPairInfoGetPrice,
  getAmountsOut,
  getAmountsIn,
  getApyByPrice
};
