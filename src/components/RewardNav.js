import React from 'react';
import { Link, useCurrentRoute } from 'react-navi';
import styled from 'styled-components';
import { Flex, Text } from '@makerdao/ui-components-core';

import { ReactComponent as RewardIcon } from 'images/landing/reward_nav.svg';
import { Routes } from '../utils/constants';
import useLanguage from 'hooks/useLanguage';

const StyledRewardIcon = styled(RewardIcon)`
  width: 30px;
  height: 30px;
  text-align: center;
`;

const RewardNav = ({ account, ...props }) => {
  const { lang } = useLanguage();
  const { url } = useCurrentRoute();
  const selected = url.pathname.startsWith(`/${Routes.REWARD}`);

  const textColor =
    selected && account
      ? '#F3F3F5'
      : !selected && account
      ? '#6F7A96'
      : selected && !account
      ? '#6F7A96'
      : '#6F7A96';

  const iconColor =
      selected && account
        ? '1'
        : !selected && account
        ? '0.35'
        : selected && !account
        ? '1'
        : '0.5';

  const rewardUrl = `/${Routes.REWARD}/owner/${account?.address}${url.search}`;
  return (
    <Link href={rewardUrl}>
      <Flex
        bg={!account && selected && '#0B0E15'}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        py="s"
        {...props}
      >
        <StyledRewardIcon
          textcolor={textColor}
          opacity={iconColor}
          selected={selected}
          connected={account}
          
        />
        <Text t="p6" fontWeight="bold" color={textColor}>
          {lang.navbar.reward}
        </Text>
      </Flex>
    </Link>
  );
};

export default RewardNav;
