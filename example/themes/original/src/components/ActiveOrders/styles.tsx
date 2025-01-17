import styled from 'styled-components/native'

export const ActiveOrdersContainer = styled.View`
  margin-bottom: 20px;
`

export const Card = styled.TouchableOpacity`
`

export const Map = styled.View`
  flex: 1;
  height: 125px;
  margin-bottom: 10px;
`

export const Information = styled.View`
  flex-direction: row;
  height: 100px;
  align-items: center;
  padding-vertical: 5px;
`

export const Logo = styled.View`
	border-radius: 7.6px;
	box-shadow: 0 1px 2px #0000001A;
`

export const OrderInformation = styled.View`
  flex-direction: row;
  justify-content: space-between;
  flex: 1;
  padding-left: 14px;
`

export const BusinessInformation = styled.View`
	flex-basis: 65%;
`

export const Price = styled.View`
  justify-content: space-between;
  align-items: flex-end;
  margin-left: 10px;
  width: 30%;
`

export const UnreadMessageCounter = styled.View`
  justify-content: center;
  align-items: center;
  margin-left: 10px;
  width: 24px;
  height: 24px;
  border-radius: 7.6px;
  background-color: ${(props: any) => props.theme.colors.primaryContrast};
`
export const LoadMore = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: 10px;
`