import React from 'react';
import { USDFL } from '../../libs/dai-plugin-mcd/src/index.js';
import { Text, Input, Grid, Button } from '@makerdao/ui-components-core';
import debug from 'debug';
import { getColor } from '../../styles/theme';

import { formatCollateralizationRatio } from 'utils/ui';

import useMaker from 'hooks/useMaker';
import useProxy from 'hooks/useProxy';
import useTokenAllowance from 'hooks/useTokenAllowance';
import useWalletBalances from 'hooks/useWalletBalances';
import useValidatedInput from 'hooks/useValidatedInput';
import useLanguage from 'hooks/useLanguage';
import useAnalytics from 'hooks/useAnalytics';
import { formatter } from '../../utils/ui';
import { subtract, greaterThan, equalTo, minimum } from '../../utils/bignumber';

import Info from './shared/Info';
import InfoContainer from './shared/InfoContainer';
import ProxyAllowanceToggle from 'components/ProxyAllowanceToggle';
import SetMax from 'components/SetMax';
import { decimalRules } from '../../styles/constants';

const { short } = decimalRules;

const log = debug('maker:Sidebars/Payback');

const Payback = ({ vault, reset }) => {
  const { trackBtnClick } = useAnalytics('Payback', 'Sidebar');
  const { lang } = useLanguage();
  const { maker } = useMaker();
  const balances = useWalletBalances();
  const daiBalance = balances.USDFL;

  const { hasAllowance, hasSufficientAllowance } = useTokenAllowance('USDFL');
  const { hasProxy } = useProxy();

  let { debtValue, debtFloor, collateralAmount } = vault;
  debtValue = debtValue.toBigNumber().decimalPlaces(2);
  const symbol = collateralAmount?.symbol;
  const vaultUnderDustLimit = debtValue.gt(0) && debtValue.lt(debtFloor);

  // Amount being repaid can't result in a remaining debt lower than the dust
  // minimum unless the full amount is being repaid
  const dustLimitValidation = input =>
    greaterThan(debtFloor, subtract(debtValue, input)) &&
    equalTo(input, debtValue) !== true;

  const [amount, setAmount, onAmountChange, amountErrors] = useValidatedInput(
    '',
    {
      maxFloat: Math.min(daiBalance, debtValue),
      minFloat: 0,
      isFloat: true,
      custom: {
        dustLimit: dustLimitValidation,
        allowanceInvalid: value => !hasSufficientAllowance(value)
      }
    },
    {
      maxFloat: amount => {
        return greaterThan(amount, daiBalance)
          ? lang.formatString(lang.action_sidebar.insufficient_balance, 'USDFL')
          : lang.action_sidebar.cannot_payback_more_than_owed;
      },
      dustLimit: () =>
        vaultUnderDustLimit
          ? lang.cdp_create.dust_payback_below_limit
          : lang.formatString(
              lang.cdp_create.dust_max_payback,
              subtract(debtValue, debtFloor)
            ),
      allowanceInvalid: () =>
        lang.formatString(lang.action_sidebar.invalid_allowance, 'USDFL')
    }
  );

  const amountToPayback = amount || 0;

  // Don't enter more than the user's balance if there isn't enough to cover the debt.
  const maxPaybackAmount =
    debtValue && daiBalance && minimum(debtValue, daiBalance);
  const setMax = () => setAmount(maxPaybackAmount.toString());

  const payback = async () => {
    const cdpManager = maker.service('mcd:cdpManager');
    const owner = await cdpManager.getOwner(vault.id);
    if (!owner) {
      log(`Unable to find owner of CDP #${vault.id}`);
      return;
    }
    const wipeAll = debtValue.toString() === amount;
    if (wipeAll) log('Calling wipeAll()');
    else log('Calling wipe()');
    wipeAll
      ? cdpManager.wipeAll(vault.id, owner)
      : cdpManager.wipe(vault.id, USDFL(amount), owner);
    reset();
  };

  const valid = amount && !amountErrors && hasProxy && hasAllowance;
  const undercollateralized = debtValue.minus(amountToPayback).lt(0);

  const collateralizationRatio = undercollateralized
    ? Infinity
    : vault.calculateCollateralizationRatio({
        debtValue: USDFL(debtValue.minus(amountToPayback))
      });
  return (
    <Grid gridRowGap="m">
      <Grid gridRowGap="s">
        <Text style={{ fontSize: '20px', color: getColor('whiteText') }}>
          {lang.action_sidebar.payback_title}
        </Text>
        <Text style={{ fontSize: '16px', color: getColor('greyText') }}>
          {lang.action_sidebar.payback_description}
        </Text>
        <div className="input_border">
          <Input
            style={{ color: getColor('whiteText') }}
            type="number"
            value={amount}
            min="0"
            onChange={onAmountChange}
            placeholder="0.00 USDFL"
            failureMessage={amountErrors}
            data-testid="payback-input"
            after={
              <SetMax
                onClick={() => {
                  setMax();
                  trackBtnClick('SetMax', {
                    maxAmount: maxPaybackAmount.toString(),
                    setMax: true
                  });
                }}
              />
            }
          />
        </div>
      </Grid>
      <ProxyAllowanceToggle token="USDFL" trackBtnClick={trackBtnClick} />
      <Grid gridTemplateColumns="1fr 1fr" gridColumnGap="s">
        <Button
          className="btn_next"
          disabled={!valid}
          onClick={() => {
            trackBtnClick('Confirm', {
              amount,
              fathom: { id: `${symbol}VaultPayback`, amount }
            });
            payback();
          }}
        >
          {lang.actions.pay_back}
        </Button>
        <Button
          className="btn"
          variant="secondary-outline"
          onClick={() => {
            trackBtnClick('Cancel');
            reset();
          }}
        >
          {lang.cancel}
        </Button>
      </Grid>
      <InfoContainer>
        <Info
          title={lang.action_sidebar.dai_balance}
          body={`${daiBalance &&
            formatter(daiBalance, { precision: short })} USDFL`}
        />
        <Info
          title={lang.action_sidebar.dai_debt}
          body={`${formatter(debtValue, { precision: short })} USDFL`}
        />
        <Info
          title={lang.action_sidebar.new_collateralization_ratio}
          body={formatCollateralizationRatio(collateralizationRatio)}
        />
      </InfoContainer>
    </Grid>
  );
};
export default Payback;
