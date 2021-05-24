import { Box } from '@makerdao/ui-components-core';
import { getColor } from 'styles/theme';

import FullWidth from './FullWidth';
import Questions, {
  buildQuestionsFromLangObj,
  QuestionsWrapper
} from './Questions';
import { FilledButton } from './Buttons';
import ConnectHero from './ConnectHero';
import Quotes, { QuotesFadeIn } from './Quotes';
import GradientBox from './GradientBox';
import Features from './Features';
import styled from 'styled-components';
import LogoLink from './LogoLink';
import Logo from './Logo';
import FixedHeaderTrigger from './FixedHeaderTrigger';
import Parallaxed from './Parallaxed';
import FadeIn from './FadeIn';
import Hamburger from './Hamburger';
import { BorrowCalculator, SaveCalculator } from './Calculators';
import PageHead from './PageHead';
import TokenIcon from './TokenIcon';
import MarketsTable from './MarketsTable';

import PageContentLayout from 'layouts/PageContentLayout';

const ThickUnderline = styled.div`
  background: none;
  display: inline-block;

  :after {
    content: '';
    display: block;
    height: 5px;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.15);
    width: 100%;
    position: absolute;
    bottom: 3px;
    z-index: -1;
    background: ${props => props.background};
  }
`;

const SeparatorDot = styled(Box)`
  display: inline-block;
  width: 4px;
  height: 4px;
  border-radius: 2px;
  background-color: ${getColor('cardBg')};
  opacity: 0.2;
`;

const StyledPageContentLayout = styled(PageContentLayout).attrs(() => ({
  p: { s: `25px 0px`, l: '0px' }
}))``;

export {
  FullWidth,
  Questions,
  QuestionsWrapper,
  buildQuestionsFromLangObj,
  FilledButton,
  ConnectHero,
  ThickUnderline,
  SeparatorDot,
  Quotes,
  GradientBox,
  QuotesFadeIn,
  Features,
  LogoLink,
  Logo,
  FixedHeaderTrigger,
  Parallaxed,
  FadeIn,
  Hamburger,
  BorrowCalculator,
  SaveCalculator,
  StyledPageContentLayout,
  PageHead,
  TokenIcon,
  MarketsTable
};
