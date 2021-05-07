import React from 'react';
import { TouchableOpacity } from 'react-native';
import { LogoutAction } from 'ordering-components/native';

import { OIcon } from '../shared';
import { IMAGES } from '../../config/constants';
import { colors } from '../../theme.json';

const LogoutButtonUI = (props: any) => {
  const { handleLogoutClick } = props

  return (
    <TouchableOpacity
      onPress={() => handleLogoutClick()}
    >
      <OIcon
        src={IMAGES.menulogout}
        width={28}
        height={28}
        color={colors.disabledContrast}
      />
    </TouchableOpacity>
  )
}

export const LogoutButton = (props: any) => {
  const logoutProps = {
    ...props,
    isNative: true,
    UIComponent: LogoutButtonUI
  }
  return (
    <LogoutAction {...logoutProps} />
  )
}
