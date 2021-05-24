import React from 'react';
import { Link } from 'react-navi';
import styled from 'styled-components';
import { getColor } from 'styles/theme';
import { ReactComponent as LogoImg } from 'images/landing/logo_fl.svg';

const StyledLink = styled(Link)`
  font-size: 22px;
  line-height: 26px;
  font-weight: bold;
  display: flex;
  color: ${getColor('logo')};
`;
const LogoDiv = styled.div`
  display: flex;
  align-items: center;
`;
const LogoTitle = styled.div`
  margin-left: 10px;
  @media (max-width: 639px) {
    display: none;
  }
`;
export default styled(props => (
  <StyledLink {...props} href="/">
    <LogoDiv>
      <LogoImg style={{ width: '30px' }} />
      <LogoTitle style={{ color: getColor('whiteText')}}>Freeliquid</LogoTitle>
    </LogoDiv>
  </StyledLink>
))``;
