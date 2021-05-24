import React from 'react';
import { Text } from '@makerdao/ui-components-core';

import useLanguage from 'hooks/useLanguage';
import { getColor } from 'styles/theme';

export default function SetMax({ ...props }) {
  const { lang } = useLanguage();
  return (
    <Text style={{color: getColor('cayn')}} cursor="pointer" {...props}>
      {lang.set_max}
    </Text>
  );
}
