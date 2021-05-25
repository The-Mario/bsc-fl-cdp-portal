import React, { useState } from 'react';
import {
  Flex,
  Text,
  Link,
  Card,
  Grid,
  Box
} from '@makerdao/ui-components-core';
import { ReactComponent as EthIcon } from 'images/tokens/icon-coin-eth.svg';
import { ReactComponent as BscIcon } from 'images/tokens/icon-coin-bnb.svg';

import useLanguage from 'hooks/useLanguage';
import { getColor } from 'styles/theme';

const TradeNav = ({ ...props }) => {
  const { lang } = useLanguage();
  return (
    <Box
      style={{
        textAlign: 'center'
      }}
    >
      <Text
        style={{
          color: getColor('greyText'),
          textAlign: 'center'
        }}
      >
        {lang.navbar.network}
      </Text>
      <Card
        style={{
          background: getColor('cardBg'),
          border: getColor('border'),
          padding: '3px',
          margin: '5px 2px 50px'
        }}
      >
        <Grid
          gridTemplateColumns="1fr 1fr"
          gridColumnGap="3px"
          gridRowGap="6px"
          padding="3px"
        >
          <Link>
            <Flex
              className="network_box"
              style={{
                background: getColor('cardBg')
              }}
            >
              <EthIcon className="network_img" />
            </Flex>
          </Link>
          <Link className="modalVideo">
            <Flex
              className="network_box"
              style={{
                background: '#222B3F'
              }}
            >
              <BscIcon className="network_img" />
            </Flex>
          </Link>
        </Grid>
      </Card>
    </Box>
  );
};

export default TradeNav;
