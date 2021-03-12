import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, Alert } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Checkout as CheckoutController,
  useOrder,
  useSession,
  useApi,
  useLanguage,
  useUtils,
  useValidationFields,
  useConfig
} from 'ordering-components/native';

import { OText, OButton, OIcon } from '../shared';
import { IMAGES } from '../../config/constants';
import { colors } from '../../theme';

import { PaymentOptions } from '../PaymentOptions';
import { DriverTips } from '../DriverTips';

import {
  ChContainer,
  ChSection,
  ChHeader,
  ChTotal,
  ChTotalWrap,
  ChAddress,
  ChMoment,
  ChPaymethods,
  ChDriverTips,
  ChPlaceOrderBtn,
  ChErrors
} from './styles';

const DriverTipsOptions = [0, 10, 15, 20, 25];

const CheckoutUI = (props: any) => {
  const {
    navigation,
    cart,
    // errors,
    placing,
    cartState,
    businessDetails,
    paymethodSelected,
    handlePaymethodChange,
    handleOrderRedirect,
    handlerClickPlaceOrder,
  } = props

  const [, t] = useLanguage();
  const [{ user }] = useSession();
  const [{ parsePrice }] = useUtils()
  const [{ options, carts }] = useOrder();
  const [validationFields] = useValidationFields();

  const [errorCash, setErrorCash] = useState(false);
  const [userErrors, setUserErrors] = useState([]);
  const [isUserDetailsEdit, setIsUserDetailsEdit] = useState(false);

  const handlePlaceOrder = () => {
    if (!userErrors.length) {
      handlerClickPlaceOrder && handlerClickPlaceOrder()
      return
    }
    // setAlertState({
    //   open: true,
    //   content: Object.values(userErrors).map(error => error)
    // })
    console.log('error', userErrors);
    setIsUserDetailsEdit(true)
  }

  const handleEdit = () => { console.log('edit') }

  return (
    <ChContainer>
      <ChSection style={style.paddSection}>
        <OButton
          imgLeftSrc={IMAGES.arrow_left}
          imgRightSrc={null}
          style={style.btnBackArrow}
          onClick={() => navigation.goBack()}
        />
        <ChHeader>
          <OText size={24}>{t('CHECKOUT', 'Checkout')}</OText>
          <OText size={24}>{t('DELIVERY', 'Delivery')}</OText>
        </ChHeader>
      </ChSection>
      <ChSection>
        <ChTotal>
          <ChTotalWrap>
            <OIcon
              url={user?.photo}
              width={80}
              height={80}
              borderRadius={80}
            />
            <OText size={24} mLeft={10}>
              {t('DAKOTA_WINE', 'Dakota Wine')}
            </OText>
          </ChTotalWrap>
          <OText size={24}>
            {t('Total', '$73.22')}
          </OText>
        </ChTotal>
      </ChSection>
      <ChSection style={style.paddSection}>
        <ChAddress>
          <OText
            size={20}
            numberOfLines={1}
            ellipsizeMode='tail'
            style={{ width: '65%' }}
          >
            {t('ADDRESSSSS', '5th ave 111, new york, ny')}
          </OText>
          <OText
            size={18}
            style={{ flex: 1 }}
            color={colors.primary}
          >
            {t('VIEWMAP', 'View Map')}
          </OText>
          <MaterialIcon
            name='pencil-outline'
            size={28}
            onPress={() => handleEdit()}
          />
        </ChAddress>
      </ChSection>
      <ChSection style={style.paddSectionH}>
        <ChMoment>
          <OText
            size={20}
            ellipsizeMode='tail'
            style={{ flex: 1 }}
          >
            {t('MOMENTTTTT', 'ASAP')}
          </OText>
          <MaterialIcon
            name='pencil-outline'
            size={28}
            onPress={() => handleEdit()}
          />
        </ChMoment>
      </ChSection>

      {!cartState.loading && cart && (
        <ChSection style={style.paddSection}>
          <ChPaymethods>
            <OText size={20}>
              {t('PAYMENT_METHOD', 'Payment Method')}
            </OText>
            <PaymentOptions
              cart={cart}
              isDisabled={cart?.status === 2}
              businessId={businessDetails?.business?.id}
              isLoading={businessDetails.loading}
              paymethods={businessDetails?.business?.paymethods}
              onPaymentChange={handlePaymethodChange}
              errorCash={errorCash}
              setErrorCash={setErrorCash}
              handleOrderRedirect={handleOrderRedirect}
              isPaymethodNull={paymethodSelected}
            />
          </ChPaymethods>
        </ChSection>
      )}

      {!cartState.loading &&
        cart &&
        options.type === 1 &&
        cart?.status !== 2 &&
        validationFields?.fields?.checkout?.driver_tip?.enabled &&
      (
        <ChSection style={style.paddSectionH}>
          <ChDriverTips>
            <OText size={20}>
              {t('DRIVER_TIPS', 'Driver Tips')}
            </OText>
            <DriverTips
              businessId={cart?.business_id}
              driverTipsOptions={DriverTipsOptions}
              useOrderContext
            />
          </ChDriverTips>
        </ChSection>
      )}

      <ChSection style={style.paddSection}>
        <Text>cart Section</Text>
      </ChSection>

      {!cartState.loading && cart && cart?.status !== 2 && (
        <ChSection style={style.paddSectionH}>
          <ChPlaceOrderBtn>
            <OButton
              onClick={() => handlePlaceOrder()}
              bgColor={cart?.subtotal < cart?.minimum ? colors.secundary : colors.primary}
              borderColor={colors.primary}
              textStyle={{color: 'white'}}
              imgRightSrc={null}
              // isLoading={formState.loading}
              isDisabled={!cart?.valid || !paymethodSelected || placing || errorCash || cart?.subtotal < cart?.minimum}
              text={cart?.subtotal >= cart?.minimum ? (
                placing ? t('PLACING', 'Placing') : t('PLACE_ORDER', 'Place Order')
              ) : (
                `${t('MINIMUN_SUBTOTAL_ORDER', 'Minimum subtotal order:')} ${parsePrice(cart?.minimum)}`
              )}
            />
          </ChPlaceOrderBtn>
        </ChSection>
      )}

      <ChSection style={style.paddSection}>
        <ChErrors>
          {!cart?.valid_address && cart?.status !== 2 && (
            <OText
              color={colors.error}
              size={14}
            >
              {t('INVALID_CART_ADDRESS', 'Selected address is invalid, please select a closer address.')}
            </OText>
          )}

          {!paymethodSelected && cart?.status !== 2 && (
            <OText
              color={colors.error}
              size={14}
            >
              {t('WARNING_NOT_PAYMENT_SELECTED', 'Please, select a payment method to place order.')}
            </OText>
          )}

          {!cart?.valid_products && cart?.status !== 2 && (
            <OText
              color={colors.error}
              size={14}
            >
              {t('WARNING_INVALID_PRODUCTS', 'Some products are invalid, please check them.')}
            </OText>
          )}
        </ChErrors>
      </ChSection>
    </ChContainer>
  )
}

const style = StyleSheet.create({
  btnBackArrow: {
    borderWidth: 0,
    backgroundColor: '#FFF',
    borderColor: '#FFF',
    display: 'flex',
    justifyContent: 'flex-start',
    paddingLeft: 0
  },
  paddSection: {
    padding: 20
  },
  paddSectionH: {
    paddingHorizontal: 20
  }
})

export const Checkout = (props: any) => {
  const {
    errors,
    clearErrors,
    query,
    cartUuid,
    handleOrderRedirect,
    handleCheckoutRedirect,
    // handleSearchRedirect,
    // handleCheckoutListRedirect
  } = props

  const [orderState, { confirmCart }] = useOrder()
  const [{ token }] = useSession()
  const [ordering] = useApi()
  const [, t] = useLanguage()

  const [cartState, setCartState] = useState<any>({ loading: true, error: [], cart: null })

  // const [openUpselling, setOpenUpselling] = useState(false)
  // const [canOpenUpselling, setCanOpenUpselling] = useState(false)
  const [currentCart, setCurrentCart] = useState({ business_id: null, products: null })
  // const [alertState, setAlertState] = useState({ open: false, content: [] })

  // const cartsWithProducts = orderState?.carts && Object.values(orderState?.carts).filter(cart => cart.products.length) || null

  // const closeAlert = () => {
  //   setAlertState({
  //     open: false,
  //     content: []
  //   })
  //   clearErrors && clearErrors()
  // }

  // const handleUpsellingPage = () => {
  //   setOpenUpselling(false)
  //   setCurrentCart(null)
  //   setCanOpenUpselling(false)
  //   handleCheckoutRedirect(currentCart.uuid)
  // }

  useEffect(() => {
    if (!orderState.loading && currentCart?.business_id) {
      const cartMatched: any = Object.values(orderState.carts).find(
        (cart: any) => cart.business_id === currentCart?.business_id
      ) || {}
      setCurrentCart(cartMatched)
    }
  }, [orderState.loading])

  // useEffect(() => {
  //   if (currentCart?.products) {
  //     setOpenUpselling(true)
  //   }
  // }, [currentCart])

  // useEffect(() => {
  //   if (errors?.length) {
  //     setAlertState({
  //       open: true,
  //       content: errors
  //     })
  //   }
  // }, [errors])

  const getOrder = async (cartId: any) => {
    try {
      setCartState({ ...cartState, loading: true })
      const url = `${ordering.root}/carts/${cartId}`
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` }
      })
      const { result } = await response.json()

      if (result.status === 1 && result.order?.uuid) {
        handleOrderRedirect(result.order.uuid)
        setCartState({ ...cartState, loading: false })
      } else if (result.status === 2 && result.paymethod_data?.gateway === 'stripe_redirect' && query.get('payment_intent')) {
        try {
          const confirmCartRes = await confirmCart(cartUuid)
          if (confirmCartRes.error) {
            // setAlertState({
            //   open: true,
            //   content: [confirmCartRes.error.message]
            // })
            console.log('error');
          }
          if (confirmCartRes.result.order?.uuid) {
            handleOrderRedirect(confirmCartRes.result.order.uuid)
          }
          setCartState({
            ...cartState,
            loading: false,
            cart: result
          })
        } catch (error) {
          // setAlertState({
          //   open: true,
          //   content: [error.message]
          // })
          console.log('error');
        }
      } else {
        const cart = Array.isArray(result) ? null : result
        console.log('result cart', cart);
        setCartState({
          ...cartState,
          loading: false,
          cart,
          error: cart ? null : result
        })
      }
    } catch (e) {
      setCartState({
        ...cartState,
        loading: false,
        error: [e.toString()]
      })
    }
  }

  useEffect(() => {
    if (token && cartUuid) {
      getOrder(cartUuid)
    }
  }, [token, cartUuid])

  const checkoutProps = {
    ...props,
    UIComponent: CheckoutUI,
    cartState,
    businessId: cartState.cart?.business_id
  }

  return (
    <CheckoutController {...checkoutProps} />
  )
}
