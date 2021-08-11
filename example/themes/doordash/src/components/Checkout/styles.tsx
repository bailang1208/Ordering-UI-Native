import { Platform } from 'react-native';
import styled, { css } from 'styled-components/native';
import { colors } from '../../theme.json';

export const ChContainer = styled.View`
	padding-horizontal: 0px;
  margin-bottom: 60px;
`

export const ChSection = styled.View`
	border-bottom-width: 1px;
  border-bottom-color: ${colors.border};
  padding-vertical: 16px;
`

export const ChHeader = styled.View`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  margin: 0px;
`

export const ChTotal = styled.View`
  background-color: ${colors.inputDisabled};
  padding: 10px 20px;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
`

export const ChTotalWrap = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
`

export const ChAddress = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

export const ChMoment = styled(ChAddress)`
  padding: 0 0 20px;
`

export const CHMomentWrapper = styled.TouchableOpacity`
  background-color: ${colors.inputDisabled};
  border-radius: 10px;
  width: 100%;
  padding: 10px;
  display: flex;
  justify-content: center;
  flex-direction: row;
`

export const ChUserDetails = styled.View`
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;
`

export const ChBusinessDetails = styled(ChUserDetails)`
`

export const ChPaymethods = styled.View`
  display: flex;
  flex-direction: column;
  padding: 0 0 20px;
`

export const ChDriverTips = styled(ChPaymethods)``

export const ChCart = styled(ChPaymethods)``

export const ChPlaceOrderBtn = styled.View`
  width: 100%;
  display: flex;
  justify-content: center;
`

export const ChErrors = styled.View`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`