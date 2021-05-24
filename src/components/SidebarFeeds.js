import React, { useState } from 'react';
import { Text, Card, Flex, Link, CardBody } from '@makerdao/ui-components-core';
import { formatter } from 'utils/ui';
import Carat from './Carat';
import styled from 'styled-components';
import { ReactComponent as ExternalLinkIcon } from 'images/external-link.svg';
import useLanguage from 'hooks/useLanguage';
import BigNumber from 'bignumber.js';
import { getColor } from 'styles/theme';

const StyledCardBody = styled(CardBody)`
  cursor: pointer;
`;

const SidebarFeeds = ({ feeds }) => {
  const [collapsed, setCollapsed] = useState(true);
  const { lang } = useLanguage();

  return (
    <Card
      pt="sm"
      style={{
        background: getColor('cardBg'),
        borderColor: getColor('border')
      }}
    >
      <Flex justifyContent="space-between" alignContent="center" px="s" pt="">
        <Text t="h4" style={{color: getColor('whiteText')}}>
          {lang.sidebar.price_feeds}
        </Text>
        <Link href={'https://makerdao.com/feeds'} target="_blank">
          <Text t="p5" color="#00DCDC" fontSize="s2">
            {lang.sidebar.view_price_feeds}
          </Text>
          &nbsp;
          <ExternalLinkIcon fill="#00DCDC" />
        </Link>
      </Flex>

      <CardBody mt="s2">
        {feeds &&
          Object.values(
            feeds.reduce(
              (acc, price) => ({
                ...acc,
                [price.symbol]: price
              }),
              {}
            )
          ).map(
            (value, index) =>
              (!collapsed || index < 4) && (
                <Flex
                  key={`feed_${index}`}
                  justifyContent="space-between"
                  alignItems="baseline"
                  width="100%"
                  py="xs"
                  px="s"
                  bg={index % 2 ? '#131824' : '#1c2334'}
                  color="#A3B2CF"
                >
                  <Text fontWeight="semibold" t="smallCaps" color="#A3B2CF">
                    {value.symbol
                      .split('/')
                      .reverse()
                      .join('/')}
                  </Text>
                  <Text fontSize="1.4rem" style={{color: getColor('greyText')}}>
                    {`${formatter(value, {
                      rounding: BigNumber.ROUND_HALF_UP
                    })} ${value.symbol}`}
                  </Text>
                </Flex>
              )
          )}
      </CardBody>
      {feeds && feeds.length > 4 && (
        <StyledCardBody p="s" onClick={() => setCollapsed(!collapsed)}>
          <Flex justifyContent="center" alignItems="center">
            {collapsed ? (
              <>
                <Text pr="xs" color="#00DCDC">
                  {lang.sidebar.view_more}
                </Text>
                <Carat />
              </>
            ) : (
              <>
                <Text pr="xs" color="#00DCDC">
                  {lang.sidebar.view_less}
                </Text>
                <Carat rotation={180} />
              </>
            )}
          </Flex>
        </StyledCardBody>
      )}
    </Card>
  );
};

export default SidebarFeeds;
