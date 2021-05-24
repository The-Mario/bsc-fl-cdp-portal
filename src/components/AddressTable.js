import styled from 'styled-components';
import copy from '../images/copy.svg';

export const CopyBtn = styled.div`
  margin-left: 8px;
  margin-right: -8px;
  width: 24px;
  height: 24px;
  display: flex;
  cursor: pointer;
  &:hover {
    background-color: #222b3f;
  }
`;

export const CopyBtnIcon = styled.p`
  height: 14px;
  width: 14px;
  margin: auto;
  background: url(${copy}) no-repeat;
`;
