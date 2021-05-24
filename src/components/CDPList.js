import debounce from 'lodash.debounce';
import React, {
  memo,
  useEffect,
  useState,
  useRef,
  useMemo,
  Fragment
} from 'react';
import styled from 'styled-components';
import { ReactComponent as Plus } from '../images/plus.svg';
import { Flex, Text, Box } from '@makerdao/ui-components-core';
import RatioDisplay from './RatioDisplay';
import { Link, useCurrentRoute } from 'react-navi';
import useModal from 'hooks/useModal';
import useMaker from 'hooks/useMaker';
import useAnalytics from 'hooks/useAnalytics';
import { Routes } from '../utils/constants';
import { getMeasurement } from '../styles/theme';
import lang from 'languages';
import useVaults from 'hooks/useVaults';
import { watch } from 'hooks/useObservable';

const NavbarItemContent = ({ children, ...props }) => (
  <Flex
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    borderRadius="default"
    {...props}
  >
    {children}
  </Flex>
);

const NavbarItem = ({ href, active, trackBtnClick, ...props }) => {
  return (
    <Link
      href={href}
      active={active}
      prefetch={true}
      onClick={trackBtnClick}
      css={`
        display: block;
      `}
      {...props}
    >
      <NavbarItemContent {...props} />
    </Link>
  );
};

const AddCdpButton = ({ account, show, mobile }) => {
  const { trackBtnClick } = useAnalytics('NavBar');
  return (
    <Flex
      onClick={() => {
        trackBtnClick('CreateNew');
        account &&
          show({ modalType: 'cdpcreate', modalTemplate: 'fullscreen' });
      }}
      width={mobile && `${getMeasurement('navbarItemWidth')}px`}
      mx={mobile && '7px'}
      mt={mobile && '15px'}
      justifyContent="center"
      borderRadius="4px"
      py="s"
      css={`
        cursor: pointer;
      `}
    >
      <Plus />
    </Flex>
  );
};

const DirectionalButton = styled(NavbarItemContent)`
  height: 25px;
  cursor: pointer;
  visibility: ${props => (props.show ? 'visible' : 'hidden')};
`;

const CdpContainer = styled(Flex)`
  cursor: pointer;
  flex-direction: ${props => (props.mobile ? 'row' : 'column')};
  flex-wrap: ${props => (props.mobile ? 'wrap' : undefined)};
  overflow: auto;
`;

const CDPList = memo(function({
  currentPath,
  viewedAddress,
  currentQuery,
  mobile
}) {
  const { url } = useCurrentRoute();
  const [listOpen, setListOpen] = useState(false);
  const { maker, account } = useMaker();
  const { userVaults } = useVaults();
  const [overviewPath, setOverviewPath] = useState(currentPath);
  const { trackBtnClick } = useAnalytics('NavBar');
  const active = currentPath === overviewPath;
  const emergencyShutdownActive = watch.emergencyShutdownActive();

  useMemo(() => {
    const onSavePage = url.pathname.startsWith(`/${Routes.SAVE}`);
    if (onSavePage) {
      setListOpen(false);
    } else if (!onSavePage && (account || viewedAddress)) {
      setListOpen(true);
    }
  }, [account, url, viewedAddress]);

  useEffect(() => {
    if (account) {
      setOverviewPath(`/${Routes.BORROW}/owner/${account.address}`);
    } else if (viewedAddress) {
      setOverviewPath(`/${Routes.BORROW}/owner/${viewedAddress}`);
    }
  }, [maker, account, viewedAddress, setOverviewPath]);

  const [scrollPosition, setScrollPosition] = useState({
    scrollTop: 0,
    maxScrollTop: 1
  });
  const { scrollTop } = scrollPosition;

  const cdpContainerRef = useRef(null);

  const handleOnScroll = () => {
    const maxScrollTop =
      cdpContainerRef.current.scrollHeight -
      cdpContainerRef.current.clientHeight;

    setScrollPosition({
      ...scrollPosition,
      scrollTop: cdpContainerRef.current.scrollTop,
      maxScrollTop
    });
  };

  const debounced = debounce(handleOnScroll, 100);

  const onDirectionalClick = direction => {
    const scrollAmount =
      userVaults && cdpContainerRef.current.scrollHeight / userVaults.length;
    const maxScrollTop =
      cdpContainerRef.current.scrollHeight -
      cdpContainerRef.current.clientHeight;

    setScrollPosition({
      ...scrollPosition,
      scrollAmount
    });
    let newPosition =
      direction === 'up' && scrollAmount
        ? scrollTop - scrollAmount
        : scrollTop + scrollAmount;
    if (newPosition < 0) newPosition = 0;
    if (newPosition > maxScrollTop) newPosition = maxScrollTop;
    setScrollPosition({
      ...scrollPosition,
      scrollTop: newPosition,
      maxScrollTop
    });
    cdpContainerRef.current.scrollTop = newPosition;
  };

  const { show } = useModal();

  const getBgColor = (active, account) =>
    active && account
      ? '#222B3F'
      : !active && account
      ? '#191E2B'
      : active && !account
      ? 'cardBg'
      : 'cardBg';

  return listOpen && userVaults ? (
    <Fragment>
      {userVaults.length >= 4 && !mobile && (
        <DirectionalButton
          onClick={() => onDirectionalClick('up')}
          show={scrollTop > 0}
          bg={account ? '#191E2B' : '#191E2B'}
        >
        </DirectionalButton>
      )}
      <Box
        bg={mobile ? '#131824' : '#131824'}
        height="100%"
        width={mobile ? '100vw' : `${getMeasurement('navbarWidth')}px`}
        px={mobile ? '15px' : '5px'}
        pb={mobile && '15px'}
      >
        <CdpContainer
          onScroll={debounced}
          ref={cdpContainerRef}
          cdpsLength={userVaults.length}
          mobile={mobile}
          pb="5px"
        >
          <NavbarItem
            key={userVaults.length * 10}
            href={overviewPath + currentQuery}
            mx={mobile && '7px'}
            mt={mobile ? '15px' : '5px'}
            bg={getBgColor(active, account)}
            height={`${getMeasurement('navbarItemHeight')}px`}
            width={`${getMeasurement('navbarItemWidth')}px`}
            trackBtnClick={() => trackBtnClick('SelectOverview')}
          >
            <Text
              t="p6"
              fontWeight="bold"
              color={account ? '#DEDFE7' : '#DEDFE7'}
            >
              {lang.overview}
            </Text>
          </NavbarItem>
          {userVaults.map(
            ({ id, liquidationRatio, collateralizationRatio, vaultType }) => {
              const linkPath = `/${Routes.BORROW}/${id}`;
              const active = currentPath === linkPath;
              return (
                <NavbarItem
                  key={id}
                  href={linkPath + currentQuery}
                  mx={mobile && '7px'}
                  mt={mobile ? '15px' : '5px'}
                  bg={getBgColor(active, account)}
                  height={`${getMeasurement('navbarItemHeight')}px`}
                  width={`${getMeasurement('navbarItemWidth')}px`}
                  trackBtnClick={() =>
                    trackBtnClick('SelectVault', {
                      collateral: vaultType,
                      id
                    })
                  }
                >
                  <Text
                    t="p6"
                    fontWeight="bold"
                    color={account ? '#A3B2CF' : '#F3F3F5'}
                  >
                    {vaultType}
                  </Text>
                  <RatioDisplay
                    fontSize="1.3rem"
                    ratio={collateralizationRatio
                      .toBigNumber()
                      .dp(2)
                      .times(100)}
                    ilkLiqRatio={liquidationRatio
                      .toBigNumber()
                      .dp(2)
                      .times(100)}
                    active={active}
                  />
                </NavbarItem>
              );
            }
          )}
          {account && !emergencyShutdownActive && (
            <AddCdpButton account={account} show={show} mobile={mobile} />
          )}
        </CdpContainer>
      </Box>
      {userVaults.length >= 4 && !mobile }
    </Fragment>
  ) : null;
});

export default CDPList;
