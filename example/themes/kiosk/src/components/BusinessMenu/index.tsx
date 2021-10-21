import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import {
  useLanguage,
  useOrder,
  useUtils,
} from 'ordering-components/native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'

import { Container } from '../../layouts/Container';
import { BusinessProductsListing } from '../../components/BusinessProductsListing';
import NavBar from '../../components/NavBar';
import { CartBottomSheet } from '../../components/CartBottomSheet';
import { CartContent } from '../../components/CartContent';

import { OText } from '../../components/shared';
import { PORTRAIT, useDeviceOrientation } from '../../../../../src/hooks/DeviceOrientation';
import { useCartBottomSheet } from '../../providers/CartBottomSheetProvider'
import { useTheme } from 'styled-components/native';

const BusinessMenu = (props:any): React.ReactElement => {
  const theme = useTheme()
  const [, t] = useLanguage()
  const [{ parsePrice }] = useUtils()
  const [orientationState] = useDeviceOrientation();
  const [bottomSheetVisibility, { showCartBottomSheet, hideCartBottomSheet }] = useCartBottomSheet();

  const { navigation, businessProductsListingProps } = props;

  const [{ carts }] = useOrder();
  const cartsList = (carts && Object.values(carts).filter((cart: any) => cart.products.length > 0)) || []
  const VISIBLE_CART_BOTTOM_SHEET_HEIGHT = orientationState?.dimensions?.height * (orientationState.orientation === PORTRAIT ? 0.5 : 1);

  let cart: any;

  if (cartsList?.length > 0) {
    cart = cartsList?.find((item: any) => item.business_id == businessProductsListingProps.slug);
  }

  const cartProps = {
    ...props,
    cart,
    isOrderStateCarts: !!carts,
    onNavigationRedirect: (route: string, params: any) => navigation.navigate(route, params),
    CustomCartComponent: CartBottomSheet,
    extraPropsCustomCartComponent: {
      orientationState,
      height: VISIBLE_CART_BOTTOM_SHEET_HEIGHT,
      visible: bottomSheetVisibility,
    },
    showNotFound: false,
    showCartBottomSheet
  }

  const goToBack = () => navigation.goBack()

  const onToggleCart = () => {
    if (bottomSheetVisibility) hideCartBottomSheet();
    else showCartBottomSheet();
  }

  return (
    <View style={{
      flex: 1,
      flexDirection: orientationState?.orientation === PORTRAIT ? 'column' : 'row'
    }}>
      <View
        style={{
          flex: 1,
          paddingBottom: bottomSheetVisibility && !!cart && orientationState?.orientation === PORTRAIT
            ? VISIBLE_CART_BOTTOM_SHEET_HEIGHT
            : 0,
        }}
      >
        <Container nopadding nestedScrollEnabled>
          <View style={{ paddingTop: 20 }}>
            <NavBar
              title={t('MENU', 'Menu')}
              onActionLeft={goToBack}
              includeOrderTypeSelector
              rightComponent={cart && (
                <TouchableOpacity
                  style={{ paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center' }}
                  onPress={onToggleCart}
                >
                  <OText
                    color={theme.colors.mediumGray}
                  >
                    {`${cart?.products?.length || 0} ${t('ITEMS', 'items')}`} {parsePrice(cart?.total || 0)} {' '}
                  </OText>

                  <MaterialIcon
                    name={bottomSheetVisibility ? "cart-off" : "cart-outline"}
                    color={theme.colors.primary}
                    size={30}
                  />
                </TouchableOpacity>
              )}
            />
          </View>

          <BusinessProductsListing
            { ...businessProductsListingProps }
          />
        </Container>
      </View>

        <View
          style={{
            flex: bottomSheetVisibility && orientationState?.orientation === PORTRAIT ? 0 : 0.8,
            position: bottomSheetVisibility ? 'relative' : 'absolute'
          }}
        >
          <CartContent
            {...cartProps}
          />
        </View>
    </View>
  );
};

export default BusinessMenu;
