import React from 'react';
import {
  Text,
  Card,
  Button,
  Grid,
  Tooltip
} from '@makerdao/ui-components-core';
import lang from 'languages';
import { ReactComponent as Checkmark } from 'images/checkmark.svg';
import TooltipContents from 'components/TooltipContents';
import { VendorErrors } from 'utils/constants';
import { getColor } from '../styles/theme';
const errorStates = {
  [VendorErrors.ENABLE_CONTRACT_DATA]: {
    message: lang.cdp_create.proxy_failure_contract_data,
    information: lang.cdp_create.proxy_failure_contract_data_info,
    retry: true
  },
  [VendorErrors.USER_REJECTED]: {
    message: lang.cdp_create.proxy_failure_rejected,
    retry: true
  },
  [VendorErrors.TIMEOUT]: {
    message: lang.cdp_create.proxy_failure_timeout,
    information: lang.cdp_create.proxy_failure_timeout_info,
    retry: true
  }
};

const parseError = proxyErrors =>
  errorStates[proxyErrors?.name] || {
    message: lang.cdp_create.proxy_failure_not_mined,
    information: lang.cdp_create.proxy_failure_not_mined_info,
    retry: false
  };

const SuccessButton = () => {
  return (
    <Button className="btn_next_d" variant="primary-outline" width="13.0rem" mt="xs" disabled>
      <Checkmark />
    </Button>
  );
};

const ProxyAllowanceCheck = ({
  proxyAddress,
  deployProxy,
  proxyLoading,
  proxyDeployed,
  proxyErrors,
  hasProxy,
  setAllowance,
  hasAllowance,
  labels,
  isSettingAllowance
}) => {
  const {
    setup_text,
    setup_header,
    allowance_text,
    confirmations_text
  } = labels;

  return (
    <Card
      px={{ s: 'l', m: '2xl' }}
      py="l"
      mb="xl"
      style={{
        backgroundColor: getColor('cardBg'),
        border: 'none',
        textAlign: 'left'
      }}
    >
      <Grid gridRowGap="xs">
        <Text style={{ fontSize: '20px', color: getColor('whiteText') }}>
          {setup_header}
        </Text>
        <Text style={{ fontSize: '16px', color: getColor('greyText') }}>
          {setup_text}
        </Text>
        {hasProxy ? (
          <SuccessButton />
        ) : (
          <Button
            className="btn_next"
            width="13.0rem"
            mt="xs"
            onClick={deployProxy}
            disabled={
              proxyLoading ||
              isSettingAllowance ||
              !!(proxyErrors && !parseError(proxyErrors).retry)
            }
            loading={
              proxyLoading || !!(proxyErrors && !parseError(proxyErrors).retry)
            }
          >
            {parseError(proxyErrors).retry
              ? lang.actions.try_again
              : lang.cdp_create.setup_proxy_proxy_button}
          </Button>
        )}
        <Text.p t="subheading" lineHeight="normal">
          {proxyErrors && (
            <>
              {parseError(proxyErrors).message}
              {parseError(proxyErrors).information && (
                <Tooltip
                  fontSize="xs"
                  ml="s"
                  color="blue"
                  noDecoration
                  content={
                    <TooltipContents>
                      {parseError(proxyErrors).information}
                    </TooltipContents>
                  }
                >
                  {lang.why_is_this}
                </Tooltip>
              )}
            </>
          )}
          {proxyLoading && confirmations_text}
          {proxyDeployed &&
            lang.formatString(lang.cdp_create.confirmed_with_confirmations, 10)}
          {(proxyLoading || proxyDeployed) && (
            <Tooltip
              fontSize="m"
              ml="2xs"
              content={
                <TooltipContents>
                  {lang.cdp_create.waiting_for_confirmations_info}
                </TooltipContents>
              }
            />
          )}
        </Text.p>
      </Grid>
      <Grid gridRowGap="xs" mt="l">
        <Text style={{ fontSize: '20px', color: getColor('whiteText') }}>
          {lang.cdp_create.set_allowance}
        </Text>
        <Text style={{ fontSize: '16px', color: getColor('greyText') }}>
          {allowance_text}
        </Text>
        {hasAllowance ? (
          <SuccessButton />
        ) : (
          <Button
            className="btn_next"
            width="13.0rem"
            mt="xs"
            onClick={setAllowance}
            disabled={!proxyAddress || proxyLoading || isSettingAllowance}
            loading={isSettingAllowance}
          >
            {lang.cdp_create.setup_proxy_allowance_button}
          </Button>
        )}
      </Grid>
    </Card>
  );
};

export default ProxyAllowanceCheck;
