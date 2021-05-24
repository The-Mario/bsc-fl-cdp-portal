import React from 'react';
import BigNumber from 'bignumber.js';
import { hot } from 'react-hot-loader/root';
import {
  Text,
  Button,
  Card,
  Flex,
  CardBody
} from '@makerdao/ui-components-core';
import useMaker from 'hooks/useMaker';
import useLanguage from 'hooks/useLanguage';
import {  formatter } from 'utils/ui';
import { decimalRules } from '../../styles/constants';
import { getColor } from '../../styles/theme';
import { watch } from 'hooks/useObservable';
const { short } = decimalRules;

const GetReward = () => {
  const { lang } = useLanguage();
  const { maker } = useMaker();

  BigNumber.set({ ROUNDING_MODE: BigNumber.ROUND_DOWN });

  const generate = () => {
    maker.service('mcd:rewards').claimReward();
  };

  const { account } = useMaker();
  const rewardAmount = watch.walletRewardAmount(account?.address);
  const walletAmount = watch.tokenBalance(account?.address, 'FL');
  const valid = formatter(rewardAmount) == 0;

  return (
    <Card
      pt="sm"
      style={{
        background: getColor('cardBg'),
        borderColor: getColor('border')
      }}
    >
      <Flex justifyContent="space-between" alignContent="center" px="s" pt="">
        <Text
          t="h4"
          style={{ color: getColor('whiteText'), paddingBottom: '10px' }}
        >
          {lang.sidebar.reward}
        </Text>
      </Flex>
      <CardBody>
        <Flex
          justifyContent="space-between"
          alignItems="baseline"
          width="100%"
          py="xs"
          px="s"
          bg={'#1c2334'}
          color="#A3B2CF"
        >
          <Text fontWeight="semibold" t="smallCaps" color="#A3B2CF">
            {lang.sidebar.reward_info}
          </Text>
          <Text fontSize="1.4rem" style={{ color: getColor('greyText') }}>
            {`${formatter(rewardAmount ? rewardAmount : 0.0, {
              precision: short
            })}`}{' '}
            FL
          </Text>
        </Flex>
        <Flex
          justifyContent="space-between"
          alignItems="baseline"
          width="100%"
          py="xs"
          px="s"
          bg={'#1c2334'}
          color="#A3B2CF"
        >
          <Text fontWeight="semibold" t="smallCaps" color="#A3B2CF">
            {lang.sidebar.reward_on_wallet}
          </Text>

          <Text fontSize="1.4rem" style={{ color: getColor('greyText') }}>
            {`${formatter(walletAmount ? walletAmount : 0.0, {
              precision: short
            })}`}{' '}
            FL
          </Text>
        </Flex>
      </CardBody>
      <Button
        className="btn btn_center"
        style={{ margin: '20px auto', fontSize: '14px' }}
        disabled={valid}
        onClick={() => {
          generate();
        }}
      >
        {lang.sidebar.reward_button}
      </Button>
    </Card>
  );
};
export default hot(GetReward);
