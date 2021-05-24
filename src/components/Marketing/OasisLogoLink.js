import React from 'react';
import { Link } from 'react-navi';
import styled from 'styled-components';
import useLanguage from 'hooks/useLanguage';
import { getColor, marketingTheme } from 'styles/theme';
import { ReactComponent as LogoImg } from 'images/landing/lf_logo.svg';

const StyledLink = styled(Link)`
  font-size: 22px;
  line-height: 26px;
  font-weight: bold;
  display: flex;
  color: #fff;
`;
const LogoDiv = styled.div`
  width: 30px;
  height: 30px;
  margin-right: 10px;
`;
export default styled(props => (
  <StyledLink {...props} href="/">
    <LogoDiv>
      <LogoImg />
    </LogoDiv>
    Freeliquid
  </StyledLink>
))``;
