import React from 'react';
import { Button, Flex } from '@makerdao/ui-components-core';

import useLanguage from 'hooks/useLanguage';

const ScreenFooter = ({
  onNext,
  onBack,
  loading,
  canGoBack = true,
  canProgress = true,
  continueText,
  secondaryButtonText
} = {}) => {
  const { lang } = useLanguage();
  return (
    <Flex textAlign="center" justifyContent="center">
      <Button
        className="btn"
        disabled={!canGoBack}
        width="110px"
        variant="secondary-outline"
        mx="xs"
        onClick={onBack}
      >
        {secondaryButtonText ? secondaryButtonText : lang.actions.back}
      </Button>
      <Button
        className="btn_next"
        disabled={!canProgress}
        loading={loading}
        width="145px"
        mx="xs"
        onClick={onNext}
      >
        {continueText ? continueText : lang.actions.continue}
      </Button>
    </Flex>
  );
};

export default ScreenFooter;
