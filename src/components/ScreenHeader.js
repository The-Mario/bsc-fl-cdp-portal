import React from 'react';
import { Box } from '@makerdao/ui-components-core';
import { TextBlock } from 'components/Typography';
import { getColor } from 'styles/theme';

const ScreenHeader = ({ title, title2, text }) => {
  return (
    <Box textAlign="center" pt="m">
      <Box pb="m">
        <TextBlock style={{ fontSize: '22px', color: getColor('whiteText') }}>
          {title}
        </TextBlock>
        <TextBlock style={{ fontSize: '22px', color: getColor('cayn') }}>
          {title2}
        </TextBlock>
      </Box>
      <TextBlock style={{ fontSize: '16px', color: getColor('greyText') }}>
        {text}
      </TextBlock>
    </Box>
  );
};

export default ScreenHeader;
