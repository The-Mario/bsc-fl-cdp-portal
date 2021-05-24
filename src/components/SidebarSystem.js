import React, { Fragment } from 'react';
import { Text, Box, Card, Flex } from '@makerdao/ui-components-core';
import useLanguage from 'hooks/useLanguage';
import { formatCollateralizationRatio, prettifyNumber } from 'utils/ui';
import SiteVersion from 'components/SiteVersion';
import { getColor } from 'styles/theme';
import { watch } from 'hooks/useObservable';
import { USDFL } from '../libs/dai-plugin-mcd/src/index.js';


const SidebarSystem = ({ system }) => {
  const { lang } = useLanguage();
  const {
    systemCollateralization: sc,
    totalDaiSupply,
    totalVaultsCreated
  } = system;

  //const flPrice = USDFL(watch.getFLPrice() || '0');

  const systemParams = [
    [
      lang.sidebar.system_collateralization,
      formatCollateralizationRatio(sc?.toNumber())
    ],
    [
      lang.sidebar.save_details.total_dai_supply,
      prettifyNumber(totalDaiSupply)
    ],
    [
      lang.sidebar.active_cdps,
      totalVaultsCreated
        ? lang.formatString(
          lang.sidebar.active_cdps_figure,
          prettifyNumber(parseInt(totalVaultsCreated))
        )
        : ''
    ]
  ];

  return (
    <Fragment>
      <Card
        css={'overflow:hidden;'}
        pt="sm"
        style={{
          background: getColor('cardBg'),
          borderColor: getColor('border')
        }}
      >
        <Flex
          justifyContent="space-between"
          alignContent="center"
          px="s"
          pb="s2"
        >
          <Text style={{ fontSize: '20px', color: getColor('whiteText') }}>
            {lang.sidebar.system_info}
          </Text>
        </Flex>
        {systemParams.map(([param, value], idx) => (
          <Flex
            key={`system_${param}`}
            justifyContent="space-between"
            alignItems="baseline"
            width="100%"
            py="xs"
            px="s"
            bg={idx % 2 ? '#1c2334' : '#1c2334'}
          >
            <Text fontWeight="semibold" t="smallCaps" color="#A3B2CF">
              {param}
            </Text>
            <Box>
              <Text fontSize="s" style={{ color: getColor('greyText') }}>
                {value}
              </Text>
            </Box>
          </Flex>
        ))}
      </Card>
      <Box px="s">
        {process.env.NODE_ENV === 'production' ? <SiteVersion /> : null}
      </Box>
    </Fragment>
  );
};

export default SidebarSystem;
