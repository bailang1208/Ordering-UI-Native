import styled from 'styled-components/native'

export const OSOrderDetailsWrapper = styled.View`
	background-color: ${(props: any) => props.theme.colors.whiteGray};
	padding: 20px;
	border-radius: 6px;
`

export const OSTable = styled.View`
  flex-direction: row;
  justify-content: space-between;
  flex: 1;
`

export const OSActions = styled.View`
  position: relative;
  bottom: 0px;
  width: 100%;
  background-color: #FFF;
	z-index: 1000;
	padding: 20px;
`

export const OSInputWrapper = styled.View`
	width: 100%;
	min-height: 150px;
  background-color: #FFF;
`

export const SentReceipt = styled.View`
  flex-direction: row;
`

export const Table = styled.View`
  flex-direction: row;
  justify-content: space-between;
  flex: 1;
  align-items: center;
`

export const OrderBill = styled.View`
  padding-horizontal: 30px;
  padding-vertical: 10px;
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.paleGray};
`

export const Total = styled.View`
  border-top-width: 1px;
  border-top-color: #d9d9d9;
  padding-vertical: 10px;
`

