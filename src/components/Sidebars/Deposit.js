import React from 'react';
import { Text, Input, Grid, Button } from '@makerdao/ui-components-core';
import Info from './shared/Info';
import InfoContainer from './shared/InfoContainer';
import useMaker from 'hooks/useMaker';
import useProxy from 'hooks/useProxy';
import useTokenAllowance from 'hooks/useTokenAllowance';
import useWalletBalances from 'hooks/useWalletBalances';
import useValidatedInput from 'hooks/useValidatedInput';
import useLanguage from 'hooks/useLanguage';
import useAnalytics from 'hooks/useAnalytics';
import { formatCollateralizationRatio, formatter } from 'utils/ui';
import { multiply } from 'utils/bignumber';
import { getCurrency } from 'utils/cdp';
import ProxyAllowanceToggle from 'components/ProxyAllowanceToggle';
import BigNumber from 'bignumber.js';
import { getColor } from '../../styles/theme';
import { watch } from 'hooks/useObservable';

const Deposit = ({ vault, reset }) => {
  const { trackBtnClick } = useAnalytics('Deposit', 'Sidebar');
  const { lang } = useLanguage();
  const { maker } = useMaker();
  const { hasProxy } = useProxy();
  const { account } = useMaker();

  let {
    vaultType,
    collateralTypePrice,
    collateralValue,
    collateralAmount,
    collateralValueForAmount,
    collateralAmountByValue
  } = vault;

  const symbol = collateralAmount?.symbol;
  const { hasAllowance, hasSufficientAllowance } = useTokenAllowance(symbol);
  const gemBalances = useWalletBalances();
  const gemBalance = gemBalances[symbol] || 0;

  function convertAmountToValue(amount) {
    if (amount === 0) return BigNumber(0);
    const r = collateralValueForAmount(BigNumber(amount));

    if (r === undefined) return BigNumber(0);

    return r;
  }

  function convertValueToAmount(value) {
    if (value === 0) return BigNumber(0);
    const r = collateralAmountByValue(BigNumber(value));

    if (r === undefined) return BigNumber(0);
    return r;
  }

  const userVaultsList = watch.userVaultsList(account?.address);
  const userVaultIds = userVaultsList
    ? userVaultsList.map(({ vaultId }) => vaultId)
    : [];

  const depositBalance = convertAmountToValue(gemBalance);
  console.log('deposit', depositBalance);

  const [value, , onAmountChange, amountErrors] = useValidatedInput(
    '',
    {
      maxFloat: depositBalance,
      minFloat: 0,
      isFloat: true,
      custom: {
        allowanceInvalid: value => !hasSufficientAllowance(value)
      }
    },
    {
      maxFloat: () =>
        lang.formatString(lang.action_sidebar.insufficient_balance, symbol),
      allowanceInvalid: () =>
        lang.formatString(lang.action_sidebar.invalid_allowance, symbol)
    }
  );

  const valueToDeposit = value || BigNumber(0);
  const amountToDeposit = convertValueToAmount(valueToDeposit);

  const valid =
    value &&
    !amountErrors &&
    hasAllowance &&
    hasProxy;

  const deposit = () => {
    const currency = getCurrency({ ilk: vaultType });
    maker
      .service('mcd:cdpManager')
      .lock(vault.id, vaultType, currency(amountToDeposit));
    reset();
  };

  const valueDiff = multiply(amountToDeposit, collateralTypePrice.toNumber());

  const collateralizationRatio = vault.calculateCollateralizationRatio({
    collateralValue: collateralValue.plus(valueDiff)
  });

  return (
    <Grid gridRowGap="m">
      <Grid gridRowGap="s">
        <Text style={{ fontSize: '20px', color: getColor('whiteText') }}>
          {lang.formatString(lang.action_sidebar.deposit_title, symbol)}
        </Text>
        <p>
          <Text style={{ fontSize: '16px', color: getColor('greyText') }}>
            {lang.formatString(lang.action_sidebar.deposit_description, symbol)}
          </Text>
        </p>
        <div className="input_border">
          <Input
            style={{ color: getColor('whiteText') }}
            name="valueToLock"
            type="number"
            min="0"
            value={value}
            onChange={onAmountChange}
            placeholder={`0.00 USD`}
            failureMessage={amountErrors}
            data-testid="deposit-input"
          />
        </div>
      </Grid>
      <ProxyAllowanceToggle token={symbol} trackBtnClick={trackBtnClick} />
      <Grid gridTemplateColumns="1fr 1fr" gridColumnGap="s">
        <Button
          className="btn_next"
          disabled={!valid}
          onClick={() => {
            trackBtnClick('Confirm', {
              value,
              fathom: { id: `${symbol}VaultDeposit`, value }
            });
            deposit();
          }}
        >
          {lang.actions.deposit}
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
          title={lang.action_sidebar.current_account_balance}
          body={`${formatter(depositBalance)} USD`}
        />
        <Info
          title={lang.action_sidebar.new_collateralization_ratio}
          body={formatCollateralizationRatio(collateralizationRatio)}
        />
      </InfoContainer>
    </Grid>
  );
};
export default Deposit;
