import React from 'react';
import {
  Box,
  Grid,
  Flex,
  Card,
  Button,
  Text
} from '@makerdao/ui-components-core';
import styled from 'styled-components';
import { getColor } from 'styles/theme';
const WithSeparators = styled(Box).attrs(() => ({
  borderBottom: '1px solid',
  borderColor: '#222B3F'
}))`
  &:last-child {
    border-bottom: none;
  }
`;

export const InfoContainerRow = ({ title, value }) => {
  return (
    <WithSeparators>
      <Grid
        gridTemplateColumns="1fr auto"
        py="xs"
        gridColumnGap="s"
        alignItems="center"
      >
        <Text style={{ color: getColor('greyText') }}>{title}</Text>
        <Text style={{ color: getColor('greyText') }}>{value}</Text>
      </Grid>
    </WithSeparators>
  );
};

export const ActionContainerRow = ({ title, value, conversion, button }) => {
  return (
    <WithSeparators>
      <Grid
        py="s"
        gridTemplateColumns="1fr auto auto"
        alignItems="center"
        gridColumnGap="s"
        gridAutoRows="min-content"
        gridRowGap="2xs"
      >
        <Text
          css={`
            grid-column: 1;
            grid-row: span 2;
            color: ${getColor('greyText')};
          `}
        >
          {title}
        </Text>
        <Text
          css={`
            grid-column: 2;
            grid-row: ${conversion ? '1' : 'span 2'};
            color: ${getColor('whiteText')};
          `}
          justifySelf="end"
        >
          {value}
        </Text>
        {conversion ? (
          <ExtraInfo
            css={`
              grid-row: 2;
              grid-column: 2;
              color: ${getColor('whiteText')};
              padding: 12px;
            `}
            justifySelf="end"
          >
            {conversion}
          </ExtraInfo>
        ) : null}
        <Box
          css={`
            grid-column: 3;
            grid-row: span 2;
            color: ${getColor('greyText')};
          `}
        >
          {button}
        </Box>
      </Grid>
    </WithSeparators>
  );
};

export const ActionButton = ({ children, ...props }) => (
  <Button className="btn_dashboard" p="xs" variant="secondary" {...props}>
    {children}
  </Button>
);

export const CdpViewCard = ({ title, children }) => {
  return (
    <Flex py="s" height="100%" flexDirection="column">
      <Text style={{ fontSize: '20px', color: getColor('whiteText') }}>
        {title}
      </Text>
      <Card
        style={{
          backgroundColor: getColor('cardBg'),
          borderColor: getColor('border')
        }}
        px={{ s: 'm', m: 'l' }}
        py="s"
        mt="s"
        flexGrow="1"
      >
        {children}
      </Card>
    </Flex>
  );
};

export const AmountDisplay = ({ amount, denomination }) => {
  return (
    <>
      <Text
        style={{ fontSize: '20px', color: getColor('greyText') }}
        lineHeight="1"
      >
        {amount}&nbsp;
      </Text>
      <Text
        style={{ fontSize: '16px', color: getColor('greyText') }}
        lineHeight="1"
      >
        {denomination} &nbsp;
      </Text>
    </>
  );
};

export const ExtraInfo = ({ children, ...props }) => {
  return (
    <Text t="caption" lineHeight="none" color="#4D566E" {...props}>
      {children}
    </Text>
  );
};
