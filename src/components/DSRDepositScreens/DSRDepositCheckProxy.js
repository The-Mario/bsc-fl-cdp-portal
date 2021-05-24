import React from 'react';
import { Box, Text } from '@makerdao/ui-components-core';
import ScreenFooter from '../ScreenFooter';
import useProxy from 'hooks/useProxy';
import ProxyAllowanceCheck from '../ProxyAllowanceCheck';
import useTokenAllowance from 'hooks/useTokenAllowance';
import { useWeb3BlockHeight } from 'hooks/useBlockHeight';
import useLanguage from 'hooks/useLanguage';
import { getColor } from '../../styles/theme';

const DSRDepositCheckProxy = ({ dispatch, onClose }) => {
  const { lang } = useLanguage();
  const blockHeight = useWeb3BlockHeight(0);

  const {
    proxyLoading,
    hasProxy,
    proxyAddress,
    proxyDeployed,
    setupProxy,
    startingBlockHeight,
    proxyErrors
  } = useProxy();

  const {
    hasAllowance,
    setAllowance,
    allowanceLoading: isSettingAllowance
  } = useTokenAllowance('USDFL');

  const labels = {
    setup_text: lang.dsr_deposit.setup_proxy_text,
    setup_header: lang.dsr_deposit.setup_header,
    allowance_text: lang.formatString(
      lang.cdp_create.setup_proxy_allowance_text,
      'USDFL'
    ),
    confirmations_text: lang.formatString(
      lang.cdp_create.waiting_for_comfirmations,
      startingBlockHeight === 0
        ? 0
        : blockHeight - startingBlockHeight > 10
        ? 10
        : blockHeight - startingBlockHeight,
      10
    )
  };

  return (
    <Box maxWidth="71.8rem">
      <Text
        style={{
          fontSize: '22px',
          color: getColor('whiteText'),
          display: 'flex',
          justifyContent: 'center',
          paddingBottom: '30px'
        }}
      >
        {lang.dsr_deposit.open_vault}
      </Text>
      <ProxyAllowanceCheck
        proxyAddress={proxyAddress}
        deployProxy={setupProxy}
        labels={labels}
        proxyLoading={proxyLoading}
        proxyDeployed={proxyDeployed}
        proxyErrors={proxyErrors}
        hasProxy={hasProxy}
        setAllowance={setAllowance}
        hasAllowance={hasAllowance}
        isSettingAllowance={isSettingAllowance}
        style={{
          color: getColor('greyText'),
          backgroundColor: getColor('cardBg'),
          borderColor: getColor('cardBg'),
          borderRadius: '13px'
        }}
      />
      <ScreenFooter
        onNext={() => dispatch({ type: 'increment-step' })}
        onBack={onClose}
        canGoBack={!proxyLoading}
        canProgress={hasProxy && hasAllowance}
      />
    </Box>
  );
};

export default DSRDepositCheckProxy;
