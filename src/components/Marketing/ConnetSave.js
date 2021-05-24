import styled from 'styled-components';
import { Flex } from '@makerdao/ui-components-core';


const ConnectSave = styled(Flex)`
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 1140px;
  margin: 25px auto 0;
  padding: 30px 10px;
  

  .headline {
    margin-top: 7px;
    margin-bottom: 24px;
  }

  .connect-to-start {
    margin-top: 88px;
  }

  .button {
    margin-top: 24px;
    margin-bottom: 8px;
  }

  @media (min-width: ${props => props.theme.breakpoints.m}) {

    .headline {
      margin-top: 16px;
      margin-bottom: 15px;
    }

    .button {
      margin-top: 12px;
    }
  }
`;

export default ConnectSave;
