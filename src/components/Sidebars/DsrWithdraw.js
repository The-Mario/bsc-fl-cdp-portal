import React, { useState, useCallback } from 'react';
import { Text, Input, Grid, Button } from '@makerdao/ui-components-core';
import Info from './shared/Info';
import InfoContainer from './shared/InfoContainer';
import useMaker from 'hooks/useMaker';
import useTokenAllowance from 'hooks/useTokenAllowance';
import useWalletBalances from 'hooks/useWalletBalances';
import useValidatedInput from 'hooks/useValidatedInput';
import useLanguage from 'hooks/useLanguage';
import useAnalytics from 'hooks/useAnalytics';
import ProxyAllowanceToggle from 'components/ProxyAllowanceToggle';
import { USDFL } from '../../libs/dai-plugin-mcd/src/index.js';
import SetMax from 'components/SetMax';
import { BigNumber } from 'bignumber.js';
import { safeToFixed } from '../../utils/ui';
import { getColor } from '../../styles/theme';

const DsrWithdraw = ({ savings, reset }) => {
  const { trackBtnClick } = useAnalytics('Withdraw', 'Sidebar');
  const { lang } = useLanguage();
  const { maker } = useMaker();

  const displaySymbol = USDFL.symbol;

  const { daiLockedInDsr } = savings;
  const { USDFL: daiBalance } = useWalletBalances();
  const { hasAllowance, hasSufficientAllowance } = useTokenAllowance(
    USDFL.symbol
  );
  const [withdrawMaxFlag, setWithdrawMaxFlag] = useState(false);

  const [
    withdrawAmount,
    setWithdrawAmount,
    onWithdrawAmountChange,
    withdrawAmountErrors
  ] = useValidatedInput(
    '',
    {
      isFloat: true,
      minFloat: 0.0,
      maxFloat: daiLockedInDsr && daiLockedInDsr.toNumber(),
      custom: {
        allowanceInvalid: value => !hasSufficientAllowance(value)
      }
    },
    {
      maxFloat: () =>
        lang.formatString(
          lang.action_sidebar.insufficient_balance,
          displaySymbol
        ),
      allowanceInvalid: () =>
        lang.formatString(lang.action_sidebar.invalid_allowance, displaySymbol)
    }
  );

  const setWithdrawMax = useCallback(() => {
    if (daiLockedInDsr && !daiLockedInDsr.eq(0)) {
      setWithdrawAmount(daiLockedInDsr.toFixed(18).replace(/\.?0+$/, ''));
      setWithdrawMaxFlag(true);
    } else {
      setWithdrawAmount('');
    }
  }, [daiLockedInDsr, setWithdrawAmount]);

  const withdraw = () => {
    if (withdrawMaxFlag || new BigNumber(withdrawAmount).eq(daiLockedInDsr)) {
      maker.service('mcd:savings').exitAll();
    } else {
      maker.service('mcd:savings').exit(USDFL(withdrawAmount));
    }
    reset();
  };

  const valid = withdrawAmount && !withdrawAmountErrors && hasAllowance;

  return (
    <Grid gridRowGap="m">
      <Grid gridRowGap="s">
        <Text style={{ fontSize: '20px', color: getColor('whiteText') }}>
          {lang.formatString(lang.action_sidebar.withdraw_title, displaySymbol)}
        </Text>
        <Text.p style={{ fontSize: '16px', color: getColor('greyText') }}>
          {lang.formatString(
            lang.action_sidebar.withdraw_description,
            displaySymbol
          )}
        </Text.p>
        <div className="input_border">
        <Input
          style={{ color: getColor('whiteText') }}
          disabled={!hasAllowance}
          type="number"
          min="0"
          placeholder="0 USDFL"
          value={withdrawAmount}
          onChange={e => {
            if (withdrawMaxFlag) setWithdrawMaxFlag(false);
            onWithdrawAmountChange(e);
          }}
          error={withdrawAmountErrors}
          failureMessage={withdrawAmountErrors}
          after={
            <SetMax
              onClick={() => {
                setWithdrawMax();
                trackBtnClick('SetMax', {
                  amount: withdrawAmount,
                  setMax: true
                });
              }}
            />
          }
        />
        </div>
      </Grid>
      <ProxyAllowanceToggle
        token="USDFL"
        onlyShowAllowance={true}
        trackBtnClick={trackBtnClick}
      />
      <Grid gridTemplateColumns="1fr 1fr" gridColumnGap="s">
        <Button className="btn"
          disabled={!valid}
          onClick={() => {
            trackBtnClick('Confirm', {
              amount: withdrawAmount,
              fathom: { id: 'saveWithdraw', amount: withdrawAmount }
            });
            withdraw();
          }}
          data-testid={'withdraw-button'}
        >
          {lang.actions.withdraw}
        </Button>
        <Button className="btn"
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
          body={`${safeToFixed(daiBalance, 7)} ${displaySymbol}`}
        />
        <Info
          title={lang.action_sidebar.locked_dsr}
          body={`${safeToFixed(daiLockedInDsr.toNumber(), 7)} ${displaySymbol}`}
        />
      </InfoContainer>
    </Grid>
  );
};
export default DsrWithdraw;
