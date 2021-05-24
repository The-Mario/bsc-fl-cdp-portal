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

const DepositLPReward = ({ avail, availValue, name, gem, hiRisk, reset }) => {
  const { lang } = useLanguage();
  const { maker } = useMaker();

  const usdPrice = watch.rewardPairInfoGetPrice(name, hiRisk) || BigNumber(0);

  console.log(
    'DepositLPReward',
    usdPrice.toNumber(),
    avail ? avail.toNumber() : 0,
    availValue ? availValue.toNumber() : 0,
    name,
    gem,
    hiRisk
  );

  function convertValueToAmount(value) {
    const WAD = new BigNumber('1e18');
    if (value == 0) return BigNumber(0);
    const r = new BigNumber(value).times(WAD).dividedBy(usdPrice);

    if (r == undefined) return BigNumber(0);
    return r;
  }
  function checkX2(arr, val) {
    return arr.some(function (arrVall) {
      return val === arrVall;
    });
  }

  const availValueX2 = checkX2(rewardListx2, name) ? availValue / 2 : availValue;

  const [value, , onAmountChange, amountErrors] = useValidatedInput(
    availValueX2,
    {
      maxFloat: availValueX2,
      minFloat: 0,
      isFloat: true
    },
    {
      maxFloat: () =>
        lang.formatString(lang.action_sidebar.insufficient_balance, name)
    }
  );

  const valueToDeposit = checkX2(rewardListx2, name) ? (value * 2 || BigNumber(0)) : (value || BigNumber(0));
  console.log('valueToDeposit', valueToDeposit);
  const amountToDeposit = convertValueToAmount(valueToDeposit);

  console.log('amount', amountToDeposit.toNumber());
  console.log('avail', new Currency(avail).toFixed('wei'));

  const valid = value && !amountErrors;

  const deposit = () => {
    if (amountToDeposit.toNumber() > new Currency(avail).toFixed('wei')) {
      depositAll();
    } else {
      const v = amountToDeposit.integerValue(BigNumber.ROUND_DOWN).toFixed();
      console.log('deposit', name, gem, amountToDeposit.toNumber(), v, hiRisk);
      maker.service('mcd:rewards').lockPool(v, gem, hiRisk);
      reset();
    }
  };

  const depositAll = () => {
    const c = new Currency(avail);
    const v = c.toFixed('wei');
    console.log('depositAll', name, gem, avail.toNumber(), v, hiRisk);
    maker.service('mcd:rewards').lockPool(v, gem, hiRisk);
    reset();
  };

  return (
    <Grid gridRowGap="m">
      <Grid gridRowGap="s">
        <Text style={{ fontSize: '20px', color: getColor('whiteText') }}>
          {lang.formatString(lang.action_sidebar.deposit_title, name)}
        </Text>
        <p>
          <Text style={{ fontSize: '16px', color: getColor('greyText') }}>
            {lang.formatString(lang.action_sidebar.deposit_description, name)}
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

      <Grid gridTemplateColumns="1fr" gridColumnGap="m" gridRowGap="s">
        <Button
          className="btn"
          disabled={!valid}
          onClick={() => {
            deposit();
          }}
        >
          {lang.actions.deposit}
        </Button>
        <Button
          className="btn"
          onClick={() => {
            depositAll();
          }}
        >
          {lang.actions.depositAll}
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
          title={lang.action_sidebar.current_account_balance}
          body={`${formatter(availValueX2)} USD`}
        />
      </InfoContainer>
    </Grid>
  );
};
export default DepositLPReward;
