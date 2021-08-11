import * as React from 'react'
import styled, { css } from 'styled-components/native'
import { OButton, OIcon, OText } from '../shared'
import { colors, images, labels } from '../../theme.json'
import { TextStyle } from 'react-native'
import { ViewStyle } from 'react-native'

const Wrapper = styled.View`
  background-color: ${colors.white};
  padding: 4px 40px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: relative;
`
const TitleWrapper = styled.View`
  flex-direction: column;
  padding-horizontal: 10px;
`
const TitleTopWrapper = styled.View`
  flex-grow: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const btnBackArrow = {
  borderWidth: 0,
  backgroundColor: '#FFF',
  borderColor: '#FFF',
  shadowColor: '#FFF',
  paddingStart: 0,
  height: 40,
}

interface Props {
  navigation?: any,
  route?: any,
  title?: string,
  subTitle?: any,
  titleColor?: string,
  titleAlign?: any,
  withIcon?: boolean,
  icon?: any,
  leftImg?: any,
  isBackStyle?: boolean,
  onActionLeft?: () => void,
  onRightAction?: () => void,
  rightImg?: any,
  titleStyle?: TextStyle,
  btnStyle?: TextStyle,
  style?: ViewStyle,
  paddingTop?: number,
  noBorder?: boolean,
}

const NavBar = (props: Props) => {
  const goSupport = () => {
    props.navigation.navigate('Supports', {});
  }
  return (
    <Wrapper style={{ paddingTop: props.paddingTop, borderBottomWidth: props.noBorder ? 0 : 1, borderBottomColor: colors.border, ...props.style}}>
      <OButton
        imgLeftSrc={props.leftImg || images.general.arrow_left}
		  imgLeftStyle={{width: 14}}
        imgRightSrc={null}
        style={{ ...btnBackArrow, ...props.btnStyle }}
        onClick={props.onActionLeft}
      />
      <TitleTopWrapper style={{marginEnd: !props.rightImg ? 34 : 0}}>
        {props.withIcon
          ? (
              <OIcon
                url={props.icon}
                style={{
                  borderColor: colors.lightGray,
                  borderRadius: 20,
                }}
                width={60}
                height={60} 
              />
          )
          : null
        }
        <TitleWrapper>
          <OText
            weight={'600'}
            style={
              {
                textAlign: props.titleAlign ? props.titleAlign : 'center',
                color: props.titleColor || 'black',
                paddingHorizontal: props.titleAlign == 'left' ? 12 : 0,
					 ...labels.middle as TextStyle,
                ...props.titleStyle
              }
            }
          >
            {props.title || ''}
          </OText>
          {props.subTitle
            ? (props.subTitle)
            : null
          }
        </TitleWrapper>
      </TitleTopWrapper>
      { props.rightImg != null && (<OButton
          bgColor={colors.clear}
          borderColor={colors.clear}
			 style={{paddingEnd: 0}}
          imgRightSrc={null}
          imgLeftStyle={{ tintColor: colors.textPrimary, width: 16, height: 16 }}
          imgLeftSrc={props.rightImg || images.general.support}
          onClick={props.onRightAction || goSupport} />)
      }
    </Wrapper>
  )
}

NavBar.defaultProps = {
  title: '',
  textAlign: 'center'
};

export default NavBar;