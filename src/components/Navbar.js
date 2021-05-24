import React from 'react';
import SaveNav from 'components/SaveNav';
import BorrowNav from 'components/BorrowNav';
import RewardNav from 'components/RewardNav';
import NetworkNav from 'components/NetworkNav';
import { Flex, Grid, Box } from '@makerdao/ui-components-core';
import useMaker from 'hooks/useMaker';
import { Logo } from 'components/Marketing';

const Navbar = ({ viewedAddress }) => {
  const { account } = useMaker();

  return (
    <Box bg="#191E2B" height="100%">
      <Flex alignItems="center" justifyContent="center" py="m" />
      <Grid mx="0px">
        <Logo style={{
          width: '50px',
          display: 'flex',
          justifyContent: 'center',
          margin: 'auto',
          marginBottom: '50px'
        }} />
        <NetworkNav />
        <RewardNav account={account} />
        <SaveNav account={account} />
        <BorrowNav viewedAddress={viewedAddress} account={account} />
      </Grid>
    </Box>
  );
};

export default Navbar;
