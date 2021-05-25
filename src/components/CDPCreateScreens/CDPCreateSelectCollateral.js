import React from 'react';
import {
  Box,
  Grid,
  Table,
  Radio,
  Overflow,
  Card
} from '@makerdao/ui-components-core';
import { TextBlock } from 'components/Typography';
import { formatter } from 'utils/ui';
import useCdpTypes from 'hooks/useCdpTypes';
import useLanguage from 'hooks/useLanguage';
import useAnalytics from 'hooks/useAnalytics';
import ScreenFooter from '../ScreenFooter';
import ScreenHeader from '../ScreenHeader';
import BigNumber from 'bignumber.js';
import { getColor } from 'styles/theme';
import { ReactComponent as ExternalLinkIcon } from 'images/external-link.svg';

const CDPCreateSelectCollateralSidebar = () => {
  const { lang } = useLanguage();
  return (
    <Box px="l" py="m">
      <Grid
        gridTemplateColumns={{ s: 'minmax(0, 1fr)', l: '1fr' }}
        gridGap="m"
        gridColumnGap="50px"
        my="l"
      >
        {[[lang.stability_fee, lang.cdp_create.stability_fee_description]].map(
          ([title, text]) => (
            <Grid mb="m" key={title} gridColumnGap="xs">
              <TextBlock
                style={{ fontSize: '18px', color: getColor('whiteText') }}
              >
                {title}
              </TextBlock>
              <TextBlock
                style={{ fontSize: '14px', color: getColor('greyText') }}
              >
                {text}
              </TextBlock>
            </Grid>
          )
        )}
      </Grid>
    </Box>
  );
};

function IlkTableRow({
  ilk,
  checked,
  gemBalance,
  isFirstVault,
  dispatch,
  ilkData
}) {
  const { trackInputChange } = useAnalytics('SelectCollateral', 'VaultCreate');
  const { annualStabilityFee, collateralValueForAmount } = ilkData;

  async function selectIlk() {
    trackInputChange('CollateralType', {
      selectedCollateral: ilk.symbol,
      isFirstVault
    });
    dispatch({
      type: 'set-ilk',
      payload: {
        gem: ilk.gem,
        symbol: ilk.symbol,
        gemBalance,
        currency: ilk.currency
      }
    });
  }
  const disabled = ilk.gem === '';

  return (
    <tr
      style={
        disabled
          ? { color: '#6F7A96', borderColor: getColor('border') }
          : { whiteSpace: 'nowrap', borderColor: getColor('border') }
      }
      onClick={() => !disabled && selectIlk()}
    >
      <td>
        <Radio
          disabled={disabled}
          checked={checked}
          readOnly
          mr="xs"
          css={{
            appearance: 'none'
          }}
        />
      </td>
      <td>
        <div>{ilk.symbol}</div>

        {disabled && (
          <div style={{ fontSize: '11px', paddingBottom: '5px' }}>
            Unavailable due to a token upgrade
          </div>
        )}
      </td>
      <td>
        <div style={{ color: '#F0B90B' }}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`${ilk.link}${ilk.token1}/${ilk.token2}`}
          >
            {ilk.platform} <ExternalLinkIcon style={{ fill: '#F0B90B' }} />
          </a>
        </div>
      </td>
      <td>
        {formatter(annualStabilityFee, {
          percentage: true,
          rounding: BigNumber.ROUND_HALF_UP
        })}{' '}
        %
      </td>
      <td css="text-align: right">
        {`${formatter(collateralValueForAmount(gemBalance))}  USD`}
      </td>
    </tr>
  );
}

const CDPCreateSelectCollateral = ({
  selectedIlk,
  isFirstVault,
  hasAllowance,
  proxyAddress,
  balances,
  collateralTypesData,
  dispatch,
  onClose
}) => {
  const { trackBtnClick } = useAnalytics('SelectCollateral', 'VaultCreate');
  const { lang } = useLanguage();
  const { cdpTypes } = useCdpTypes();
  const hasAllowanceAndProxy = hasAllowance && !!proxyAddress;

  return (
    <Box maxWidth="1040px">
      <ScreenHeader
        title={lang.cdp_create.select_title}
        title2={lang.cdp_create.select_title2}
        text={lang.cdp_create.select_text}
      ></ScreenHeader>
      <Grid
        style={{
          background: getColor('cardBg'),
          padding: '30px',
          borderRadius: '13px'
        }}
        gridTemplateColumns={{ s: 'minmax(0, 1fr)', l: '1fr' }}
        gridGap="m"
        my="l"
      >
        <div>
          <Card
            px="l"
            py="l"
            style={{
              background: getColor('cardBg'),
              borderColor: getColor('border')
            }}
          >
            <Overflow x="scroll" y="visible">
              <Table
                width="100%"
                css={`
                  th {
                    color: ${getColor('greyText')};
                  }
                  td {
                    padding-right: 10px;
                    color: ${getColor('whiteText')};
                  }
                `}
              >
                <thead>
                  <tr css="white-space: nowrap;">
                    <th />
                    <th>{lang.collateral_type}</th>
                    <th>{lang.link_pool}</th>
                    <th>{lang.stability_fee}</th>
                    <th css="text-align: right">{lang.your_balance}</th>
                  </tr>
                </thead>
                <tbody>
                  {cdpTypes.map(
                    ilk =>
                      collateralTypesData &&
                      balances[ilk.gem] && (
                        <IlkTableRow
                          key={ilk.symbol}
                          checked={ilk.symbol === selectedIlk.symbol}
                          dispatch={dispatch}
                          ilk={ilk}
                          gemBalance={balances[ilk.gem]}
                          isFirstVault={isFirstVault}
                          ilkData={collateralTypesData.find(
                            x => x.symbol === ilk.symbol
                          )}
                        />
                      )
                  )}
                </tbody>
              </Table>
            </Overflow>
          </Card>
        </div>

        <CDPCreateSelectCollateralSidebar />
      </Grid>
      <ScreenFooter
        onNext={() => {
          trackBtnClick('Next', {
            selectedCollateral: selectedIlk.symbol,
            isFirstVault
          });
          dispatch({
            type: 'increment-step',
            payload: { by: hasAllowanceAndProxy ? 2 : 1 }
          });
        }}
        onBack={() => {
          onClose();
        }}
        canGoBack={true}
        canProgress={!!selectedIlk.symbol}
      />
    </Box>
  );
};
export default CDPCreateSelectCollateral;
