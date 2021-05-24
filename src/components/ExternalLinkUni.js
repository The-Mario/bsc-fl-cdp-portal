import React from 'react';
import { Address, Link, Flex, Box } from '@makerdao/ui-components-core';
import { ReactComponent as ExternalLinkIcon } from 'images/external-link.svg';
import { getColor } from 'styles/theme';

const uniLink = "https://info.uniswap.org/pair/";
const ExternalLinkUni = ({
  children,
  string,
  hideText,
  fill = '#00DCDC',
  arrowInheritsColorOnHover = false
}) => (
  <Link
    fontWeight="400"
    href={`${uniLink}${string}`}
    target="_blank"
    css={`
      color: ${getColor('cayn')};
      whitespace: nowrap;
      &:hover svg {
        fill: ${arrowInheritsColorOnHover && getColor('cayn')};
      }
    `}
  >
    <Flex alignItems="center">
      {children}
      {!hideText && (
        <Box mr="2xs">
          <Address full={string} shorten={true} expandable={false} />
        </Box>
      )}
      <ExternalLinkIcon fill={fill} />
    </Flex>
  </Link>
);

export default ExternalLinkUni;
