import React, { useState, useEffect } from 'react';
import { Text, Input, Grid, Link, Button } from '@makerdao/ui-components-core';
import { ReactComponent as PasteIcon } from '../../images/paste.svg';
import styled from 'styled-components';
import usePrevious from '../../hooks/usePrevious';
import useMaker from '../../hooks/useMaker';
import useWalletBalances from '../../hooks/useWalletBalances';
import useValidatedInput from '../../hooks/useValidatedInput';
import useLanguage from 'hooks/useLanguage';
import BigNumber from 'bignumber.js';
import SetMax from '../SetMax';
import { isValidAddressString, calculateGasCost } from '../../utils/ethereum';
import { getColor } from 'styles/theme';

const PasteLink = styled(Link)``;

const StyledPaste = styled(PasteIcon)`
  margin-left: 4px;
  path {
    fill: ${getColor('greyText')};
  }
  ${PasteLink}:hover & {
    path {
      fill: ${getColor('greyText')};
    }
  }
`;


const ZERO = BigNumber(0);

const Send = ({ token, trackBtnClick, reset }) => {
  const { lang } = useLanguage();
  const { maker, account } = useMaker();

  const balances = useWalletBalances();
  const balance = balances[token] ? balances[token] : ZERO;
  const { address } = account || {};
  const [gasCost, setGasCost] = useState(ZERO);
  const [destAddress, setDestAddress] = useState('');

  const minAmount = token === 'ETH' ? gasCost : ZERO;
  const maxAmount = token === 'ETH' ? balance.minus(gasCost) : balance;

  const displayToken = token;

  const inRangeAndEth = _val =>
    token === 'ETH' && _val.gt(ZERO) && _val.lte(balance);

  const mapBN = cb => val => cb(BigNumber(val));

  const [amount, setAmount, onAmountChange, amountErrors] = useValidatedInput(
    '',
    {
      custom: {
        invalid: mapBN(val => val.isNaN()),
        minEth: mapBN(val => gasCost.gt(balance) && inRangeAndEth(val)),
        min: mapBN(val => val.lt(ZERO)),
        maxEth: mapBN(
          val => val.plus(gasCost).gt(balance) && inRangeAndEth(val)
        ),
        max: mapBN(val => val.gt(balance))
      }
    },
    {
      invalid: _ => lang.action_sidebar.invalid_input,
      minEth: _ =>
        lang.formatString(
          lang.action_sidebar.invalid_min_gas,
          `${gasCost} ${displayToken}`
        ),
      min: _ =>
        lang.formatString(lang.action_sidebar.invalid_min_amount, displayToken),
      maxEth: _ =>
        lang.formatString(
          lang.action_sidebar.invalid_max_gas,
          `${gasCost.plus(BigNumber(amount))} ${displayToken}`
        ),
      max: _ => lang.action_sidebar.invalid_max_amount
    }
  );

  const prevToken = usePrevious(token);
  const prevAddress = usePrevious(address);

  let isCancelled = false;
  const updateGasCost = async () => {
    const gasCost = await calculateGasCost(maker);
    if (isCancelled) return;
    setGasCost(gasCost);
  };

  useEffect(() => {
    if (prevToken !== token) {
      setAmount('');
      setGasCost(ZERO);
      setDestAddress('');
    }
    if (prevAddress && prevAddress !== address) reset();
    if (isCancelled) return;
    updateGasCost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => (isCancelled = true);
  }, [token, address, prevToken, prevAddress]);

  const setMax = async () => {
    await updateGasCost();
    setAmount(maxAmount);
  };

  const paste = async () => {
    const copiedAddress = await navigator.clipboard.readText();
    setDestAddress(copiedAddress);
  };

  const bnAmount = BigNumber(amount);
  const amountIsValid = bnAmount.gte(minAmount) && bnAmount.lte(maxAmount);

  const destAddressIsValid =
    destAddress === '' || isValidAddressString(destAddress);
  const destAddressFailureMessage = destAddressIsValid
    ? ''
    : lang.action_sidebar.invalid_address;

  const valid =
    amount !== '' && destAddress !== '' && amountIsValid && destAddressIsValid;

  const showSetMax = token !== 'ETH' || balance.gte(gasCost);

  const transfer = async () => {
    maker.getToken(token).transfer(destAddress, amount);
    reset();
  };

  const PasteAddress = props => (
    <PasteLink fontWeight="medium" {...props}>
      <Grid gridTemplateColumns="auto 1fr">
        {lang.paste}
        <StyledPaste />
      </Grid>
    </PasteLink>
  );

  return (
    <Grid gridRowGap="m">
      <Grid gridRowGap="s">
        <Text style={{ fontSize: '20px', color: getColor('whiteText') }}>
          {lang.formatString(lang.action_sidebar.send_title, displayToken)}
        </Text>

        <p>
          <Text style={{ fontSize: '16px', color: getColor('greyText') }}>
            {lang.formatString(
              lang.action_sidebar.send_description,
              displayToken
            )}
          </Text>
        </p>
        <div className="input_border">
        <Input
          style={{ color: getColor('whiteText')}}
          type="number"
          min="0"
          value={amount}
          onChange={onAmountChange}
          onFocus={e => {
            const tmp = e.target.value;
            e.target.value = '';
            e.target.value = tmp;
          }}
          placeholder={`0.00 ${displayToken}`}
          after={<>{showSetMax && <SetMax onClick={setMax} style={{ color: getColor('greyText') }} />}</>}
          failureMessage={amountErrors}
          data-testid="send-amount-input"
        />
        </div>
        <Grid gridTemplateColumns="auto 1fr" gridColumnGap="s" alignItems="end">
          <Text
            style={{ fontSize: '12px', color: getColor('greyText') }}
            fontWeight="semibold"
            t="smallCaps"
          >
            {lang.action_sidebar.your_balance}
          </Text>
          <Text style={{ color: getColor('whiteText') }}>
            {(balance && balance.toFixed(10)) || '--'} {displayToken}
          </Text>
        </Grid>

        <p>
          <Text style={{ fontSize: '14px', color: getColor('greyText') }}>
            {lang.formatString(lang.action_sidebar.dest_address, displayToken)}
          </Text>
        </p>
        <div className="input_border">
        <Input
          style={{ color: getColor('whiteText'), borderColor: getColor('boder'), }}
          type="text"
          value={destAddress}
          onChange={evt => setDestAddress(evt.target.value)}
          onFocus={e => {
            const tmp = e.target.value;
            e.target.value = '';
            e.target.value = tmp;
          }}
          placeholder="0x..."
          after={<PasteAddress onClick={paste} style={{ color: getColor('greyText') }} />}
          failureMessage={destAddressFailureMessage}
          data-testid="send-address-input"
        />
        </div>
        <Grid gridTemplateColumns="1fr 1fr" gridColumnGap="s" mt="m">
          <Button className="btn"
            onClick={() => {
              if (trackBtnClick)
                trackBtnClick('WalletSend', {
                  collateral: displayToken,
                  amount
                });
              transfer();
            }}
            disabled={!valid}
            data-testid="send-button"
          >
            {lang.actions.send}
          </Button>
          <Button className="btn" variant="secondary-outline" onClick={reset}>
            {lang.cancel}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Send;
