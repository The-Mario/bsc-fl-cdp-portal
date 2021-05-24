import React from 'react';
import { Link, useCurrentRoute } from 'react-navi';
import styled from 'styled-components';
import { Flex, Text } from '@makerdao/ui-components-core';

import { ReactComponent as SaveIcon } from 'images/landing/save_block.svg';
import { Routes } from '../utils/constants';
import useLanguage from 'hooks/useLanguage';

const StyledSaveIcon = styled(SaveIcon)`
  width: 40px;
  height: 30px;
`;

const SaveNav = ({ account, ...props }) => {
  const { lang } = useLanguage();
  const { url } = useCurrentRoute();
  const selected = url.pathname.startsWith(`/${Routes.SAVE}`);

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

  const saveUrl = account?.address
    ? `/${Routes.SAVE}/owner/${account?.address}${url.search}`
    : `/${Routes.SAVE}${url.search}`;
  return (
    <Link href={saveUrl}>
      <Flex
        bg={!account && selected && '#0B0E15'}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        py="s"
        {...props}
      >
        <StyledSaveIcon
          textcolor={textColor}
          opacity={iconColor}
          selected={selected}
          connected={account}
          
        />
        <Text t="p6" fontWeight="bold" color={textColor}>
          {lang.navbar.save}
        </Text>
      </Flex>
    </Link>
  );
};

export default SaveNav;
