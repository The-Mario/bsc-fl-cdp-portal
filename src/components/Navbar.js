import React from 'react';
import BorrowNav from 'components/BorrowNav';
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
        <BorrowNav viewedAddress={viewedAddress} account={account} />
      </Grid>
    </Box>
  );
};

export default Navbar;
