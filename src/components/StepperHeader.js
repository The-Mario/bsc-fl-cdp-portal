import React from 'react';
import { Flex, Grid, Box, Text } from '@makerdao/ui-components-core';
import ActiveAccount from './ActiveAccount';
import useMaker from 'hooks/useMaker';
import { ReactComponent as CloseIcon } from 'images/close-circle.svg';
import lang from 'languages';
import { getColor } from 'styles/theme';

const StepperHeader = ({ onClose }) => {
  const { account } = useMaker();
  return (
    <Flex justifyContent="flex-end" mb="m">
      <Grid
        gridColumnGap="xl"
        gridTemplateColumns="auto auto"
        alignItems="center"
      >
        <Box>
          <ActiveAccount
            address={account.address}
            style={{color: getColor('greyText')}}
            t="1.6rem"
            readOnly
            maxWidth="250px"
          />
        </Box>

        <Grid
          onClick={onClose}
          gridTemplateColumns="auto auto"
          alignItems="center"
          gridColumnGap="xs"
          css={{ cursor: 'pointer' }}
        >
          <CloseIcon />
          <Text style={{color: getColor('greyText')}} t="1.6rem" fontWeight="medium">
            {lang.close}
          </Text>
        </Grid>
      </Grid>
    </Flex>
  );
};

export default StepperHeader;
