import React, { useState } from 'react';
import { ScrollView, Platform, View } from 'react-native';
import { useTheme } from 'styled-components/native';
import {
  Cart as CartController,
  useOrder,
  useLanguage,
  useConfig,
  useUtils,
  useValidationFields,
} from 'ordering-components/native';

import { CheckoutAction, OrderTypeWrapper, FloatingLayout } from './styles';

import { OSBill, OSCoupon, OSTable } from '../OrderSummary/styles';

import { OButton, OIcon, OModal, OText } from '../shared';
import { ProductForm } from '../ProductForm';
import { verifyDecimals } from '../../../../../src/utils';
import { Cart as TypeCart } from '../../types';
import CartItem from '../CartItem';
import NavBar from '../NavBar';
import { CouponControl } from '../CouponControl';
import { LANDSCAPE, PORTRAIT, useDeviceOrientation } from "../../../../../src/hooks/DeviceOrientation";
import { useCartBottomSheet } from '../../providers/CartBottomSheetProvider';
import { Container } from '../../../../../src/layouts/Container';
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
const CartUI = (props: any) => {
  const {
    cart,
    clearCart,
    changeQuantity,
    getProductMax,
    offsetDisabled,
    removeProduct,
    setIsCartsLoading,
    navigation,
  }: CartUIProps = props

  const theme = useTheme()
  const [, t] = useLanguage()
  const [orderState] = useOrder()
  const [{ configs }] = useConfig();
  const [{ parsePrice, parseNumber, parseDate }] = useUtils()
  const [validationFields] = useValidationFields()

  const [openProduct, setModalIsOpen] = useState(false)
  const [curProduct, setCurProduct] = useState<any>(null)
  const [orientationState] = useDeviceOrientation();
  const [, { hideCartBottomSheet }] = useCartBottomSheet();

  const selectedOrderType = orderState?.options?.type;

  const isCartPending = cart?.status === 2
  const isCouponEnabled = validationFields?.fields?.checkout?.coupon?.enabled

  const handleDeleteClick = (product: any) => {
    removeProduct(product, cart)
  }

  const handleEditProduct = (product: any) => {
    setCurProduct(product)
    setModalIsOpen(true)
  }

  const handlerProductAction = (product: any) => {
    if (Object.keys(product).length) {
      setModalIsOpen(false)
    }
  }

  const handleClearProducts = async () => {
    try {
      setIsCartsLoading && setIsCartsLoading(true)
      const result = await clearCart(cart?.uuid)
      setIsCartsLoading && setIsCartsLoading(false)
      navigation?.pop(2)
      hideCartBottomSheet()
    } catch (error) {
      setIsCartsLoading && setIsCartsLoading(false)
    }
  }

  const handleChangeOrderType = () => {
    navigation.push('DeliveryType', {
      callback: () => { navigation.pop(1) },
      goBack: () => { navigation.pop(1) },
    });
  }

  const goToBack = () => navigation.goBack();

  return (
    <>
      <Container>
        <NavBar
          title={t('CONFIRM_YOUR_ORDER', 'Confirm your order')}
          onActionLeft={goToBack}
          style={{ height: orientationState?.dimensions?.height * 0.08 }}
          btnStyle={{ paddingLeft: 0 }}
          rightComponent={(
            <OButton
              text={t('CANCEL_ORDER', 'Cancel order')}
              bgColor="transparent"
              borderColor="transparent"
              style={{ paddingEnd: 0 }}
              textStyle={{ color: theme.colors.primary, marginEnd: 0 }}
              onClick={handleClearProducts}
            />
          )}
        />

        <OrderTypeWrapper
          style={{ height: orientationState?.dimensions?.height * 0.08 }}
        >
          <OText
            weight="500"
            size={18}
            color={theme.colors.black}
          >
            {t('THIS_ORDER_IS_TO', 'This order is to')}
            {' '}
            {selectedOrderType === 2 && t('TAKE_OUT', 'Take out')}
            {selectedOrderType === 3 && t('EAT_IN', 'Eat in')}
          </OText>

          <OButton
            text={t('I_CHANGED_MY_MIND', 'I changed my mind')}
            bgColor="transparent"
            borderColor="transparent"
            style={{ paddingEnd: 0 }}
            textStyle={{ color: theme.colors.primary, marginEnd: 0, fontSize: 18 }}
            onClick={handleChangeOrderType}
          />
        </OrderTypeWrapper>

        <ScrollView
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={{
            minHeight: orientationState?.orientation == PORTRAIT
              ? orientationState?.dimensions?.height * 0.5
              : orientationState?.dimensions?.height * 0.35,
            maxHeight: orientationState?.orientation == PORTRAIT
              ? orientationState?.dimensions?.height * 0.5
              : orientationState?.dimensions?.height * 0.35,
          }}
        >
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              opacity: 1
            }}
          >
            {cart?.products?.length > 0 && cart?.products.map((product: any) => (
              <CartItem
                isCartProduct
                key={product.code}
                product={product}
                isCartPending={isCartPending}
                changeQuantity={changeQuantity}
                getProductMax={getProductMax}
                offsetDisabled={offsetDisabled}
                onDeleteProduct={handleDeleteClick}
                onEditProduct={handleEditProduct}
              />
            ))}
          </View>
        </ScrollView>

        <View style={{ marginTop: 10 }}>
          {cart?.valid_products && (
            <OSBill>
              <OSTable>
                <OText>{t('SUBTOTAL', 'Subtotal')}</OText>
                <OText>
                  {cart.business.tax_type === 1
                    ? parsePrice((cart?.subtotal + cart?.tax) || 0)
                    : parsePrice(cart?.subtotal || 0)}
                </OText>
              </OSTable>
              {cart?.discount > 0 && cart?.total >= 0 && orientationState?.orientation == PORTRAIT && (

                <OSTable
                  style={{
                    backgroundColor: theme.colors.success,
                    borderRadius: 6,
                    maxHeight: 60,
                    padding: 10
                  }}
                >
                  <View
                    style={{
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}
                  >
                    <AntDesignIcon name='checkcircle' size={24} color='#00D27A' />
                    {cart?.discount_type === 1 ? (
                      <OText
                        mLeft={15}
                      >
                        <OText color={theme.colors.green} size={16}>{`${t('VALID_CODE', 'Valid code')}! ${t('YOU_GOT', 'you got')} `}</OText>
                        <OText color={theme.colors.green} size={16} weight="700">{`${verifyDecimals(cart?.discount_rate, parseNumber)}% `}</OText>
                        <OText color={theme.colors.green} size={16}>{`${t('OFF', 'off')}`}</OText>
                      </OText>
                    ) : (
                      <OText
                        size={16}
                        mLeft={15}
                        color={theme.colors.green}
                      >
                        {`${t('VALID_CODE', 'Valid code')}! `}
                      </OText>
                    )}
                  </View>
                  <OText
                    size={16}
                    color={theme.colors.green}
                    weight="700"
                  >
                    - {parsePrice(cart?.discount || 0)}
                  </OText>
                </OSTable>
              )}
              {cart.business.tax_type !== 1 && (
                <OSTable>
                  <OText>
                    {t('TAX', 'Tax')}
                    {`(${verifyDecimals(cart?.business?.tax, parseNumber)}%)`}
                  </OText>
                  <OText>{parsePrice(cart?.tax || 0)}</OText>
                </OSTable>
              )}
              {selectedOrderType === 1 && cart?.delivery_price > 0 && (
                <OSTable>
                  <OText>{t('DELIVERY_FEE', 'Delivery Fee')}</OText>
                  <OText>{parsePrice(cart?.delivery_price)}</OText>
                </OSTable>
              )}
              {cart?.driver_tip > 0 && (
                <OSTable>
                  <OText>
                    {t('DRIVER_TIP', 'Driver tip')}
                    {cart?.driver_tip_rate > 0 &&
                      parseInt(configs?.driver_tip_type?.value, 10) === 2 &&
                      !!!parseInt(configs?.driver_tip_use_custom?.value, 10) &&
                      (
                        `(${parseNumber(cart?.driver_tip_rate)}%)`
                      )}
                  </OText>
                  <OText>{parsePrice(cart?.driver_tip)}</OText>
                </OSTable>
              )}
              {cart?.service_fee > 0 && (
                <OSTable>
                  <OText>
                    {t('SERVICE_FEE', 'Service Fee')}
                    {`(${verifyDecimals(cart?.business?.service_fee, parseNumber)}%)`}
                  </OText>
                  <OText>{parsePrice(cart?.service_fee)}</OText>
                </OSTable>
              )}
              {!cart?.discount_type && isCouponEnabled && !isCartPending && orientationState?.orientation == PORTRAIT && (
                <OSTable>
                  <OSCoupon>
                    <CouponControl
                      businessId={cart.business_id}
                      price={cart.total}
                    />
                  </OSCoupon>
                </OSTable>
              )}
              <OSTable>
                <OText weight='bold'>
                  {t('TOTAL', 'Total')}
                </OText>
                <OText weight='bold' color={theme.colors.primary}>
                  {cart?.total >= 1 && parsePrice(cart?.total)}
                </OText>
              </OSTable>
            </OSBill>
          )}
        </View>
      </Container>

      <>
        <FloatingLayout isIos={Platform.OS === 'ios'}>
          <CheckoutAction>
            <View style={{ display: 'flex', flexDirection: 'row' }}>
              {cart?.discount > 0 && cart?.total >= 0 && orientationState?.orientation == LANDSCAPE && (
                <OSTable
                  style={{
                    backgroundColor: theme.colors.success,
                    borderRadius: 6,
                    maxHeight: 60,
                    marginTop: 4,
                    padding: 10
                  }}
                >
                  <View
                    style={{
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}
                  >
                    <AntDesignIcon name='checkcircle' size={24} color='#00D27A' />
                    {cart?.discount_type === 1 ? (
                      <OText
                        mLeft={15}
                      >
                        <OText color={theme.colors.green} size={16}>{`${t('VALID_CODE', 'Valid code')}! ${t('YOU_GOT', 'you got')} `}</OText>
                        <OText color={theme.colors.green} size={16} weight="700">{`${verifyDecimals(cart?.discount_rate, parseNumber)}% `}</OText>
                        <OText color={theme.colors.green} size={16}>{`${t('OFF', 'off')}`}</OText>
                      </OText>
                    ) : (
                      <OText
                        size={16}
                        mLeft={15}
                        color={theme.colors.green}
                      >
                        {`${t('VALID_CODE', 'Valid code')}! `}
                      </OText>
                    )}
                  </View>

                  <OText
                    size={16}
                    color={theme.colors.green}
                    weight="700"
                  >- {parsePrice(cart?.discount || 0)}</OText>
                </OSTable>
              )}
              {!cart?.discount_type && isCouponEnabled && !isCartPending && orientationState?.orientation === LANDSCAPE && (
                <OSTable>
                  <OSCoupon>
                    <CouponControl
                      businessId={cart.business_id}
                      price={cart.total}
                    />
                  </OSCoupon>
                </OSTable>
              )}
              <View style={{
                width: orientationState?.orientation == LANDSCAPE ? '50%' : '100%',
                marginLeft: orientationState?.orientation == LANDSCAPE ? 16 : 0
              }}>
                <OButton
                  text={(cart?.subtotal >= cart?.minimum || !cart?.minimum) && cart?.valid_address ? (
                    `${t('CONFIRM_THIS_ORDER', 'Confirm this order')}`
                  ) : !cart?.valid_address ? (
                    `${t('OUT_OF_COVERAGE', 'Out of Coverage')}`
                  ) : (
                    `${t('MINIMUN_SUBTOTAL_ORDER', 'Minimum subtotal order:')} ${parsePrice(cart?.minimum)}`
                  )}
                  bgColor={(cart?.subtotal < cart?.minimum || !cart?.valid_address) ? theme.colors.secundary : theme.colors.primary}
                  isDisabled={cart?.subtotal < cart?.minimum || !cart?.valid_address}
                  borderColor={theme.colors.primary}
                  imgRightSrc={null}
                  textStyle={{ color: 'white', textAlign: 'center', flex: 1 }}
                  onClick={() => { navigation?.navigate('CustomerName', { cartUuid: cart?.uuid }) }}
                  style={{ width: '100%', marginTop: 4 }}
                />
              </View>
            </View>
          </CheckoutAction>
        </FloatingLayout>
      </>

      <OModal
        open={openProduct}
        entireModal
        customClose
        onClose={() => setModalIsOpen(false)}
      >
        <ProductForm
          productCart={curProduct}
          businessSlug={cart?.business?.slug}
          businessId={cart?.business_id}
          categoryId={curProduct?.category_id}
          productId={curProduct?.id}
          onSave={handlerProductAction}
          onClose={() => setModalIsOpen(false)}
        />

      </OModal>
    </>
  )
}

interface CartUIProps {
  cart: TypeCart,
  clearCart: any,
  changeQuantity: any,
  getProductMax: any,
  offsetDisabled: any,
  removeProduct: (product: any, cart: any) => void,
  handleCartOpen: any,
  setIsCartsLoading: any,
  isFromCart: any,
  navigation: any,
}

export const Cart = (props: any) => {
  const cartProps = {
    ...props,
    UIComponent: CartUI
  }

  return (
    <CartController {...cartProps} />
  )
}
