import React from 'react';
import { Text, Grid } from '@makerdao/ui-components-core';
import { getColor } from '../../../styles/theme';

const Info = ({ title, body, ...rest }) => {
  return (
    <Grid gridRowGap="2xs" key={title} py="s" {...rest}>
      <div>
        <Text t="subheading" style={{ color: getColor('whiteText') }}>
          {title}
        </Text>
      </div>
      <div>
        <Text color="text" style={{ color: getColor('greyText') }}>
          {body}
        </Text>
      </div>
    </Grid>
  );
};

export default Info;
