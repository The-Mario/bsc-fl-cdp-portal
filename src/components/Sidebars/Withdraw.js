import React from 'react';
import BigNumber from 'bignumber.js';
import { USDFL } from '../../libs/dai-plugin-mcd/src/index.js';
import { Text, Input, Grid, Button } from '@makerdao/ui-components-core';
import Info from './shared/Info';
import InfoContainer from './shared/InfoContainer';
import SetMax from 'components/SetMax';
import RatioDisplay, { RatioDisplayTypes } from 'components/RatioDisplay';
import useMaker from 'hooks/useMaker';
import useLanguage from 'hooks/useLanguage';
import useAnalytics from 'hooks/useAnalytics';
import useValidatedInput from 'hooks/useValidatedInput';
import { multiply } from 'utils/bignumber';
import { formatCollateralizationRatio, formatter } from 'utils/ui';
import { getCurrency } from 'utils/cdp';
import { decimalRules } from '../../styles/constants';
import { getColor } from '../../styles/theme';
const { short } = decimalRules;

const Withdraw = ({ vault, reset }) => {
  const { trackBtnClick } = useAnalytics('Withdraw', 'Sidebar');
  const { lang } = useLanguage();
  const { maker } = useMaker();

  let {
    vaultType,
    liquidationRatio,
    collateralAvailableAmount,
    collateralTypePrice,
    collateralAmount,
    collateralValue,
    collateralValueForAmount,
    collateralAmountByValue,
    encumberedDebt: debtAmount
  } = vault;
  BigNumber.set({ ROUNDING_MODE: BigNumber.ROUND_DOWN });
  collateralAvailableAmount = collateralAvailableAmount.toBigNumber();
  collateralValue = collateralValue.toBigNumber();

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

  const symbol = collateralAmount?.symbol;

  const collateralAvailableValue = convertAmountToValue(
    collateralAvailableAmount
  );

  const [value, setAmount, onAmountChange, amountErrors] = useValidatedInput(
    '',
    {
      maxFloat: collateralAvailableValue,
      minFloat: 0,
      isFloat: true
    },
    {
      maxFloat: () => lang.action_sidebar.cdp_below_threshold
    }
  );

  const valueToWithdraw = value || BigNumber(0);
  const amountToWithdraw = convertValueToAmount(valueToWithdraw);

  const setMax = () => setAmount(formatter(collateralAvailableValue));

  const currency = getCurrency({ ilk: vaultType });

  const withdraw = () => {
    const d = amountToWithdraw
      .dividedBy(collateralAvailableAmount)
      .minus(BigNumber(1.0))
      .absoluteValue();
    const val = d.lt(BigNumber(0.001))
      ? collateralAvailableAmount
      : amountToWithdraw;
    maker
      .service('mcd:cdpManager')
      .wipeAndFree(vault.id, vaultType, USDFL(0), currency(val));
    reset();
  };

  const valueDiff = multiply(amountToWithdraw, collateralTypePrice.toNumber());

  const collateralizationRatio = vault.calculateCollateralizationRatio({
    collateralValue: collateralValue.minus(valueDiff).gte(0)
      ? currency(collateralValue.minus(valueDiff))
      : currency(0)
  });

  return (
    <Grid gridRowGap="m">
      <Grid gridRowGap="s" className="input_des">
        <Text style={{ fontSize: '20px', color: getColor('whiteText') }}>
          {lang.formatString(lang.action_sidebar.withdraw_title, symbol)}
        </Text>
        <Text
          style={{ fontSize: '16px', color: getColor('greyText') }}
          t="body"
        >
          {lang.formatString(lang.action_sidebar.withdraw_description, symbol)}
        </Text>
        <div className="input_border">
          <Input
            style={{ color: getColor('whiteText') }}
            type="number"
            placeholder={`0.00 USD`}
            value={value}
            min="0"
            onChange={onAmountChange}
            after={
              parseFloat(debtAmount) === 0 ? (
                <SetMax
                  style={{ color: getColor('greyText') }}
                  onClick={() => {
                    setMax();
                    trackBtnClick('SetMax', {
                      collateralAvailableAmount: collateralAvailableAmount.toString(),
                      setMax: true
                    });
                  }}
                />
              ) : null
            }
            failureMessage={amountErrors}
          />
        </div>
      </Grid>
      <Grid gridTemplateColumns="1fr 1fr" gridColumnGap="s">
        <Button
          className="btn_next"
          disabled={!value || amountErrors}
          onClick={() => {
            trackBtnClick('Confirm', {
              value,
              fathom: { id: `${symbol}VaultWithdraw`, value }
            });
            withdraw();
          }}
        >
          {lang.actions.withdraw}
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
          title={lang.action_sidebar.maximum_available_to_withdraw}
          body={`${formatter(collateralAvailableValue, {
            precision: short
          })} USD`}
        />
        <Info
          title={lang.action_sidebar.new_collateralization_ratio}
          body={
            <RatioDisplay
              type={RatioDisplayTypes.TEXT}
              ratio={formatter(collateralizationRatio)}
              ilkLiqRatio={formatter(liquidationRatio, { percentage: true })}
              text={formatCollateralizationRatio(collateralizationRatio)}
            />
          }
        />
      </InfoContainer>
    </Grid>
  );
};
export default Withdraw;
