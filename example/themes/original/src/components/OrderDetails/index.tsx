import React, { useState, useEffect } from 'react';
import { View, StyleSheet, BackHandler, Platform, Linking } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { _setStoreData } from '../../providers/StoreUtil';
import {
  useLanguage,
  OrderDetails as OrderDetailsConTableoller,
  useUtils,
  useOrder,
  useConfig
} from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import {
  OrderDetailsContainer,
  Header,
  OrderContent,
  OrderBusiness,
  OrderData,
  OrderInfo,
  StaturBar,
  OrderCustomer,
  InfoBlock,
  HeaderInfo,
  Customer,
  OrderProducts,
  Table,
  OrderBill,
  Total,
  Icons,
  OrderDriver,
  Map,
  Divider,
  OrderAction
} from './styles';
import { OButton, OIcon, OModal, OText } from '../shared';
import { ProductItemAccordion } from '../ProductItemAccordion';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { OrderDetailsParams } from '../../types';
import { GoogleMap } from '../GoogleMap';
import { verifyDecimals } from '../../utils';
import { OSRow } from '../OrderSummary/styles';
import AntIcon from 'react-native-vector-icons/AntDesign'
import { TaxInformation } from '../TaxInformation';
import { Placeholder, PlaceholderLine } from 'rn-placeholder';

export const OrderDetailsUI = (props: OrderDetailsParams) => {
  const {
    navigation,
    messages,
    setMessages,
    readMessages,
    isFromCheckout,
    driverLocation,
    onNavigationRedirect,
    reorderState,
    handleReorder
  } = props;

  const theme = useTheme();

  const styles = StyleSheet.create({
    rowDirection: {
      flexDirection: 'row',
    },
    statusBar: {
      height: 12,
    },
    logo: {
      width: 75,
      height: 75,
      borderRadius: 10,
    },
    textBold: {
      fontWeight: 'bold',
    },
    btnBackArrow: {
      borderWidth: 0,
      backgroundColor: theme.colors.clear,
      borderColor: theme.colors.clear,
      shadowColor: theme.colors.clear,
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      paddingLeft: 0,
      height: 30,
      width: 40,
    },
  });

  const [, t] = useLanguage();
  const [{ parsePrice, parseNumber, parseDate }] = useUtils();
  const [{ configs }] = useConfig();
  const [{ carts }] = useOrder()

  const [isReviewed, setIsReviewed] = useState(false)
  const [openTaxModal, setOpenTaxModal] = useState<any>({ open: false, tax: null, type: '' })
  const { order, businessData } = props.order;

  const walletName: any = {
    cash: {
      name: t('PAY_WITH_CASH_WALLET', 'Pay with Cash Wallet'),
    },
    credit_point: {
      name: t('PAY_WITH_CREDITS_POINTS_WALLET', 'Pay with Credit Points Wallet'),
    }
  }

  const getOrderStatus = (s: string) => {
    const status = parseInt(s);
    const orderStatus = [
      {
        key: 0,
        value: t('PENDING', 'Pending'),
        slug: 'PENDING',
        percentage: 0.25,
        image: theme.images.order.status0,
      },
      {
        key: 1,
        value: t('COMPLETED', 'Completed'),
        slug: 'COMPLETED',
        percentage: 1,
        image: theme.images.order.status1,
      },
      {
        key: 2,
        value: t('REJECTED', 'Rejected'),
        slug: 'REJECTED',
        percentage: 0,
        image: theme.images.order.status2,
      },
      {
        key: 3,
        value: t('DRIVER_IN_BUSINESS', 'Driver in business'),
        slug: 'DRIVER_IN_BUSINESS',
        percentage: 0.6,
        image: theme.images.order.status3,
      },
      {
        key: 4,
        value: t('PREPARATION_COMPLETED', 'Preparation Completed'),
        slug: 'PREPARATION_COMPLETED',
        percentage: 0.7,
        image: theme.images.order.status4,
      },
      {
        key: 5,
        value: t('REJECTED_BY_BUSINESS', 'Rejected by business'),
        slug: 'REJECTED_BY_BUSINESS',
        percentage: 0,
        image: theme.images.order.status5,
      },
      {
        key: 6,
        value: t('REJECTED_BY_DRIVER', 'Rejected by Driver'),
        slug: 'REJECTED_BY_DRIVER',
        percentage: 0,
        image: theme.images.order.status6,
      },
      {
        key: 7,
        value: t('ACCEPTED_BY_BUSINESS', 'Accepted by business'),
        slug: 'ACCEPTED_BY_BUSINESS',
        percentage: 0.35,
        image: theme.images.order.status7,
      },
      {
        key: 8,
        value: t('ACCEPTED_BY_DRIVER', 'Accepted by driver'),
        slug: 'ACCEPTED_BY_DRIVER',
        percentage: 0.45,
        image: theme.images.order.status8,
      },
      {
        key: 9,
        value: t('PICK_UP_COMPLETED_BY_DRIVER', 'Pick up completed by driver'),
        slug: 'PICK_UP_COMPLETED_BY_DRIVER',
        percentage: 0.8,
        image: theme.images.order.status9,
      },
      {
        key: 10,
        value: t('PICK_UP_FAILED_BY_DRIVER', 'Pick up Failed by driver'),
        slug: 'PICK_UP_FAILED_BY_DRIVER',
        percentage: 0,
        image: theme.images.order.status10,
      },
      {
        key: 11,
        value: t(
          'DELIVERY_COMPLETED_BY_DRIVER',
          'Delivery completed by driver',
        ),
        slug: 'DELIVERY_COMPLETED_BY_DRIVER',
        percentage: 1,
        image: theme.images.order.status11,
      },
      {
        key: 12,
        value: t('DELIVERY_FAILED_BY_DRIVER', 'Delivery Failed by driver'),
        slug: 'DELIVERY_FAILED_BY_DRIVER',
        percentage: 0,
        image: theme.images.order.status12,
      },
      {
        key: 13,
        value: t('PREORDER', 'PreOrder'),
        slug: 'PREORDER',
        percentage: 0,
        image: theme.images.order.status13,
      },
      {
        key: 14,
        value: t('ORDER_NOT_READY', 'Order not ready'),
        slug: 'ORDER_NOT_READY',
        percentage: 0,
        image: theme.images.order.status13,
      },
      {
        key: 15,
        value: t(
          'ORDER_PICKEDUP_COMPLETED_BY_CUSTOMER',
          'Order picked up completed by customer',
        ),
        slug: 'ORDER_PICKEDUP_COMPLETED_BY_CUSTOMER',
        percentage: 100,
        image: theme.images.order.status1,
      },
      {
        key: 16,
        value: t('CANCELLED_BY_CUSTOMER', 'Cancelled by customer'),
        slug: 'CANCELLED_BY_CUSTOMER',
        percentage: 0,
        image: theme.images.order.status2,
      },
      {
        key: 17,
        value: t(
          'ORDER_NOT_PICKEDUP_BY_CUSTOMER',
          'Order not picked up by customer',
        ),
        slug: 'ORDER_NOT_PICKEDUP_BY_CUSTOMER',
        percentage: 0,
        image: theme.images.order.status2,
      },
      {
        key: 18,
        value: t(
          'DRIVER_ALMOST_ARRIVED_TO_BUSINESS',
          'Driver almost arrived to business',
        ),
        slug: 'DRIVER_ALMOST_ARRIVED_TO_BUSINESS',
        percentage: 0.15,
        image: theme.images.order.status3,
      },
      {
        key: 19,
        value: t(
          'DRIVER_ALMOST_ARRIVED_TO_CUSTOMER',
          'Driver almost arrived to customer',
        ),
        slug: 'DRIVER_ALMOST_ARRIVED_TO_CUSTOMER',
        percentage: 0.9,
        image: theme.images.order.status11,
      },
      {
        key: 20,
        value: t(
          'ORDER_CUSTOMER_ALMOST_ARRIVED_BUSINESS',
          'Customer almost arrived to business',
        ),
        slug: 'ORDER_CUSTOMER_ALMOST_ARRIVED_BUSINESS',
        percentage: 90,
        image: theme.images.order.status7,
      },
      {
        key: 21,
        value: t(
          'ORDER_CUSTOMER_ARRIVED_BUSINESS',
          'Customer arrived to business',
        ),
        slug: 'ORDER_CUSTOMER_ARRIVED_BUSINESS',
        percentage: 95,
        image: theme.images.order.status7,
      },
      {
        key: 22,
        value: t('ORDER_LOOKING_FOR_DRIVER', 'Looking for driver'),
        slug: 'ORDER_LOOKING_FOR_DRIVER',
        percentage: 35,
        image: theme.images.order.status8
      },
      {
        key: 23,
        value: t('ORDER_DRIVER_ON_WAY', 'Driver on way'),
        slug: 'ORDER_DRIVER_ON_WAY',
        percentage: 45,
        image: theme.images.order.status8
      }
    ];

    const objectStatus = orderStatus.find((o) => o.key === status);

    return objectStatus && objectStatus;
  };

  const handleGoToMessages = (type: string) => {
    readMessages && readMessages();
    navigation.navigate(
      'MessageDetails',
      {
        type,
        order,
        messages,
        setMessages,
        orderId: order?.id,
        business: type === 'business',
        driver: type === 'driver',
        onClose: () => navigation?.canGoBack()
          ? navigation.goBack()
          : navigation.navigate('BottomTab', { screen: 'MyOrders' }),
      }
    )
  }

  const handleArrowBack: any = () => {
    if (!isFromCheckout) {
      navigation?.canGoBack() && navigation.goBack();
      return;
    }
    navigation.navigate('BottomTab');
  };

  const getIncludedTaxes = () => {
    if (order?.taxes?.length === 0) {
      return order.tax_type === 1 ? order?.summary?.tax ?? 0 : 0
    } else {
      return order?.taxes.reduce((taxIncluded: number, tax: any) => {
        return taxIncluded + (tax.type === 1 ? tax.summary?.tax : 0)
      }, 0)
    }
  }

  const getIncludedTaxesDiscounts = () => {
    return order?.taxes?.filter((tax: any) => tax?.type === 1)?.reduce((carry: number, tax: any) => carry + (tax?.summary?.tax_after_discount ?? tax?.summary?.tax), 0)
  }

  const handleClickOrderReview = (order: any) => {
    navigation.navigate(
      'ReviewOrder',
      {
        order: {
          id: order?.id,
          business_id: order?.business_id,
          logo: order.business?.logo,
          driver: order?.driver,
          products: order?.products,
          review: order?.review,
          user_review: order?.user_review
        },
        setIsReviewed
      }
    )
  }


  useEffect(() => {
    if (reorderState?.error) {
      const _businessId = 'businessId:' + businessData?.id
      const _uuid = carts[_businessId]?.uuid
      if (_uuid) {
        _setStoreData('remove-cartId', JSON.stringify(_uuid))
        navigation.navigate('Business', { store: businessData?.slug })
      }
    }
    if (!reorderState?.error && reorderState?.result?.uuid) {
      onNavigationRedirect && onNavigationRedirect('CheckoutNavigator', { cartUuid: reorderState?.result.uuid })
    }
  }, [reorderState])

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleArrowBack);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleArrowBack);
    };
  }, []);

  const locations = [
    {
      ...order?.driver?.location,
      title: t('DRIVER', 'Driver'),
      icon:
        order?.driver?.photo ||
        'https://res.cloudinary.com/demo/image/fetch/c_thumb,g_face,r_max/https://www.freeiconspng.com/thumbs/driver-icon/driver-icon-14.png',
    },
    {
      ...order?.business?.location,
      title: order?.business?.name,
      icon: order?.business?.logo || theme.images.dummies.businessLogo,
    },
    {
      ...order?.customer?.location,
      title: t('YOUR_LOCATION', 'Your Location'),
      icon:
        order?.customer?.photo ||
        'https://res.cloudinary.com/demo/image/upload/c_thumb,g_face,r_max/d_avatar.png/non_existing_id.png',
    },
  ];

  useEffect(() => {
    if (driverLocation) {
      locations[0] = driverLocation;
    }
  }, [driverLocation]);

  return (
    <OrderDetailsContainer keyboardShouldPersistTaps="handled">
      {(!order || Object.keys(order).length === 0) && (
        <Placeholder style={{ marginTop: 30 }}>
          <Header>
            <OrderInfo>
              <OrderData>
                <PlaceholderLine width={60} height={15} />
                <PlaceholderLine width={60} height={10} />
                <StaturBar>
                  <PlaceholderLine height={15} />
                  <PlaceholderLine width={40} height={20} />
                </StaturBar>
              </OrderData>
              <View
                style={{
                  height: 8,
                  backgroundColor: theme.colors.backgroundGray100,
                  marginTop: 18,
                  marginHorizontal: -40,
                }}
              />
            </OrderInfo>
          </Header>
          <OrderContent>
            <OrderBusiness>
              <PlaceholderLine width={30} height={20} />
              <PlaceholderLine width={60} height={15} />
              <PlaceholderLine width={75} height={10} />
              <PlaceholderLine width={40} height={10} />
              <PlaceholderLine width={95} height={10} />
            </OrderBusiness>
          </OrderContent>
          <View
            style={{
              height: 8,
              backgroundColor: theme.colors.backgroundGray100,
              marginTop: 18,
              marginHorizontal: -40,
            }}
          />
          <OrderCustomer>
            <PlaceholderLine width={20} height={20} />
            <PlaceholderLine width={70} height={15} />
            <PlaceholderLine width={65} height={10} />
            <PlaceholderLine width={80} height={10} />
            <PlaceholderLine width={70} height={10} />
            <View style={{ marginTop: 10 }}>
              <PlaceholderLine width={60} height={20} />
              <PlaceholderLine width={40} height={10} />
            </View>
          </OrderCustomer>
        </Placeholder>
      )}
      {order && Object.keys(order).length > 0 && (
        <>
          <Header>
            <OButton
              imgLeftSrc={theme.images.general.arrow_left}
              imgRightSrc={null}
              style={styles.btnBackArrow}
              onClick={() => handleArrowBack()}
              imgLeftStyle={{ tintColor: theme.colors.disabled }}
            />
            <OrderInfo>
              <OrderData>
                <OText
                  size={20}
                  lineHeight={30}
                  weight={'600'}
                  color={theme.colors.textNormal}>
                  {t('ORDER', 'Order')} #{order?.id}
                </OText>
                <OText size={12} lineHeight={18} color={theme.colors.textNormal}>
                  {order?.delivery_datetime_utc
                    ? parseDate(order?.delivery_datetime_utc)
                    : parseDate(order?.delivery_datetime, { utc: false })}
                </OText>
                {
                  (
                    parseInt(order?.status) === 1 ||
                    parseInt(order?.status) === 11 ||
                    parseInt(order?.status) === 15
                  ) && !order.review && !isReviewed && (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={{ marginTop: 6 }}
                      onPress={() => handleClickOrderReview(order)}

                    >
                      <OText
                        size={10}
                        lineHeight={15}
                        color={theme.colors.textSecondary}
                        style={{ textDecorationLine: 'underline' }}
                      >
                        {t('REVIEW_YOUR_ORDER', 'Review your order')}
                      </OText>
                    </TouchableOpacity>
                  )}
                <StaturBar>
                  <LinearGradient
                    start={{ x: 0.0, y: 0.0 }}
                    end={{
                      x: getOrderStatus(order?.status)?.percentage || 0,
                      y: 0,
                    }}
                    locations={[0.9999, 0.9999]}
                    colors={[theme.colors.primary, theme.colors.backgroundGray100]}
                    style={styles.statusBar}
                  />
                </StaturBar>
                <OText
                  size={16}
                  lineHeight={24}
                  weight={'600'}
                  color={theme.colors.textNormal}>
                  {getOrderStatus(order?.status)?.value}
                </OText>
              </OrderData>
              <View
                style={{
                  height: 8,
                  backgroundColor: theme.colors.backgroundGray100,
                  marginTop: 18,
                  marginHorizontal: -40,
                }}
              />
            </OrderInfo>
          </Header>
          <OrderContent>
            <OrderBusiness>
              <OText
                size={16}
                lineHeight={24}
                weight={'500'}
                color={theme.colors.textNormal}
                mBottom={12}>
                {t('FROM', 'From')}
              </OText>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <OText
                    size={13}
                    lineHeight={20}
                    color={theme.colors.textNormal}
                    style={{ flexGrow: 1, flexBasis: '80%' }}>
                    {order?.business?.name}
                  </OText>
                  <Icons>
                    {!!order?.business?.cellphone && (
                      <TouchableOpacity
                        onPress={() => order?.business?.cellphone &&
                          Linking.openURL(`tel:${order?.business?.cellphone}`)
                        }
                        style={{ paddingEnd: 5 }}
                      >
                        <OIcon
                          src={theme.images.general.phone}
                          width={16}
                          color={theme.colors.disabled}
                        />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={{ paddingStart: 5 }}
                      onPress={() => handleGoToMessages('business')}>
                      <OIcon
                        src={theme.images.general.chat}
                        width={16}
                        color={theme.colors.disabled}
                      />
                    </TouchableOpacity>
                  </Icons>
                </View>
                <OText
                  size={12}
                  lineHeight={18}
                  color={theme.colors.textNormal}
                  mBottom={2}>
                  {order?.business?.email}
                </OText>
                {!!order?.business?.cellphone && (
                  <OText
                    size={12}
                    lineHeight={18}
                    color={theme.colors.textNormal}
                    mBottom={2}>
                    {order?.business?.cellphone}
                  </OText>
                )}
                <OText size={12} lineHeight={18} color={theme.colors.textNormal}>
                  {order?.business?.address}
                </OText>
              </View>
            </OrderBusiness>
            <View
              style={{
                height: 8,
                backgroundColor: theme.colors.backgroundGray100,
                marginTop: 18,
                marginHorizontal: -40,
              }}
            />
            <OrderCustomer>
              <OText
                size={16}
                lineHeight={24}
                weight={'500'}
                color={theme.colors.textNormal}
                mBottom={12}>
                {t('TO', 'To')}
              </OText>
              <Customer>
                <InfoBlock>
                  <OText
                    size={12}
                    lineHeight={18}
                    color={theme.colors.textNormal}
                    mBottom={2}>
                    {order?.customer?.name} {order?.customer?.lastname}
                  </OText>
                  <OText
                    size={12}
                    lineHeight={18}
                    color={theme.colors.textNormal}
                    mBottom={2}>
                    {order?.customer?.address}
                  </OText>
                  <OText
                    size={12}
                    lineHeight={18}
                    color={theme.colors.textNormal}
                    mBottom={2}>
                    {order?.customer?.cellphone}
                  </OText>
                </InfoBlock>
              </Customer>
              {order?.delivery_option !== undefined && order?.delivery_type === 1 && (
                <View style={{ marginTop: 15 }}>
                  <OText size={16} style={{ textAlign: 'left' }} color={theme.colors.textNormal}>
                    {t('DELIVERY_PREFERENCE', 'Delivery Preference')}
                  </OText>
                  <OText size={12} style={{ textAlign: 'left' }} color={theme.colors.textNormal}>
                    {order?.delivery_option?.name ? t(order?.delivery_option?.name.toUpperCase().replace(/\s/g, '_')) : t('EITHER_WAY', 'Either way')}
                  </OText>
                </View>
              )}
              {order?.comment && (
                <View style={{ marginTop: 15 }}>
                  <OText size={16} style={{ textAlign: 'left' }} color={theme.colors.textNormal}>
                    {t('COMMENT', 'Comment')}
                  </OText>
                  <OText size={12} style={{ textAlign: 'left' }} color={theme.colors.textNormal}>{order?.comment}</OText>
                </View>
              )}
              {order?.driver && (
                <>
                  {order?.driver?.location && parseInt(order?.status) === 9 && (
                    <Map>
                      <GoogleMap
                        location={order?.driver?.location}
                        locations={locations}
                        readOnly
                      />
                    </Map>
                  )}
                </>
              )}
            </OrderCustomer>
            {order?.driver && (
              <>
                <View
                  style={{
                    height: 8,
                    backgroundColor: theme.colors.backgroundGray100,
                    marginTop: 18,
                    marginHorizontal: -40,
                  }}
                />
                <OrderDriver>
                  <OText size={16} lineHeight={24} weight={'500'} style={{ marginBottom: 10 }}>{t('YOUR_DRIVER', 'Your Driver')}</OText>
                  <Customer>
                    <InfoBlock>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                        <OText size={12} lineHeight={18} color={theme.colors.textNormal} mBottom={2} style={{ flexGrow: 1, flexBasis: '80%' }}>
                          {order?.driver?.name} {order?.driver?.lastname}
                        </OText>
                        <Icons>
                          <TouchableOpacity
                            onPress={() => handleGoToMessages('driver')}>
                            <OIcon
                              src={theme.images.general.chat}
                              width={16}
                              color={theme.colors.disabled}
                            />
                          </TouchableOpacity>
                        </Icons>
                      </View>
                      <OText size={12} lineHeight={18} color={theme.colors.textNormal} mBottom={2}>
                        {order?.driver?.cellphone}
                      </OText>
                    </InfoBlock>
                  </Customer>
                </OrderDriver>
              </>
            )}
            <View
              style={{
                height: 8,
                backgroundColor: theme.colors.backgroundGray100,
                marginTop: 18,
                marginHorizontal: -40,
              }}
            />
            <HeaderInfo>
              <OText
                size={24}
                color={theme.colors.textNormal}
                style={{ fontWeight: Platform.OS == 'ios' ? '600' : 'bold', marginBottom: 16 }}>
                {t(
                  'YOUR_ORDER_HAS_BEEN_RECEIVED',
                  'Your Order has been received',
                )}
              </OText>
              <OText color={theme.colors.textNormal} size={14} weight={'500'}>
                {t(
                  'ORDER_MESSAGE_HEADER_TEXT',
                  'Once business accepts your order, we will send you an email, thank you!',
                )}
              </OText>
              <OrderAction>
                <OButton
                  text={t('YOUR_ORDERS', 'Your Orders')}
                  textStyle={{ fontSize: 14, color: theme.colors.primary }}
                  imgRightSrc={null}
                  borderColor={theme.colors.primary}
                  bgColor={theme.colors.clear}
                  style={{ borderRadius: 7.6, borderWidth: 1, height: 44, shadowOpacity: 0 }}
                  parentStyle={{ marginTop: 29, marginEnd: 15 }}
                  onClick={() => navigation.navigate('BottomTab', { screen: 'MyOrders' })}
                />
                {(
                  parseInt(order?.status) === 1 ||
                  parseInt(order?.status) === 2 ||
                  parseInt(order?.status) === 5 ||
                  parseInt(order?.status) === 6 ||
                  parseInt(order?.status) === 10 ||
                  parseInt(order?.status) === 11 ||
                  parseInt(order?.status) === 12
                ) && (
                    <OButton
                      text={order.id === reorderState?.loading ? t('LOADING', 'Loading..') : t('REORDER', 'Reorder')}
                      textStyle={{ fontSize: 14, color: theme.colors.primary }}
                      imgRightSrc={null}
                      borderColor='transparent'
                      bgColor={theme.colors.primary + 10}
                      style={{ borderRadius: 7.6, borderWidth: 1, height: 44, shadowOpacity: 0, marginTop: 29 }}
                      onClick={() => handleReorder && handleReorder(order.id)}
                    />
                  )}
              </OrderAction>
            </HeaderInfo>
            <OrderProducts>
              {order?.products?.length &&
                order?.products.map((product: any, i: number) => (
                  <ProductItemAccordion
                    key={product?.id || i}
                    product={product}
                    isFromCheckout
                  />
                ))}
            </OrderProducts>
            <OrderBill>
              <View style={{ height: 1, backgroundColor: theme.colors.border, marginBottom: 17 }} />
              <Table>
                <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>{t('SUBTOTAL', 'Subtotal')}</OText>
                <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>
                  {parsePrice(((order?.summary?.subtotal ?? order?.subtotal) + getIncludedTaxes()))}
                </OText>
              </Table>
              {(order?.summary?.discount > 0 ?? order?.discount > 0) && order?.offers?.length === 0 && (
                <Table>
                  {order?.offer_type === 1 ? (
                    <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>
                      {t('DISCOUNT', 'Discount')}
                      <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>{`(${verifyDecimals(
                        order?.offer_rate,
                        parsePrice,
                      )}%)`}</OText>
                    </OText>
                  ) : (
                    <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>{t('DISCOUNT', 'Discount')}</OText>
                  )}
                  <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>
                    - {parsePrice(order?.summary?.discount || order?.discount)}
                  </OText>
                </Table>
              )}
              {
                order?.offers?.length > 0 && order?.offers?.filter((offer: any) => offer?.target === 1)?.map((offer: any) => (
                  <Table key={offer.id}>
                    <OSRow>
                      <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal} numberOfLines={1}>
                        {offer.name}
                        {offer.rate_type === 1 && (
                          <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>{`(${verifyDecimals(offer?.rate, parsePrice)}%)`}</OText>
                        )}
                      </OText>
                      <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => setOpenTaxModal({ open: true, data: offer, type: 'offer_target_1' })}>
                        <AntIcon name='infocirlceo' size={16} color={theme.colors.primary} />
                      </TouchableOpacity>
                    </OSRow>
                    <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>- {parsePrice(offer?.summary?.discount)}</OText>
                  </Table>
                ))
              }
              <Divider />
              {order?.summary?.subtotal_with_discount > 0 && order?.summary?.discount > 0 && order?.summary?.total >= 0 && (
                <Table>
                  <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>{t('SUBTOTAL_WITH_DISCOUNT', 'Subtotal with discount')}</OText>
                  {order?.tax_type === 1 ? (
                    <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>{parsePrice((order?.summary?.subtotal_with_discount + getIncludedTaxesDiscounts() ?? 0))}</OText>
                  ) : (
                    <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>{parsePrice(order?.summary?.subtotal_with_discount ?? 0)}</OText>
                  )}
                </Table>
              )}
              {
                order?.taxes?.length === 0 && order?.tax_type === 2 && (
                  <Table>
                    <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>
                      {t('TAX', 'Tax')} {`(${verifyDecimals(order?.tax, parseNumber)}%)`}
                    </OText>
                    <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>{parsePrice(order?.summary?.tax || 0)}</OText>
                  </Table>
                )
              }
              {
                order?.fees?.length === 0 && (
                  <Table>
                    <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>
                      {t('SERVICE_FEE', 'Service fee')}
                      {`(${verifyDecimals(order?.service_fee, parseNumber)}%)`}
                    </OText>
                    <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>{parsePrice(order?.summary?.service_fee || 0)}</OText>
                  </Table>
                )
              }
              {
                order?.taxes?.length > 0 && order?.taxes?.filter((tax: any) => tax?.type === 2 && tax?.rate !== 0).map((tax: any) => (
                  <Table key={tax.id}>
                    <OSRow>
                      <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal} numberOfLines={1}>
                        {tax.name || t('INHERIT_FROM_BUSINESS', 'Inherit from business')}
                        {`(${verifyDecimals(tax?.rate, parseNumber)}%)`}{' '}
                      </OText>
                      <TouchableOpacity onPress={() => setOpenTaxModal({ open: true, data: tax, type: 'tax' })}>
                        <AntIcon name='infocirlceo' size={16} color={theme.colors.primary} />
                      </TouchableOpacity>
                    </OSRow>
                    <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>{parsePrice(tax?.summary?.tax_after_discount ?? tax?.summary?.tax ?? 0)}</OText>
                  </Table>
                ))
              }
              {
                order?.fees?.length > 0 && order?.fees?.filter((fee: any) => !(fee.fixed === 0 && fee.percentage === 0))?.map((fee: any) => (
                  <Table key={fee.id}>
                    <OSRow>
                      <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal} numberOfLines={1}>
                        {fee.name || t('INHERIT_FROM_BUSINESS', 'Inherit from business')}
                        ({fee?.fixed > 0 && `${parsePrice(fee?.fixed)} + `}{fee.percentage}%){' '}
                      </OText>
                      <TouchableOpacity onPress={() => setOpenTaxModal({ open: true, data: fee, type: 'fee' })}>
                        <AntIcon name='infocirlceo' size={16} color={theme.colors.primary} />
                      </TouchableOpacity>
                    </OSRow>
                    <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>{parsePrice(fee?.summary?.fixed + (fee?.summary?.percentage_after_discount ?? fee?.summary?.percentage) ?? 0)}</OText>
                  </Table>
                ))
              }
              {
                order?.offers?.length > 0 && order?.offers?.filter((offer: any) => offer?.target === 3)?.map((offer: any) => (
                  <Table key={offer.id}>
                    <OSRow>
                      <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal} numberOfLines={1}>
                        {offer.name}
                        {offer.rate_type === 1 && (
                          <OText>{`(${verifyDecimals(offer?.rate, parsePrice)}%)`}</OText>
                        )}
                      </OText>
                      <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => setOpenTaxModal({ open: true, data: offer, type: 'offer_target_3' })}>
                        <AntIcon name='infocirlceo' size={16} color={theme.colors.primary} />
                      </TouchableOpacity>
                    </OSRow>
                    <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>- {parsePrice(offer?.summary?.discount)}</OText>
                  </Table>
                ))
              }
              {order?.summary?.delivery_price > 0 && (
                <Table>
                  <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>{t('DELIVERY_FEE', 'Delivery Fee')}</OText>
                  <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>{parsePrice(order?.summary?.delivery_price)}</OText>
                </Table>
              )}
              {
                order?.offers?.length > 0 && order?.offers?.filter((offer: any) => offer?.target === 2)?.map((offer: any) => (
                  <Table key={offer.id}>
                    <OSRow>
                      <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal} numberOfLines={1}>
                        {offer.name}
                        {offer.rate_type === 1 && (
                          <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>{`(${verifyDecimals(offer?.rate, parsePrice)}%)`}</OText>
                        )}
                      </OText>
                      <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => setOpenTaxModal({ open: true, data: offer, type: 'offer_target_2' })}>
                        <AntIcon name='infocirlceo' size={16} color={theme.colors.primary} />
                      </TouchableOpacity>
                    </OSRow>
                    <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>- {parsePrice(offer?.summary?.discount)}</OText>
                  </Table>
                ))
              }
              {order?.summary?.driver_tip > 0 && (
                <Table>
                  <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>
                    {t('DRIVER_TIP', 'Driver tip')}
                    {order?.summary?.driver_tip > 0 &&
                      parseInt(configs?.driver_tip_type?.value, 10) === 2 &&
                      !parseInt(configs?.driver_tip_use_custom?.value, 10) &&
                      (
                        `(${verifyDecimals(order?.summary?.driver_tip, parseNumber)}%)`
                      )}
                  </OText>
                  <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>{parsePrice(order?.summary?.driver_tip ?? order?.totalDriverTip)}</OText>
                </Table>
              )}
              <Total>
                <Table>
                  <OText size={20} lineHeight={30} weight={'600'} color={theme.colors.textNormal}>{t('TOTAL', 'Total')}</OText>
                  <OText size={20} lineHeight={30} weight={'600'} color={theme.colors.textNormal}>
                    {parsePrice(order?.summary?.total ?? order?.total)}
                  </OText>
                </Table>
              </Total>
              {order?.payment_events?.length > 0 && (
                <View style={{ marginTop: 10 }}>
                  <OText size={20} weight='bold' color={theme.colors.textNormal}>{t('PAYMENTS', 'Payments')}</OText>
                  <View
                    style={{
                      width: '100%',
                      marginTop: 10
                    }}
                  >
                    {order?.payment_events?.map((event: any) => event.amount > 0 && (
                      <View
                        key={event.id}
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: 10
                        }}
                      >
                        <View
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          <OText>
                            {event?.wallet_event
                              ? walletName[event?.wallet_event?.wallet?.type]?.name
                              : event?.paymethod?.name}
                          </OText>
                          {event?.data?.charge_id && (
                            <OText>
                              {`${t('CODE', 'Code')}: ${event?.data?.charge_id}`}
                            </OText>
                          )}
                        </View>
                        <OText>
                          -{parsePrice(event.amount)}
                        </OText>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </OrderBill>
          </OrderContent>
        </>
      )}
      <OModal
        open={openTaxModal.open}
        onClose={() => setOpenTaxModal({ open: false, data: null, type: '' })}
        entireModal
        title={`${openTaxModal.data?.name ||
          t('INHERIT_FROM_BUSINESS', 'Inherit from business')} ${openTaxModal.data?.rate_type !== 2 ? `(${typeof openTaxModal.data?.rate === 'number' ? `${openTaxModal.data?.rate}%` : `${parsePrice(openTaxModal.data?.fixed ?? 0)} + ${openTaxModal.data?.percentage}%`})` : ''}  `}
      >
        <TaxInformation
          type={openTaxModal.type}
          data={openTaxModal.data}
          products={order?.products}
        />
      </OModal>
    </OrderDetailsContainer>
  );
};

export const OrderDetails = (props: OrderDetailsParams) => {
  const orderDetailsProps = {
    ...props,
    UIComponent: OrderDetailsUI,
  };

  return <OrderDetailsConTableoller {...orderDetailsProps} />;
};
