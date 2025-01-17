import styled, { css } from 'styled-components/native';

export const Card = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
`;

export const Logo = styled.View`
  height: 65px;
  width: 65px;
`;

export const Information = styled.View`
  position: relative;
  justify-content: flex-start;
  margin-horizontal: 5px;
  flex: 1;
  max-height: 60px;
`;

export const MyOrderOptions = styled.View`
  flex-direction: column;
  justify-content: space-between;
`;

export const NotificationIcon = styled.View`
  position: absolute;
  left: 90%;
`

export const AcceptOrRejectOrder = styled.View`
  flex-direction: row;
  justify-content: space-between;
  flex: 1;
  margin: 10px;
`
export const Timestatus = styled.View`
  position: relative;;
  width: 4px;
  height: 55px;
  border-radius: 20px;
  top: 5px;
`