import React, { useEffect } from 'react';
import { hot } from 'react-hot-loader/root';
import PageContentLayout from 'layouts/PageContentLayout';
import LoadingLayout from 'layouts/LoadingLayout';
import {
  Text,
  Grid,
  Card,
  Table,
  Box,
  Button,
  Address,
  Flex
} from '@makerdao/ui-components-core';
import { Link, useCurrentRoute } from 'react-navi';
import useMaker from 'hooks/useMaker';
import RatioDisplay from '../components/RatioDisplay';
import { getColor } from 'styles/theme';
import useLanguage from 'hooks/useLanguage';
import useModal from '../hooks/useModal';
import useNotification from 'hooks/useNotification';
import useAnalytics from 'hooks/useAnalytics';
import useVaults from 'hooks/useVaults';
import useEmergencyShutdown from 'hooks/useEmergencyShutdown';
import { NotificationList, Routes, SAFETY_LEVELS } from 'utils/constants';
import { FilledButton } from 'components/Marketing';
import { formatter } from 'utils/ui';
import bsc_token from 'images/icon-coin-bnb.svg';
import { backgroundPosition } from 'styled-system';

const InfoCard = ({ title, amount, denom }) => (
  <Card
    py={{ s: 'm', xl: 'l' }}
    px="m"
    minWidth="25.4rem"
    style={{
      borderColor: getColor('border'),
      backgroundColor: getColor('cardBg')
    }}
  >
    <Grid gridRowGap="s">
      <Text
        justifySelf={{ s: 'left', xl: 'center' }}
        t="subheading"
        css={`
          white-space: nowrap;
          color: ${getColor('greyText')};
        `}
      >
        {title.toUpperCase()}
      </Text>
      <Box justifySelf={{ s: 'left', xl: 'center' }}>
        <Box display={{ s: 'none', xl: 'unset' }}>
          <Flex alignSelf="end" alignItems="flex-end">
            <Text style={{ fontSize: '20px', color: getColor('whiteText') }}>
              {amount}
            </Text>
            &nbsp;
            <Text style={{ fontSize: '18px', color: getColor('whiteText') }}>
              {denom}
            </Text>
          </Flex>
        </Box>
        <Text
          style={{ fontSize: '20px', color: getColor('whiteText') }}
          display={{ s: 'unset', xl: 'none' }}
        >
          {amount} {denom}
        </Text>
      </Box>
    </Grid>
  </Card>
);

function Overview({ viewedAddress }) {
  const { trackBtnClick } = useAnalytics('Table');
  const { account } = useMaker();
  const { viewedAddressVaults } = useVaults();
  const { url } = useCurrentRoute();
  const { lang } = useLanguage();
  const { emergencyShutdownActive } = useEmergencyShutdown();
  const { addNotification, deleteNotifications } = useNotification();
  useEffect(() => {
    if (
      account &&
      viewedAddress.toLowerCase() !== account.address.toLowerCase()
    ) {
      addNotification({
        id: NotificationList.NON_OVERVIEW_OWNER,
        content: lang.formatString(
          lang.notifications.non_overview_owner,
          <Address full={viewedAddress} shorten={true} expandable={false} />
        ),
        level: SAFETY_LEVELS.WARNING
      });
    }
    return () => deleteNotifications([NotificationList.NON_OVERVIEW_OWNER]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewedAddress, account]);

  const { show } = useModal();
  if (!viewedAddressVaults) {
    return <LoadingLayout background={getColor('cardBg')} />;
  }

  if (viewedAddressVaults && !viewedAddressVaults.length) {
    return (
      <PageContentLayout>
        <Flex
          height="70vh"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          {account && account.address === viewedAddress ? (
            <>
              <Text
                style={{ fontSize: '20px', color: getColor('greyText') }}
                mb="26px"
              >
                {lang.overview_page.get_started_title}
              </Text>
              <Link
                disabled={emergencyShutdownActive}
                p="s"
                css={{ cursor: 'pointer' }}
                onClick={() => {
                  trackBtnClick('CreateFirst');
                  show({
                    modalType: 'cdpcreate',
                    modalTemplate: 'fullscreen'
                  });
                }}
              >
                <FilledButton className="button_p">
                  {lang.actions.get_started}
                </FilledButton>
              </Link>
            </>
          ) : (
            <Text style={{ fontSize: '20px', color: getColor('greyText') }}>
              {lang.formatString(
                lang.overview_page.no_vaults,
                <Address
                  full={viewedAddress}
                  shorten={true}
                  expandable={false}
                />
              )}
            </Text>
          )}
        </Flex>
      </PageContentLayout>
    );
  }

  return (
    <PageContentLayout
      style={{
        backgroundImage: `url(${bsc_token})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right top'
      }}
    >
      <Text.h2 pr="m" mb="m" color="white">
        {lang.overview_page.title}
      </Text.h2>
      {viewedAddressVaults && (
        <Grid gridRowGap={{ s: 'm', xl: 'l' }}>
          <Grid
            gridTemplateColumns={{ s: '1fr', xl: 'auto auto 1fr' }}
            gridColumnGap="m"
            gridRowGap="s"
          >
            <InfoCard
              title={lang.overview_page.total_collateral_locked}
              amount={`$${viewedAddressVaults
                .reduce(
                  (acc, { collateralValue }) => collateralValue.plus(acc),
                  0
                )
                .toBigNumber()
                .toFixed(2)}`}
              denom={'USD'}
            />
            <InfoCard
              title={lang.overview_page.total_dai_debt}
              amount={`${viewedAddressVaults
                .reduce((acc, { debtValue }) => debtValue.plus(acc), 0)
                .toBigNumber()
                .toFixed(2)}`}
              denom={'USDFL'}
            />
          </Grid>
          <Box>
            <Text style={{ fontSize: '20px', color: getColor('greyText') }}>
              {lang.overview_page.your_cdps}
            </Text>
            <Card
              px={{ s: 'm', xl: 'l' }}
              pt="m"
              pb="s"
              my="m"
              css={`
                overflow-x: none;
                background: ${getColor('cardBg')};
                border-color: ${getColor('border')};
              `}
            >
              <Table
                width="100%"
                variant="cozy"
                css={`
                  td,
                  th {
                    white-space: nowrap;
                    color: ${getColor('whiteText')};
                  }
                  tbody,
                  tr {
                    border-color: ${getColor('border')} !important;
                  }
                  td:not(:last-child),
                  th:not(:last-child) {
                    padding-right: 10px;
                  }
                `}
              >
                <Table.thead>
                  <Table.tr>
                    <Table.th>{lang.overview_page.token}</Table.th>
                    <Table.th>{lang.overview_page.id}</Table.th>
                    <Table.th display={{ s: 'table-cell', xl: 'none' }}>
                      {lang.overview_page.ratio_mobile}
                    </Table.th>
                    <Table.th display={{ s: 'none', xl: 'table-cell' }}>
                      {lang.overview_page.ratio}
                    </Table.th>
                    <Table.th display={{ s: 'none', xl: 'table-cell' }}>
                      {lang.overview_page.deposited}
                    </Table.th>
                    <Table.th display={{ s: 'none', xl: 'table-cell' }}>
                      {lang.overview_page.withdraw}
                    </Table.th>
                    <Table.th display={{ s: 'none', xl: 'table-cell' }}>
                      {lang.overview_page.debt}
                    </Table.th>
                    <Table.th />
                  </Table.tr>
                </Table.thead>
                <tbody>
                  {viewedAddressVaults.map(
                    ({
                      id,
                      collateralizationRatio,
                      liquidationRatio,
                      collateralAmount,
                      collateralAvailableAmount,
                      debtValue,
                      collateralValue,
                      collateralAvailableValue
                    }) => (
                      <Table.tr key={id}>
                        <Table.td>
                          <Text
                            t="body"
                            fontSize={{ s: '1.7rem', xl: 'm' }}
                            fontWeight={{ s: 'medium', xl: 'normal' }}
                            color="white"
                          >
                            {collateralAmount.symbol}
                          </Text>
                        </Table.td>
                        <Table.td>
                          <Text
                            t="body"
                            fontSize={{ s: '1.7rem', xl: 'm' }}
                            color={{ s: 'grey', xl: 'white' }}
                          >
                            {id}
                          </Text>
                        </Table.td>
                        <Table.td>
                          {isFinite(collateralizationRatio.toNumber()) ? (
                            <RatioDisplay
                              color={getColor('greyText')}
                              fontSize={{ s: '1.4rem', xl: '1.4rem' }}
                              ratio={collateralizationRatio
                                .toBigNumber()
                                .dp(4)
                                .times(100)}
                              ilkLiqRatio={liquidationRatio
                                .toBigNumber()
                                .dp(4)
                                .times(100)}
                            />
                          ) : (
                            <Text fontSize={{ s: '1.7rem', xl: '1.3rem' }}>
                              N/A
                            </Text>
                          )}
                        </Table.td>
                        <Table.td display={{ s: 'none', xl: 'table-cell' }}>
                          <Text t="caption" color={getColor('whiteText')}>
                            {`${formatter(collateralValue)} USD`}
                          </Text>
                        </Table.td>
                        <Table.td display={{ s: 'none', xl: 'table-cell' }}>
                          <Text t="caption" color={getColor('greyText')}>
                            {`${formatter(collateralAvailableValue)} USD`}
                          </Text>
                        </Table.td>
                        <Table.td display={{ s: 'none', xl: 'table-cell' }}>
                          <Text t="caption" color={getColor('greyText')}>
                            {debtValue.toBigNumber().toFixed(2)} USDFL
                          </Text>
                        </Table.td>
                        <Table.td>
                          <Flex justifyContent="flex-end">
                            <Button
                              variant="secondary-outline"
                              className="btn_dashboard"
                            >
                              <Link
                                href={`/${Routes.BORROW}/${id}${url.search}`}
                                prefetch={true}
                              >
                                <Box display={{ s: 'none', xl: 'inline' }}>
                                  {lang.overview_page.view_cdp}
                                </Box>
                                <Box display={{ s: 'inline', xl: 'none' }}>
                                  {lang.overview_page.view_cdp_mobile}
                                </Box>
                              </Link>
                            </Button>
                          </Flex>
                        </Table.td>
                      </Table.tr>
                    )
                  )}
                </tbody>
              </Table>
            </Card>
          </Box>
        </Grid>
      )}
    </PageContentLayout>
  );
}

export default hot(Overview);
