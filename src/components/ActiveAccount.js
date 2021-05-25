import React from 'react';
import { Flex, Text, Box } from '@makerdao/ui-components-core';

import { getWebClientProviderName } from 'utils/web3';
import { cutMiddle } from 'utils/ui';
import useLanguage from 'hooks/useLanguage';

import CaratDownIcon from 'components/Carat';

const ActiveAccount = ({
  address,
  type,
  textColor = '#F0B90B',
  walletColor = '#F3F3F5',
  t = 'body',
  addressTextStyle = 'body',
  readOnly,
  ...rest
}) => {
  const { lang } = useLanguage();
  const providerType =
    type === 'browser' ? getWebClientProviderName(type) : type;
  return (
    <Flex justifyContent="space-between" alignItems="center" {...rest}>
      <Text fontSize="1.8rem" color={address ? '#F0B90B' : '#A3B2CF'}>
        ●
      </Text>

      <Box ml="xs" mr="auto">
        <Text t={t} fontSize="m" color={walletColor}>
          {address ? lang.providers[providerType] : lang.sidebar.no_wallet}
        </Text>
      </Box>
      <Box ml="s">
        {address ? (
          <Text t={addressTextStyle} color={textColor} fontSize="1.4rem">
            {cutMiddle(address, 7, 5)}
          </Text>
        ) : null}
      </Box>
      {readOnly ? null : (
        <Box ml="xs" mb="2px">
          <CaratDownIcon width="11px" height="6px" />
        </Box>
      )}
    </Flex>
  );
};

export default ActiveAccount;
