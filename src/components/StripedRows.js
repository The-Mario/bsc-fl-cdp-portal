import React from 'react';
import { Box } from '@makerdao/ui-components-core';

export default function({ children }) {
  return (
    <>
      {React.Children.map(children, (child, index) => {
        return (
          <Box bg={index % 2 === 0 ? '#131824' : '#1c2334'} color="#A3B2CF">
            {child}
          </Box>
        );
      })}
    </>
  );
}
