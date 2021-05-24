import styled from 'styled-components';
import { Box } from '@makerdao/ui-components-core';
import { getColor } from 'styles/theme';
const Button = styled(Box)`
  border-radius: 40px;
  background-color: ${getColor('cayn')};
  color: ${getColor('cardBg')};
  border: 1px solid ${getColor('cayn')};
  display: inline-flex;
  padding: 13px 0px 13px;
  align-items: center;
  justify-content: center;
  font-style: normal;
  font-size: 1em;
  line-height: 18px;
  text-align: center;
  letter-spacing: 0.5px;
  transition: background-color 0.2s ease 0s;
  cursor: pointer;
`;

const FilledButton = styled(Button)`
  background-color: ${getColor('cayn')};
  color: ${getColor('cardBg')};
  font-weight: bold;
  :hover {
    background-color: ${getColor('cardBg')};
    color: ${getColor('cayn')};
  }
  @media (max-width: 767px) {
    background-color: ${getColor('cayn')}!important;
    color: ${getColor('cardBg')}!important;
    font-weight: bold;
  }
  @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
    background-color: ${getColor('cayn')}!important;
    color: ${getColor('cardBg')}!important;
  }
`;

export { FilledButton };
