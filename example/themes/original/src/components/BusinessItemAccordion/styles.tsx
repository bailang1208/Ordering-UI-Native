import styled, { css } from 'styled-components/native';

export const BIContainer = styled.View`
  display: flex;
  flex-direction: column;
  width: 100%;
  opacity: 1;
  border-radius: 7.6px;
  overflow: hidden;
  min-height: 120px;
  ${(props: any) => props.isClosed && css`
	  opacity: 0.5;
    min-height: 60px;
  `}
`

export const BIHeader = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: relative;
  padding: 10px 0;
  background-color: ${(props: any) => props.theme.colors.white};
`

export const BIInfo = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 55%;
`

export const BIContent = styled.View`
`

export const BIContentInfo = styled.View`
  justify-content: center;
  text-transform: capitalize;
`

export const BITotal = styled.View`
  width: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const BIActions = styled.View`
  max-width: 30%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`

export const PriceContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex: 1
`
