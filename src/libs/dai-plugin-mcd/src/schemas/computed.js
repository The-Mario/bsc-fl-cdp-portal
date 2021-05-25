import { createCurrency, createCurrencyRatio } from '@makerdao/currency';
import {
  collateralValue as calcCollateralValue,
  collateralAmountByValue as calcCollateralAmountByValue,
  daiAvailable as calcDaiAvailable,
  collateralizationRatio as calcCollateralizationRatio,
  liquidationPrice as calcLiquidationPrice,
  minSafeCollateralAmount as calcMinSafeCollateralAmount
} from '../math';
import {
  USD,
  USDFL,
  DSR_USDFL,
  defaultCdpTypes,
  ALLOWANCE_AMOUNT
} from '../';
import BigNumber from 'bignumber.js';
import {
  DEBT_CEILING,
  RATIO_DAI_USD,
  LIQUIDATION_RATIO,
  PRICE_WITH_SAFETY_MARGIN,
  COLLATERAL_TYPE_PRICE,
  VAULT_TYPE,
  VAULT_ADDRESS,
  VAULT_OWNER,
  VAULT_EXTERNAL_OWNER,
  ENCUMBERED_COLLATERAL,
  ENCUMBERED_DEBT,
  SAVINGS_DAI,
  TOTAL_SAVINGS_DAI,
  PROXY_ADDRESS,
  DEBT_SCALING_FACTOR,
  DEBT_VALUE,
  COLLATERALIZATION_RATIO,
  COLLATERAL_AMOUNT,
  COLLATERAL_VALUE,
  LIQUIDATION_PRICE,
  DAI_AVAILABLE,
  MIN_SAFE_COLLATERAL_AMOUNT,
  COLLATERAL_AVAILABLE_AMOUNT,
  COLLATERAL_AVAILABLE_VALUE,
  UNLOCKED_COLLATERAL,
  SAVINGS_RATE_ACCUMULATOR,
  DAI_LOCKED_IN_DSR,
  TOKEN_BALANCE,
  LIQUIDATION_PENALTY,
  ANNUAL_STABILITY_FEE,
  TOKEN_ALLOWANCE,
  DEBT_FLOOR,
  PROXY_OWNER,
  ANNUAL_DAI_SAVINGS_RATE,
  DAI_SAVINGS_RATE,
  DATE_EARNINGS_LAST_ACCRUED,
  USER_VAULT_IDS,
  USER_VAULT_ADDRESSES,
  USER_VAULT_TYPES,
  VAULT,
  TOTAL_ENCUMBERED_DEBT,
  ADAPTER_BALANCE,
  COLLATERAL_DEBT,
  COLLATERAL_TYPE_COLLATERALIZATION,
  COLLATERAL_TYPE_DATA,
  COLLATERAL_DEBT_AVAILABLE,
  REWARD_TOKEN_ALLOWANCE_BY_ADDRESS,
  REWARD_PAIRINFO,
  REWARD_WALLET_REWARD_PAIR_INFO,
  REWARD_PAIRINFO_GEM,
  REWARD_PAIRINFO_AVAIL,
  REWARD_PAIRINFO_AVAILVALUE,
  REWARD_PAIRINFO_LOCKED,
  REWARD_PAIRINFO_LOCKEDVALUE,
  REWARD_AMOUNT,
  REWARD_GOV_TOKEN_CONTRACT,
  REWARD_REWARD_CONTRACT,
  USER_VAULTS_LOCKED_VALUE,
  REWARD_FAIR_DISTRIBUTION_MAX_VALUE,
  REWARD_FAIR_DISTRIBUTION_TIME,
  REWARD_START_TIME,
  REWARD_GET_AMOUNTS_OUT,
  REWARD_GET_AMOUNTS_IN,
  REWARD_GET_UNI_PRICE,
  REWARD_GET_FL_PRICE,
  REWARD_GET_APY_BY_PRICE,
  REWARD_GET_APY,
  REWARD_GET_PROFIT
} from './_constants';
import { validateAddress, validateVaultId } from './_validators';

export const collateralTypePrice = {
  generate: collateralTypeName => ({
    dependencies: [
      [RATIO_DAI_USD],
      [PRICE_WITH_SAFETY_MARGIN, collateralTypeName],
      [LIQUIDATION_RATIO, collateralTypeName]
    ],
    computed: (ratioDaiUsd, priceWithSafetyMargin, liquidationRatio) => {
      const [symbol] = collateralTypeName.split('-');
      const currency = createCurrency(symbol);
      const ratio = createCurrencyRatio(USD, currency);
      const price = priceWithSafetyMargin
        .times(ratioDaiUsd.toNumber())
        .times(liquidationRatio.toNumber());
      return ratio(price);
    }
  })
};

export const collateralTypesPrices = {
  generate: types => ({
    dependencies: () =>
      types.map(collateralTypeName => [
        COLLATERAL_TYPE_PRICE,
        collateralTypeName
      ]),
    computed: (...prices) => {
      return prices;
    }
  })
};

export const defaultCollateralTypesPrices = {
  generate: () => ({
    dependencies: () =>
      defaultCdpTypes.map(({ ilk: collateralTypeName }) => [
        COLLATERAL_TYPE_PRICE,
        collateralTypeName
      ]),
    computed: (...prices) => prices
  })
};

export const vaultTypeAndAddress = {
  generate: id => ({
    dependencies: [
      [VAULT_TYPE, id],
      [VAULT_ADDRESS, id]
    ],
    computed: (vaultType, vaultAddress) => [vaultType, vaultAddress]
  })
};

export const vaultExternalOwner = {
  generate: id => ({
    dependencies: [[PROXY_OWNER, [VAULT_OWNER, id]]],
    computed: owner => owner
  })
};

export const vaultCollateralAndDebt = {
  generate: (vaultType, vaultAddress) => ({
    dependencies: [
      [ENCUMBERED_COLLATERAL, vaultType, vaultAddress],
      [ENCUMBERED_DEBT, vaultType, vaultAddress]
    ],
    computed: (encumberedCollateral, encumberedDebt) => [
      encumberedCollateral,
      encumberedDebt
    ]
  })
};

// TODO This should also account for unencumbered collateral which is collateral on the
// join adapter
export const collateralAmount = {
  generate: id => ({
    dependencies: [
      [VAULT_TYPE, id],
      [ENCUMBERED_COLLATERAL, [VAULT_TYPE, id], [VAULT_ADDRESS, id]]
    ],
    computed: (vaultType, encumberedCollateral) => {
      const [symbol] = vaultType.split('-');
      const currency = createCurrency(symbol);
      return currency(encumberedCollateral);
    }
  })
};

export const collateralValue = {
  generate: id => ({
    dependencies: [
      [COLLATERAL_TYPE_PRICE, [VAULT_TYPE, id]],
      [COLLATERAL_AMOUNT, id]
    ],
    computed: (collateralTypePrice, collateralAmount) =>
      calcCollateralValue(collateralAmount, collateralTypePrice)
  })
};

export const debtValue = {
  generate: id => ({
    dependencies: [
      [ENCUMBERED_DEBT, [VAULT_TYPE, id], [VAULT_ADDRESS, id]],
      [DEBT_SCALING_FACTOR, [VAULT_TYPE, id]]
    ],
    computed: (encumberedDebt, debtScalingFactor) => {
      return USDFL(encumberedDebt).times(debtScalingFactor);
    }
  })
};

export const collateralizationRatio = {
  generate: id => ({
    dependencies: [
      [COLLATERAL_VALUE, id],
      [DEBT_VALUE, id]
    ],
    computed: (collateralValue, debtValue) =>
      calcCollateralizationRatio(collateralValue, debtValue)
  })
};

export const liquidationPrice = {
  generate: id => ({
    dependencies: [
      [COLLATERAL_AMOUNT, id],
      [DEBT_VALUE, id],
      [LIQUIDATION_RATIO, [VAULT_TYPE, id]]
    ],
    computed: (collateralAmount, debtValue, liquidationRatio) =>
      calcLiquidationPrice(collateralAmount, debtValue, liquidationRatio)
  })
};

export const daiAvailable = {
  generate: id => ({
    dependencies: [
      [COLLATERAL_VALUE, id],
      [DEBT_VALUE, id],
      [LIQUIDATION_RATIO, [VAULT_TYPE, id]]
    ],
    computed: (collateralValue, debtValue, liquidationRatio) =>
      calcDaiAvailable(collateralValue, debtValue, liquidationRatio)
  })
};

export const minSafeCollateralAmount = {
  generate: id => ({
    dependencies: [
      [DEBT_VALUE, id],
      [LIQUIDATION_RATIO, [VAULT_TYPE, id]],
      [COLLATERAL_TYPE_PRICE, [VAULT_TYPE, id]]
    ],
    computed: (debtValue, liquidationRatio, price) =>
      calcMinSafeCollateralAmount(debtValue, liquidationRatio, price)
  })
};

export const collateralAvailableAmount = {
  generate: id => ({
    dependencies: [
      [COLLATERAL_AMOUNT, id],
      [MIN_SAFE_COLLATERAL_AMOUNT, id]
    ],
    computed: (collateralAmount, minSafeCollateralAmount) => {
      if (
        minSafeCollateralAmount.toBigNumber().gt(collateralAmount.toBigNumber())
      ) {
        return createCurrency(collateralAmount.symbol)(0);
      } else {
        return collateralAmount.minus(minSafeCollateralAmount);
      }
    }
  })
};

export const collateralAvailableValue = {
  generate: id => ({
    dependencies: [
      [COLLATERAL_AVAILABLE_AMOUNT, id],
      [COLLATERAL_TYPE_PRICE, [VAULT_TYPE, id]]
    ],
    computed: (collateralAvailableAmount, collateralTypePrice) =>
      calcCollateralValue(collateralAvailableAmount, collateralTypePrice)
  })
};

export const collateralTypeData = {
  generate: collateralTypeName => ({
    dependencies: [
      [COLLATERAL_TYPE_PRICE, collateralTypeName],
      [ANNUAL_STABILITY_FEE, collateralTypeName],
      [LIQUIDATION_PENALTY, collateralTypeName],
      [LIQUIDATION_RATIO, collateralTypeName],
      [PRICE_WITH_SAFETY_MARGIN, collateralTypeName],
      [DEBT_FLOOR, collateralTypeName],
      [COLLATERAL_DEBT_AVAILABLE, collateralTypeName]
    ],
    computed: (
      collateralTypePrice,
      annualStabilityFee,
      liquidationPenalty,
      liquidationRatio,
      priceWithSafetyMargin,
      debtFloor,
      collateralDebtAvailable
    ) => ({
      symbol: collateralTypeName,
      collateralTypePrice,
      annualStabilityFee,
      liquidationRatio,
      liquidationPenalty,
      priceWithSafetyMargin,
      debtFloor,
      collateralDebtAvailable,
      calculateCollateralizationRatio(collateralAmount, debtValue) {
        return calcCollateralizationRatio(
          this.collateralTypePrice.times(collateralAmount),
          debtValue
        )
          .times(100)
          .toNumber();
      },
      calculateliquidationPrice(collateralAmount, debtValue) {
        return calcLiquidationPrice(
          collateralAmount,
          debtValue,
          this.liquidationRatio
        );
      },
      calculateMaxDai(collateralAmount) {
        return priceWithSafetyMargin.times(collateralAmount);
      },
      collateralValueForAmount(amount) {
        return calcCollateralValue(amount, collateralTypePrice.toBigNumber());
      },
      collateralAmountByValue(value) {
        return calcCollateralAmountByValue(
          value,
          collateralTypePrice.toBigNumber()
        );
      }
    })
  })
};

export const collateralTypesData = {
  generate: types => ({
    dependencies: () =>
      types.map(collateralTypeName => [
        COLLATERAL_TYPE_DATA,
        collateralTypeName
      ]),
    computed: (...collateralTypes) => collateralTypes
  })
};

export const vault = {
  generate: id => ({
    dependencies: [
      [VAULT_TYPE, id],
      [VAULT_ADDRESS, id],
      [VAULT_OWNER, id],
      [VAULT_EXTERNAL_OWNER, id],
      [ENCUMBERED_COLLATERAL, [VAULT_TYPE, id], [VAULT_ADDRESS, id]],
      [ENCUMBERED_DEBT, [VAULT_TYPE, id], [VAULT_ADDRESS, id]],
      [COLLATERAL_TYPE_PRICE, [VAULT_TYPE, id]],
      [DEBT_VALUE, id],
      [COLLATERALIZATION_RATIO, id],
      [COLLATERAL_AMOUNT, id],
      [COLLATERAL_VALUE, id],
      [LIQUIDATION_PRICE, id],
      [DAI_AVAILABLE, id],
      [COLLATERAL_AVAILABLE_AMOUNT, id],
      [COLLATERAL_AVAILABLE_VALUE, id],
      [UNLOCKED_COLLATERAL, [VAULT_TYPE, id], [VAULT_ADDRESS, id]],
      [LIQUIDATION_RATIO, [VAULT_TYPE, id]],
      [LIQUIDATION_PENALTY, [VAULT_TYPE, id]],
      [ANNUAL_STABILITY_FEE, [VAULT_TYPE, id]],
      [DEBT_FLOOR, [VAULT_TYPE, id]],
      [MIN_SAFE_COLLATERAL_AMOUNT, id],
      [COLLATERAL_DEBT_AVAILABLE, [VAULT_TYPE, id]]
    ],
    computed: (
      vaultType,
      vaultAddress,
      ownerAddress,
      externalOwnerAddress,
      encumberedCollateral,
      encumberedDebt,
      collateralTypePrice,
      debtValue,
      collateralizationRatio,
      collateralAmount,
      collateralValue,
      liquidationPrice,
      daiAvailable,
      collateralAvailableAmount,
      collateralAvailableValue,
      unlockedCollateral,
      liquidationRatio,
      liquidationPenalty,
      annualStabilityFee,
      debtFloor,
      minSafeCollateralAmount,
      collateralDebtAvailable
    ) => ({
      id: parseInt(id),
      vaultType,
      vaultAddress,
      ownerAddress,
      externalOwnerAddress,
      encumberedCollateral,
      encumberedDebt,
      collateralTypePrice,
      debtValue,
      collateralizationRatio,
      collateralAmount,
      collateralValue,
      liquidationPrice,
      daiAvailable,
      collateralAvailableAmount,
      collateralAvailableValue,
      unlockedCollateral,
      liquidationRatio,
      liquidationPenalty,
      annualStabilityFee,
      debtFloor,
      minSafeCollateralAmount,
      collateralDebtAvailable,
      calculateLiquidationPrice({
        collateralAmount = this.collateralAmount,
        debtValue = this.debtValue,
        liquidationRatio = this.liquidationRatio
      } = {}) {
        if (!collateralAmount || !debtValue || !liquidationRatio) return;
        return calcLiquidationPrice(
          collateralAmount,
          debtValue,
          liquidationRatio
        );
      },
      collateralValueForAmount(amount) {
        return calcCollateralValue(amount, collateralTypePrice.toBigNumber());
      },
      collateralAmountByValue(value) {
        return calcCollateralAmountByValue(
          value,
          collateralTypePrice.toBigNumber()
        );
      },
      calculateCollateralizationRatio({
        collateralValue = this.collateralValue,
        debtValue = this.debtValue
      } = {}) {
        if (!collateralValue || !debtValue) return;
        return calcCollateralizationRatio(collateralValue, debtValue)
          .times(100)
          .toNumber();
      }
    })
  }),
  validate: {
    args: validateVaultId
  }
};

export const walletRewardAmount = {
  generate: address => ({
    dependencies: [[REWARD_AMOUNT, [PROXY_ADDRESS, address]]],
    computed: amount => {
      return amount;
    }
  }),
  validate: {
    args: validateAddress`Invalid address for walletRewardAmount: ${'address'}`
  }
};

export const rewardContract = {
  generate: hiRisk => ({
    dependencies: ({ get }) => [
      [
        async () => {
          const contractAddress = await get('smartContract').getContractAddress(
            hiRisk ? 'FL_REWARDER_GOV_USD_HOLDER' : 'FL_REWARDER_STABLES_HOLDER'
          );
          return contractAddress;
        }
      ]
    ],
    computed: address => address
  })
};

export const walletRewardPairInfo = {
  generate: (name, address, hiRisk) => ({
    dependencies: [
      [REWARD_PAIRINFO_GEM, name, address, hiRisk],
      [REWARD_PAIRINFO_AVAIL, name, address, hiRisk],
      [REWARD_PAIRINFO_AVAILVALUE, name, address, hiRisk],
      [REWARD_PAIRINFO_LOCKED, name, address, hiRisk],
      [REWARD_PAIRINFO_LOCKEDVALUE, name, address, hiRisk],
      [
        REWARD_TOKEN_ALLOWANCE_BY_ADDRESS,
        address,
        [REWARD_REWARD_CONTRACT, hiRisk],
        [REWARD_PAIRINFO_GEM, name, address, hiRisk]
      ]
    ],

    computed: (gem, avail, availvalue, locked, lockedvalue, allowance) => {
      return {
        name,
        hiRisk,
        gem,
        avail,
        availvalue,
        locked,
        lockedvalue,
        allowance
      };
    }
  })
};

export const walletRewardPairInfos = {
  generate: (rewardList, address, hiRisk) => ({
    dependencies: rewardList.map(name => [
      REWARD_WALLET_REWARD_PAIR_INFO,
      name,
      address,
      hiRisk
    ]),
    computed: (...infos) => infos
  })
};

export const daiLockedInDsr = {
  generate: address => ({
    dependencies: [
      [SAVINGS_DAI, [PROXY_ADDRESS, address]],
      [SAVINGS_RATE_ACCUMULATOR]
    ],
    computed: (savingsDai, savingsRateAccumulator) => {
      return DSR_USDFL(savingsDai.times(savingsRateAccumulator));
    }
  }),
  validate: {
    args: validateAddress`Invalid address for daiLockedInDsr: ${'address'}`
  }
};

export const totalDaiLockedInDsr = {
  generate: () => ({
    dependencies: [[TOTAL_SAVINGS_DAI], [SAVINGS_RATE_ACCUMULATOR]],
    computed: (totalSavingsDai, savingsRateAccumulator) => {
      return DSR_USDFL(totalSavingsDai.times(savingsRateAccumulator));
    }
  })
};

export const balance = {
  generate: (symbol, address) => ({
    dependencies: () => {
      if (symbol === 'DSR-USDFL') {
        return [[DAI_LOCKED_IN_DSR, address]];
      }
      return [[TOKEN_BALANCE, address, symbol]];
    },
    computed: v => v
  })
};

export const allowance = {
  generate: (symbol, address) => ({
    dependencies: [
      symbol === 'ETH'
        ? [[ALLOWANCE_AMOUNT]]
        : [TOKEN_ALLOWANCE, address, [PROXY_ADDRESS, address], symbol]
    ],
    computed: v => v.isEqualTo(ALLOWANCE_AMOUNT)
  })
};

export const savings = {
  generate: address => ({
    dependencies: [
      [ANNUAL_DAI_SAVINGS_RATE],
      [DAI_SAVINGS_RATE],
      [DATE_EARNINGS_LAST_ACCRUED],
      [DAI_LOCKED_IN_DSR, address],
      [PROXY_ADDRESS, address],
      [SAVINGS_RATE_ACCUMULATOR],
      [SAVINGS_DAI, [PROXY_ADDRESS, address]]
    ],
    computed: (
      annualDaiSavingsRate,
      daiSavingsRate,
      dateEarningsLastAccrued,
      daiLockedInDsr,
      proxyAddress,
      savingsRateAccumulator,
      savingsDai
    ) => ({
      annualDaiSavingsRate,
      daiSavingsRate,
      dateEarningsLastAccrued,
      daiLockedInDsr,
      proxyAddress,
      savingsRateAccumulator,
      savingsDai
    })
  }),
  validate: {
    args: validateAddress`Invalid address for savings: ${'address'}`
  }
};

export const userVaultsList = {
  generate: address => ({
    dependencies: ({ get }) => {
      const cdpManagerAddress = get('smartContract').getContractAddress(
        'CDP_MANAGER'
      );
      return [
        [USER_VAULT_IDS, cdpManagerAddress, [PROXY_ADDRESS, address]],
        [USER_VAULT_ADDRESSES, cdpManagerAddress, [PROXY_ADDRESS, address]],
        [USER_VAULT_TYPES, cdpManagerAddress, [PROXY_ADDRESS, address]]
      ];
    },
    computed: (ids, addresses, types) =>
      ids.reduce(
        (acc, id, idx) => [
          ...acc,
          {
            vaultId: id,
            vaultAddress: addresses[idx],
            vaultType: types[idx]
          }
        ],
        []
      )
  }),
  validate: {
    args: validateAddress`Invalid address for userVaultsList: ${'address'}`
  }
};

export const userVaultsData = {
  generate: ids => ({
    dependencies: ids.map(id => [VAULT, id]),
    computed: (...vaults) => vaults
  })
};

export const userVaultsLockedValue = {
  generate: ids => ({
    dependencies: ids.map(id => [VAULT, id]),
    computed: (...vaults) => {
      return vaults.reduce(
        (acc, { collateralValue }) =>
          collateralValue ? acc.plus(collateralValue.toBigNumber()) : acc,
        BigNumber(0)
      );
    }
  })
};

export const fairDistribAllowToLockValue = {
  generate: (ids, addValue, curTime) => ({
    dependencies: () =>
      [
        [REWARD_FAIR_DISTRIBUTION_MAX_VALUE],
        [REWARD_FAIR_DISTRIBUTION_TIME],
        [REWARD_START_TIME]
      ].concat(ids.map(id => [VAULT, id])),
    computed: (maxValue, duration, startTime, ...vaults) => {
      console.log(
        'fairDistribAllowToLockValue time',
        curTime,
        duration.plus(startTime).toNumber(),
        duration.toNumber(),
        startTime.toNumber()
      );
      if (BigNumber(curTime) > duration.plus(startTime)) return true;

      const locked = vaults.reduce(
        (acc, { collateralValue }) =>
          collateralValue ? acc.plus(collateralValue.toBigNumber()) : acc,
        BigNumber(0)
      );
      console.log(
        'fairDistribAllowToLockValue',
        BigNumber(addValue).toNumber(),
        locked.toNumber(),
        maxValue.toNumber()
      );
      return BigNumber(addValue).plus(locked) < maxValue - 100;
    }
  })
};

export const collateralDebt = {
  generate: collateralTypeName => ({
    dependencies: [
      [TOTAL_ENCUMBERED_DEBT, collateralTypeName],
      [DEBT_SCALING_FACTOR, collateralTypeName]
    ],
    computed: (totalEncumberedDebt, debtScalingFactor) => {
      return USDFL(totalEncumberedDebt).times(debtScalingFactor);
    }
  })
};

export const collateralDebtCeilings = {
  generate: cdpTypes => ({
    dependencies: () => cdpTypes.map(type => [DEBT_CEILING, type]),
    computed: (...ceilings) => {
      return cdpTypes.reduce(
        (acc, cdpType, idx) => ({
          ...acc,
          [cdpType]: ceilings[idx]
        }),
        {}
      );
    }
  })
};

export const collateralDebtAvailable = {
  generate: collateralTypeName => ({
    dependencies: [
      [COLLATERAL_DEBT, collateralTypeName],
      [DEBT_CEILING, collateralTypeName]
    ],
    computed: (collateralDebt, debtCeiling) => {
      collateralDebt = collateralDebt
        .toBigNumber()
        .decimalPlaces(18, BigNumber.ROUND_DOWN);

      return debtCeiling.minus(collateralDebt);
    }
  })
};

export const collateralTypeCollateralization = {
  generate: (collateralTypeName, percentage = true) => ({
    dependencies: [
      [COLLATERAL_DEBT, collateralTypeName],
      [COLLATERAL_TYPE_PRICE, collateralTypeName],
      [ADAPTER_BALANCE, collateralTypeName]
    ],
    computed: (debt, price, amount) => {
      const collateral = calcCollateralValue(amount, price.toBigNumber());
      const ratio = calcCollateralizationRatio(
        collateral,
        debt.toBigNumber()
      ).times(100);
      return percentage
        ? ratio
        : { collateralValue: collateral, debtValue: debt };
    }
  })
};

export const systemCollateralization = {
  generate: vaultTypes => ({
    dependencies: vaultTypes.map(vaultType => [
      COLLATERAL_TYPE_COLLATERALIZATION,
      vaultType,
      false
    ]),
    computed: (...collateralizationValues) => {
      const {
        totalCollateralValue,
        totalDebtValue
      } = collateralizationValues.reduce(
        (acc, { collateralValue, debtValue }) => ({
          totalCollateralValue: acc.totalCollateralValue.plus(
            collateralValue.toBigNumber()
          ),
          totalDebtValue: acc.totalDebtValue.plus(debtValue.toBigNumber())
        }),
        {
          totalCollateralValue: BigNumber(0),
          totalDebtValue: BigNumber(0)
        }
      );

      return calcCollateralizationRatio(
        totalCollateralValue,
        totalDebtValue
      ).times(100);
    }
  })
};

export const getUniPrice = {
  generate: (t0, t1, amount) => ({
    dependencies: [
      [REWARD_GET_AMOUNTS_OUT, amount, t1, t0],
      [REWARD_GET_AMOUNTS_IN, amount, t0, t1]
    ],
    computed: (amountOut, amountIn) => {
      return (amountOut + amountIn) / (2.0 * amount);
    }
  })
};

export const getFLPrice = {
  generate: (inWei = false) => ({
    dependencies: ({ get }) => {
      const cdpFLAddress = get('smartContract').getContractAddress('MCD_GOV');
      const cdpUSDFLAddress = get('smartContract').getContractAddress(
        'MCD_DAI'
      );
      return [[REWARD_GET_UNI_PRICE, cdpUSDFLAddress, cdpFLAddress, 1000]];
    },
    computed: price =>
      inWei
        ? BigNumber(price)
          .shiftedBy(18)
          .toFixed()
        : price
  })
};

export const getProfit = {
  generate: (amount, hiRisk) => ({
    dependencies: [
      [REWARD_GET_APY_BY_PRICE, hiRisk, amount, [REWARD_GET_FL_PRICE, false]]
    ],

    computed: apy => apy
  })
};

export const getAPY = {
  generate: hiRisk => ({
    dependencies: [[REWARD_GET_PROFIT, 10000, hiRisk]],

    computed: apy => {
      const f = hiRisk ? 1.91 : 1.0; //handle X2 boost for new risk pools
      return (apy * f) / 10000.0;
    }
  })
};

export const proxyOwner = {
  generate: address => ({
    dependencies: ({ get }) => [
      [
        async () => {
          try {
            return await get('smartContract')
              .get('transactionManager')
              .get('proxy')
              .getOwner(address);
          } catch (e) {
            return null;
          }
        }
      ]
    ],
    computed: owner => owner
  }),
  validate: {
    args: validateAddress`Invalid address for proxyOwner: ${'address'}`
  }
};

export default {
  collateralTypePrice,
  collateralTypesPrices,
  defaultCollateralTypesPrices,
  vaultTypeAndAddress,
  vaultExternalOwner,
  vaultCollateralAndDebt,
  vault,
  collateralAmount,
  collateralValue,
  debtValue,
  collateralizationRatio,
  liquidationPrice,
  daiAvailable,
  minSafeCollateralAmount,
  collateralAvailableAmount,
  collateralAvailableValue,
  daiLockedInDsr,
  totalDaiLockedInDsr,
  balance,
  allowance,
  savings,
  userVaultsList,
  userVaultsData,
  collateralDebt,
  collateralTypeCollateralization,
  systemCollateralization,
  proxyOwner,
  collateralTypeData,
  collateralTypesData,
  collateralDebtCeilings,
  collateralDebtAvailable,
  userVaultsLockedValue
};
