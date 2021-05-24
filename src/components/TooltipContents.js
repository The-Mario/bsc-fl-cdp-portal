import React from 'react';
import { Card, Text } from '@makerdao/ui-components-core';

export default function({ children, ...rest }) {
  return (
    <Card px="m" py="s" bg="#131824" maxWidth="30rem" {...children}>
      <Text.p t="caption" lineHeight="normal">
        {children}
      </Text.p>
    </Card>
  );
}
