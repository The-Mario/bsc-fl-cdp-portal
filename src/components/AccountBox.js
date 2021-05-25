import React, { useState, useCallback, useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { Box, Text, Card, CardBody, Flex } from '@makerdao/ui-components-core';
import { getColor, getSpace } from 'styles/theme';
import ActiveAccount from 'components/ActiveAccount';
import StripedRows from 'components/StripedRows';
import WalletConnectDropdown from 'components/WalletConnectDropdown';
import useWalletBalances from 'hooks/useWalletBalances';
import useLanguage from 'hooks/useLanguage';
import { showWalletTokens } from 'references/config';
import { prettifyNumber } from 'utils/ui';
import useCdpTypes from '../hooks/useCdpTypes';
import { watch } from 'hooks/useObservable';

const TokenBalance = ({
  symbol,
  amount,
  usdRatio,
  button,
  hasActiveAccount,
  ...props
}) => {
  return (
    <Flex
      key={`wb_${symbol}`}
      justifyContent="space-between"
      alignItems="center"
      px="s"
      py="xs"
      {...props}
    >
      <Text fontWeight="semibold" t="p5" textAlign="left" width="70%">
        {symbol}
      </Text>
      <Text fontWeight="semibold" t="p5" textAlign="left" width="30%">
        {(hasActiveAccount &&
          amount &&
          usdRatio &&
          `$ ${prettifyNumber(
            amount.times(usdRatio.toNumber()),
            { truncate: true },
            2
          )}`) ||
          '--'}
      </Text>
    </Flex>
  );
};

const WalletBalances = ({ hasActiveAccount, closeSidebarDrawer }) => {
  const { lang } = useLanguage();

  const balances = useWalletBalances();

  const { cdpTypesList } = useCdpTypes();
  const prices = watch.collateralTypesPrices(cdpTypesList);
  const uniqueFeeds = useMemo(
    () =>
      prices
        ? prices.reduce((acc, price) => {
            const [, symbol] = price.symbol.split('/');
            acc[symbol] = price;
            return acc;
          }, {})
        : {},
    [prices]
  );

  const tokenBalances = useMemo(
    () =>
      showWalletTokens.reduceRight((acc, token) => {
        const balanceGtZero = !!(balances[token] && balances[token].gt(0));
        if (token !== 'ETH' && token !== 'USDFL' && !balanceGtZero) return acc;
        const symbol = token;

        const tokenIsDaiOrDsr =
          token === 'USDFL' || token === 'SAI' || token === 'DSR';
        const usdRatio = tokenIsDaiOrDsr
          ? new BigNumber(1)
          : token === 'WETH'
          ? uniqueFeeds['ETH']
          : uniqueFeeds[token];
        return [
          {
            token,
            amount: balances[token],
            symbol,
            usdRatio
          },
          ...acc
        ];
      }, []),
    [balances, uniqueFeeds]
  );

  return (
    <>
      <CardBody
        style={{
          background: getColor('cardBg'),
          borderColor: getColor('border'),
          color: getColor('whiteText')
        }}
      >
        <Box px="s" pt="sm" pb="s2">
          <Text t="large">{lang.sidebar.wallet_balances}</Text>
        </Box>
        <Flex justifyContent="space-between" px="s" mb="4px">
          <Text color="steel" fontWeight="bold" t="smallCaps" width="70%">
            {lang.sidebar.asset}
          </Text>
          <Text color="steel" fontWeight="bold" t="smallCaps" width="30%">
            {lang.sidebar.balance}
          </Text>
        </Flex>

        <StripedRows>
          {tokenBalances.map(({ amount, symbol, usdRatio }, idx) => (
            <TokenBalance
              key={`tokenbalance_${idx}`}
              symbol={symbol}
              amount={amount}
              usdRatio={usdRatio}
              hasActiveAccount={hasActiveAccount}
            />
          ))}
        </StripedRows>
      </CardBody>
    </>
  );
};

function AccountBox({ currentAccount, closeSidebarDrawer }) {
  const [open, setOpen] = useState(false);
  const toggleDropdown = useCallback(() => setOpen(!open), [open, setOpen]);
  const closeDropdown = useCallback(() => setOpen(false), [setOpen]);
  const address = currentAccount ? currentAccount.address : null;
  const type = currentAccount ? currentAccount.type : null;

  return (
    <Card
      style={{
        background: getColor('cardBg'),
        borderColor: getColor('border'),
        color: getColor('cayn')
      }}
    >
      <CardBody p="s">
        <WalletConnectDropdown
          show={open}
          offset={`-${getSpace('s') + 1}, 0`}
          openOnHover={false}
          onClick={toggleDropdown}
          close={closeDropdown}
          trigger={<ActiveAccount address={address} type={type} />}
        />
      </CardBody>
      <WalletBalances
        hasActiveAccount={!!currentAccount}
        closeSidebarDrawer={closeSidebarDrawer}
      />
    </Card>
  );
}

export default AccountBox;
