import React, { useEffect } from 'react';
import { hot } from 'react-hot-loader/root';
import { useNavigation } from 'react-navi';
import styled from 'styled-components';
import { getColor } from 'styles/theme';
import AccountSelection from 'components/AccountSelection';
import { Routes } from 'utils/constants';
import useMaker from 'hooks/useMaker';
import useLanguage from 'hooks/useLanguage';
import { Box, Position, Text } from '@makerdao/ui-components-core';
import BgBorrow from 'images/landing/borrow/bg_borrow.png';
import {
  ConnectHero,
  ThickUnderline,
  Questions,
  QuestionsWrapper,
  buildQuestionsFromLangObj,
  FixedHeaderTrigger,
  Parallaxed,
  StyledPageContentLayout,
  PageHead,
  MarketsTable
} from 'components/Marketing';

import useCdpTypes from 'hooks/useCdpTypes';

const HeroBackground = (() => {
  const Pos = styled(Position)`
    position: absolute;
  `;

  return () => (
    <Box
      width="100%"
      zIndex="-1"
      height="670px"
      style={{ position: 'absolute' }}
    >
      <Box maxWidth="866px" m="0 auto">
        <Pos top={{ s: '-30px', m: '-17px' }} left={{ s: '-86px', m: '-83px' }}>
          <Parallaxed
            style={{ position: 'absolute', top: '-36px', left: '-67px' }}
          ></Parallaxed>
        </Pos>
        <Pos
          top={{ s: '306px', m: '270px' }}
          right={{ s: '-105px', m: '-18px' }}
        >
          <Parallaxed
            style={{ position: 'absolute', top: '98px', left: '-33px' }}
          ></Parallaxed>
        </Pos>
      </Box>
    </Box>
  );
})();

// disableConnect is for testing
function Borrow({ disableConnect = false }) {
  const { account } = useMaker();
  const navigation = useNavigation();
  const { lang } = useLanguage();

  useEffect(() => {
    async function redirect() {
      if (!disableConnect && account) {
        const { search } = (await navigation.getRoute()).url;
        navigation.navigate({
          pathname: `/${Routes.BORROW}/owner/${account.address}`,
          search
        });
      }
    }
    redirect();
  }, [account, navigation, disableConnect]);

  const { cdpTypesList } = useCdpTypes();
  const BorrowBg = styled.div`
    max-width: 1140px;
    padding: 0px;
    margin: auto;
    margin-top: 60px;
    @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
      padding: 0px 20px;
    }
    .borrow_block1{ background-image: url(${BgBorrow});
    background-repeat: no-repeat;
    background-position: top right;
    @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
      background-position: top right;

    }
    @media (max-width: 767px) {
      background-position: 60px 50px;
      padding: 0px 20px;

      }
    }
  }
  `;

  return (
    <BorrowBg>
      <StyledPageContentLayout>
        <PageHead
          title={lang.borrow_landing.meta.title}
          description={lang.borrow_landing.meta.description}
        />
        <FixedHeaderTrigger>
          <ConnectHero className="borrow_block1">
            <HeroBackground />
            <ThickUnderline>
              <Text style={{ fontSize: '20px', color: getColor('cayn') }}>
                {lang.borrow_landing.page_name}
              </Text>
            </ThickUnderline>
            <Text.h1 className="headline" style={{ fontSize: '48px' }}>
              {lang.borrow_landing.headline}
            </Text.h1>
            <Box minHeight="91px" maxWidth="645px">
              <Text style={{ fontSize: '20px', color: getColor('greyText') }}>
                {lang.borrow_landing.subheadline}
              </Text>
            </Box>
            <Text fontSize="17px" color="#A3B2CF" className="connect-to-start">
              {lang.borrow_landing.connect_to_start}
            </Text>
            <AccountSelection style={{ width: '260px' }} className="button" />
          </ConnectHero>
        </FixedHeaderTrigger>

        <Box maxWidth="1140px" m="104px 15px 0">
          <Box maxWidth="777px" m="0 auto">
            <Text.h2 mb="34px">{lang.borrow_markets.heading}</Text.h2>
            <Text style={{ fontSize: '17px', color: getColor('greyText') }}>
              {lang.borrow_markets.subheading}
            </Text>
          </Box>
          <Box
            mt={{ s: '54px', m: '87px' }}
            css={`
              ::-webkit-scrollbar {
                display: none;
              }
              -ms-overflow-style: none;
            `}
          >
            <MarketsTable
              cdpTypesList={cdpTypesList.filter(symbol =>
                [
                  'BUSDDAI',
                  'BUSDUSDT',
                  'BUSDUSDC'
                ].includes(symbol.split('-')[0])
              )}
            />
          </Box>
          <Box
            textAlign="left"
            mt={{ s: '20px', m: '35px' }}
            pl={{ s: '6px', m: '37px' }}
          >
            {/* <Link
            href={`/${Routes.BORROW}/markets`}
            style={{ textDecoration: 'underline' }}
          >
            {lang.borrow_landing.markets_link}
          </Link> */}
          </Box>
        </Box>
        <QuestionsWrapper mt="147px" style={{ padding: '5px 0px' }}>
          <Text.h2>{lang.landing_page.questions_title}</Text.h2>
          <Questions
            questions={buildQuestionsFromLangObj(
              lang.borrow_landing.questions,
              lang
            )}
          /* links={
            <>
              <Link
                style={{ color: '#00C4C4' }}
                href="#"
                target="_blank"
                rel="noopener noreferrer"
              >
                {lang.borrow_landing.questions.bottom_link1}
              </Link>
              <Box display={{ s: 'none', m: 'inline-block' }}>
                <SeparatorDot mx="24px" />
              </Box>
            </>
          } */
          />
        </QuestionsWrapper>
      </StyledPageContentLayout>
    </BorrowBg>
  );
}

export default hot(Borrow);
