import React from 'react';
import { hot } from 'react-hot-loader/root';
import useLanguage from 'hooks/useLanguage';
import useCdpTypes from 'hooks/useCdpTypes';

import {
  MarketsTable,
  PageHead,
  StyledPageContentLayout
} from 'components/Marketing';
import { Box, Text, Link } from '@makerdao/ui-components-core';
import { ReactComponent as ExternalLinkIcon } from '../images/external-link.svg';

function BorrowMarkets() {
  const { lang } = useLanguage();
  const { cdpTypesList } = useCdpTypes();

  return (
    <StyledPageContentLayout
      css={`
        overflow: scroll;
      `}
      maxWidth="1090px"
      m="0 auto"
    >
      <PageHead
        title={lang.borrow_markets.meta.title}
        description={lang.borrow_landing.meta.description}
      />
      <Box maxWidth="844px" m="76px auto 0">
        <Text.h3 fontWeight="normal" mb="12px">
          {lang.borrow_markets.heading}
        </Text.h3>
        <Text>{lang.borrow_markets.subheading}</Text>
      </Box>
      <MarketsTable
        cdpTypesList={cdpTypesList}
        style={{ marginTop: '60px', marginBottom: '17px' }}
      />
      <Box textAlign="left">
        <Link href={'https://makerdao.com/feeds'} target="_blank">
          <Text color="blue" fontSize="15px">
            {lang.sidebar.view_price_feeds}
          </Text>
          &nbsp;&nbsp;
          <ExternalLinkIcon fill="#447afb" />
        </Link>
      </Box>
    </StyledPageContentLayout>
  );
}

export default hot(BorrowMarkets);
