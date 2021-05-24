import React, { useState, useRef, useEffect } from 'react';
import styled, { css } from 'styled-components';
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks
} from 'body-scroll-lock';

import SidebarGlobal from './Sidebars/Global';
import AccountBox from './AccountBox';
import BorrowNav from 'components/BorrowNav';

import { Flex, Box } from '@makerdao/ui-components-core';
import useMaker from 'hooks/useMaker';
import { getMeasurement } from '../styles/theme';

import { ReactComponent as MoreOpenIcon } from 'images/menu-more.svg';
import { ReactComponent as MoreCloseIcon } from 'images/menu-more-close.svg';
import { ReactComponent as MoreCloseDarkIcon } from 'images/menu-more-close-dark.svg';

const SidebarDrawerTrigger = ({
  sidebarDrawerOpen,
  setSidebarDrawerOpen,
  account
}) => {
  const closeIcon = !account ? <MoreCloseDarkIcon /> : <MoreCloseIcon />;
  return (
    <Box
      ml="auto"
      p="s"
      onClick={() => setSidebarDrawerOpen(!sidebarDrawerOpen)}
    >
      {sidebarDrawerOpen ? closeIcon : <MoreOpenIcon />}
    </Box>
  );
};

const DrawerBg = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  top: ${getMeasurement('mobileNavHeight')}px;
  width: 100vw;
  z-index: 9;
  height: 100%;
  ${({ sidebarDrawerOpen }) =>
    sidebarDrawerOpen
      ? css`
          display: flex;
        `
      : css`
          display: none;
        `}
`;

const MobileNav = ({ viewedAddress }) => {
  const { account } = useMaker();
  const ref = useRef();
  const [sidebarDrawerOpen, setSidebarDrawerOpen] = useState(false);

  useEffect(() => {
    if (sidebarDrawerOpen) {
      ref && ref.current && disableBodyScroll(ref.current);
    } else {
      ref && ref.current && enableBodyScroll(ref.current);
    }
    return clearAllBodyScrollLocks;
  }, [sidebarDrawerOpen]);

  useEffect(() => {
    if (account) {
      setSidebarDrawerOpen(false);
    }
  }, [account]);

  return (
    <Flex
      justifyContent="center"
      bg={account ? '#131824' : '#131824'}
      height={getMeasurement('mobileNavHeight')}
    >
      <Flex flex="1" alignItems="center" justifyContent="flex-start">
        <BorrowNav
          width={`${getMeasurement('mobileNavbarWidth')}px`}
          viewedAddress={viewedAddress}
          account={account}
          mobile={true}
          borderRadius="4px"
          ml="xs"
        />
      </Flex>
      <Flex alignItems="center" justifyContent="center">
        <SidebarDrawerTrigger
          {...{ sidebarDrawerOpen, setSidebarDrawerOpen, account }}
        />
      </Flex>

      <DrawerBg sidebarDrawerOpen={sidebarDrawerOpen}>
        <Box
          ref={ref}
          ml="auto"
          height="100vh"
          px="s"
          width="100vw"
          css={{ overflowY: 'scroll', paddingRight: 0 }}
          bg={account ? '#0B0E15' : '#0B0E15'}
        >
          <Box mr="s">
            <Box my="s">
              <AccountBox
                currentAccount={account}
                closeSidebarDrawer={() => setSidebarDrawerOpen(false)}
              />
            </Box>
            <SidebarGlobal />
          </Box>
        </Box>
      </DrawerBg>
    </Flex>
  );
};

export default MobileNav;
