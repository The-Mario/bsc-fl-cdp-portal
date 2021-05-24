import React from 'react';
import { Text, Input, Grid, Button } from '@makerdao/ui-components-core';
import Info from './shared/Info';
import InfoContainer from './shared/InfoContainer';
import useMaker from 'hooks/useMaker';
import useValidatedInput from 'hooks/useValidatedInput';
import useLanguage from 'hooks/useLanguage';
import { formatter } from 'utils/ui';
import BigNumber from 'bignumber.js';
import { getColor } from '../../styles/theme';
import { watch } from 'hooks/useObservable';
import { Currency } from '@makerdao/currency';
import rewardListx2 from '../../references/rewardListX2';

const WithdrawLPReward = ({
  locked,
  lockedValue,
  name,
  gem,
  hiRisk,
  reset
}) => {
  const { lang } = useLanguage();
  const { maker } = useMaker();

  const usdPrice = watch.rewardPairInfoGetPrice(name, hiRisk) || BigNumber(0);

  console.log(
    'WithdrawLPReward',
    usdPrice.toNumber(),
    locked ? locked.toNumber() : 0,
    lockedValue ? lockedValue.toNumber() : 0,
    name,
    gem,
    hiRisk
  );

  function convertValueToAmount(value) {
    const WAD = new BigNumber('1e18');
    if (value === 0) return BigNumber(0);
    const r = new BigNumber(value).times(WAD).dividedBy(usdPrice);

    if (r === undefined) return BigNumber(0);
    return r;
  }

  function checkX2(arr, val) {
    return arr.some(function (arrVall) {
      return val === arrVall;
    });
  }

  const lockedValueX2 = checkX2(rewardListx2, name) ? lockedValue / 2 : lockedValue;

  const [value, , onAmountChange, amountErrors] = useValidatedInput(
    lockedValueX2,
    {
      maxFloat: lockedValueX2,
      minFloat: 0,
      isFloat: true
    },
    {
      maxFloat: () =>
        lang.formatString(lang.action_sidebar.cdp_below_threshold, name)
    }
  );

  const valueToWithdraw = checkX2(rewardListx2, name) ? (value * 2 || BigNumber(0)) : (value || BigNumber(0));
  const amountToWithdraw = convertValueToAmount(valueToWithdraw);

  const valid = value && !amountErrors;

  const withdraw = () => {
    if (amountToWithdraw.toNumber() > new Currency(locked).toFixed('wei')) {
      withdrawAll();
    }
    else {
      const v = amountToWithdraw.integerValue(BigNumber.ROUND_DOWN).toFixed();
      console.log('withdraw', name, gem, amountToWithdraw.toNumber(), v, hiRisk);
      maker.service('mcd:rewards').unlockPool(v, gem, hiRisk);
      reset();
    }
  };

  const withdrawAll = () => {
    const c = new Currency(locked);
    const v = c.toFixed('wei');
    console.log('withdrawAll', name, gem, locked.toNumber(), v, hiRisk);
    maker.service('mcd:rewards').unlockPool(v, gem, hiRisk);
    reset();
  };

  return (
    <Grid gridRowGap="m">
      <Grid gridRowGap="s">
        <Text style={{ fontSize: '20px', color: getColor('whiteText') }}>
          {lang.formatString(lang.action_sidebar.withdraw_title, name)}
        </Text>
        <p>
          <Text style={{ fontSize: '16px', color: getColor('greyText') }}>
            {lang.formatString(lang.action_sidebar.withdraw_description, name)}
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
            data-testid="withdraw-input"
          />
        </div>
      </Grid>

      <Grid gridTemplateColumns="1fr" gridColumnGap="s" gridRowGap="s">
        <Button
          className="btn"
          disabled={!valid}
          onClick={() => {
            withdraw();
          }}
        >
          {lang.actions.withdraw}
        </Button>
        <Button
          className="btn"
          onClick={() => {
            withdrawAll();
          }}
        >
          {lang.actions.withdrawAll}
        </Button>
        <Button
          className="btn"
          variant="secondary-outline"
          onClick={() => {
            reset();
          }}
        >
          {lang.cancel}
        </Button>
      </Grid>
      <InfoContainer>
        <Info
          title={lang.action_sidebar.maximum_available_to_withdraw}
          body={`${formatter(lockedValueX2)} USD`}
        />
      </InfoContainer>
    </Grid>
  );
};
export default WithdrawLPReward;
