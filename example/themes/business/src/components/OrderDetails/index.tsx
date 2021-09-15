import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder';
import { useTheme } from 'styled-components/native';
import {
  ToastType,
  useToast,
  useLanguage,
  OrderDetails as OrderDetailsController,
  useUtils,
  useConfig,
  useSession,
} from 'ordering-components/native';
import {
  Actions,
  OrderDetailsContainer,
  Header,
  OrderContent,
  OrderBusiness,
  OrderCustomer,
  OrderHeader,
  OrderProducts,
  Table,
  OrderBill,
  Total,
  Pickup,
  AssignDriver,
  DriverItem,
} from './styles';
import { AcceptOrRejectOrder } from '../AcceptOrRejectOrder';
import { Chat } from '../Chat';
import { FloatingButton } from '../FloatingButton';
import { ProductItemAccordion } from '../ProductItemAccordion';
import { GoogleMap } from '../GoogleMap';
import { OButton, OModal, OText, OIconButton, OIcon } from '../shared';
import { OrderDetailsParams } from '../../types';
import { verifyDecimals } from '../../utils';
import { USER_TYPE } from '../../config/constants';
import CountryPicker from 'react-native-country-picker-modal';

export const OrderDetailsUI = (props: OrderDetailsParams) => {
  const {
    navigation,
    messages,
    setMessages,
    readMessages,
    messagesReadList,
    handleAssignDriver,
    handleChangeOrderStatus,
    isFromCheckout,
    driverLocation,
    actions,
    titleAccept,
    titleReject,
    appTitle,
  } = props;

  const theme = useTheme();
  const [, t] = useLanguage();
  const [{ parsePrice, parseNumber, parseDate }] = useUtils();
  const [{ user, token }] = useSession();
  const [{ configs }] = useConfig();
  const [, { showToast }] = useToast();
  const [unreadAlert, setUnreadAlert] = useState({
    business: false,
    driver: false,
  });
  const { order, businessData, loading } = props.order;
  const { drivers, loadingDriver } = props.drivers;
  const itemsDrivers: any = [];
  const [actionOrder, setActionOrder] = useState('');
  const [openModalForBusiness, setOpenModalForBusiness] = useState(false);
  const [openModalForAccept, setOpenModalForAccept] = useState(false);
  const [openModalForMapView, setOpenModalForMapView] = useState(false);
  const [isDriverModalVisible, setIsDriverModalVisible] = useState(false);

  if (order?.status === 7 || order?.status === 4) {
    if (drivers?.length > 0 && drivers) {
      drivers.forEach((driver: any) => {
        itemsDrivers.push({
          available: driver?.available,
          key: driver?.id,
          value: driver?.id,
          label: driver?.name,
        });
      });

      if (
        !drivers?.some((driver: any) => driver?.id === order?.driver?.id) &&
        order?.driver?.id
      ) {
        itemsDrivers.push({
          available: order?.driver?.available,
          key: order?.driver?.id,
          value: order?.driver?.id,
          label: order?.driver?.name,
        });
      }
    }

    if (order?.driver && (!drivers?.length || drivers?.length === 0)) {
      itemsDrivers.push({
        available: order?.driver?.available,
        key: order?.driver?.id,
        value: order?.driver?.id,
        label: order?.driver?.name,
      });
    }

    if (order?.driver) {
      itemsDrivers.push({
        available: true,
        key: null,
        value: null,
        label: t('UNASSIGN_DRIVER', 'Unassign Driver'),
      });
    }

    if (itemsDrivers.length > 0) {
      itemsDrivers.sort((a: any, b: any) => {
        if (a.available > b.available) return -1;
      });
    }
  }

  const handleCopyClipboard = () => {
    const name = `${t('NAME', 'Name')}: ${order?.customer?.name || null}`;
    const customerPhone = `${t('PHONE', 'Phone')}: ${
      order?.customer?.cellphone || null
    }`;
    const email = `${t('EMAIL', 'Email')}: ${order?.customer.email || null}`;
    const payment = `${t('PAYMENT', 'Payment')}: ${
      order?.paymethod?.name || null
    }`;
    const businessPhone = `${t('BUSINESS_PHONE', 'Bussines Phone')}: ${
      order?.bussines?.cellphone || null
    }`;
    const address = `${t('ADDRESS', 'Address')}: ${order?.customer?.address}`;
    const addressNotes = order?.customer?.address_notes
      ? `${t('ADDRESS_NOTES', 'Address Notes')}: ${
          order?.customer?.address_notes
        }\n`
      : '';
    const productsInArray =
      order?.products.length &&
      order?.products.map((product: any, i: number) => {
        return `  ${product?.quantity} X ${product?.name} ${parsePrice(
          product.total || product.price,
        )}\n`;
      });
    const productsInString = productsInArray.join(' ');
    const orderDetails = `${t(
      'ORDER_DETAILS',
      'Order Details',
    )}:\n${productsInString}`;
    const subtotal = `${t('SUBTOTAL', 'Subtotal')}: ${parsePrice(
      order?.subtotal,
    )}`;
    const tax = `${t('TAX', 'tax')} (${verifyDecimals(
      order?.tax,
      parseNumber,
    )}%): ${parsePrice(order?.summary?.tax || order?.totalTax)}`;
    const deliveryFee = `${t('DELIVERY_FEE', 'Delivery fee')} ${parsePrice(
      order?.summary?.delivery_price || order?.deliveryFee,
    )}`;
    const total = `${t('TOTAL', 'Total')} ${parsePrice(
      order?.summary?.total || order?.total,
    )}`;

    Clipboard.setString(
      `${name} \n${customerPhone} \n${email} \n${payment} \n${businessPhone} \n${address} \n${addressNotes} ${orderDetails} \n${subtotal} \n${tax} \n${deliveryFee} \n${total}`,
    );

    showToast(
      ToastType.Info,
      t('COPY_TO_CLIPBOARD', 'Copy to clipboard.'),
      1000,
    );
  };

  const getOrderStatus = (s: string) => {
    const status = parseInt(s);
    const orderStatus = [
      {
        key: 0,
        value: t('PENDING', 'Pending'),
        slug: 'PENDING',
        percentage: 0.25,
      },
      {
        key: 1,
        value: t('COMPLETED', 'Completed'),
        slug: 'COMPLETED',
        percentage: 1,
      },
      {
        key: 2,
        value: t('REJECTED', 'Rejected'),
        slug: 'REJECTED',
        percentage: 0,
      },
      {
        key: 3,
        value: t('DRIVER_IN_BUSINESS', 'Driver in business'),
        slug: 'DRIVER_IN_BUSINESS',
        percentage: 0.6,
      },
      {
        key: 4,
        value: t('PREPARATION_COMPLETED', 'Preparation Completed'),
        slug: 'PREPARATION_COMPLETED',
        percentage: 0.7,
      },
      {
        key: 5,
        value: t('REJECTED', 'Rejected'),
        slug: 'REJECTED_BY_BUSINESS',
        percentage: 0,
      },
      {
        key: 6,
        value: t('REJECTED_BY_DRIVER', 'Rejected by Driver'),
        slug: 'REJECTED_BY_DRIVER',
        percentage: 0,
      },
      {
        key: 7,
        value: t('ACCEPTED_BY_BUSINESS', 'Accepted by business'),
        slug: 'ACCEPTED_BY_BUSINESS',
        percentage: 0.35,
      },
      {
        key: 8,
        value: t('ACCEPTED_BY_DRIVER', 'Accepted by driver'),
        slug: 'ACCEPTED_BY_DRIVER',
        percentage: 0.45,
      },
      {
        key: 9,
        value: t('PICK_UP_COMPLETED_BY_DRIVER', 'Pick up completed by driver'),
        slug: 'PICK_UP_COMPLETED_BY_DRIVER',
        percentage: 0.8,
      },
      {
        key: 10,
        value: t('PICK_UP_FAILED_BY_DRIVER', 'Pick up Failed by driver'),
        slug: 'PICK_UP_FAILED_BY_DRIVER',
        percentage: 0,
      },
      {
        key: 11,
        value: t(
          'DELIVERY_COMPLETED_BY_DRIVER',
          'Delivery completed by driver',
        ),
        slug: 'DELIVERY_COMPLETED_BY_DRIVER',
        percentage: 1,
      },
      {
        key: 12,
        value: t('DELIVERY_FAILED_BY_DRIVER', 'Delivery Failed by driver'),
        slug: 'DELIVERY_FAILED_BY_DRIVER',
        percentage: 0,
      },
      {
        key: 13,
        value: t('PREORDER', 'PreOrder'),
        slug: 'PREORDER',
        percentage: 0,
      },
      {
        key: 14,
        value: t('ORDER_NOT_READY', 'Order not ready'),
        slug: 'ORDER_NOT_READY',
        percentage: 0,
      },
      {
        key: 15,
        value: t(
          'ORDER_PICKEDUP_COMPLETED_BY_CUSTOMER',
          'Order picked up completed by customer',
        ),
        slug: 'ORDER_PICKEDUP_COMPLETED_BY_CUSTOMER',
        percentage: 100,
      },
      {
        key: 16,
        value: t('CANCELLED_BY_CUSTOMER', 'Cancelled by customer'),
        slug: 'CANCELLED_BY_CUSTOMER',
        percentage: 0,
      },
      {
        key: 17,
        value: t(
          'ORDER_NOT_PICKEDUP_BY_CUSTOMER',
          'Order not picked up by customer',
        ),
        slug: 'ORDER_NOT_PICKEDUP_BY_CUSTOMER',
        percentage: 0,
      },
      {
        key: 18,
        value: t(
          'DRIVER_ALMOST_ARRIVED_TO_BUSINESS',
          'Driver almost arrived to business',
        ),
        slug: 'DRIVER_ALMOST_ARRIVED_TO_BUSINESS',
        percentage: 0.15,
      },
      {
        key: 19,
        value: t(
          'DRIVER_ALMOST_ARRIVED_TO_CUSTOMER',
          'Driver almost arrived to customer',
        ),
        slug: 'DRIVER_ALMOST_ARRIVED_TO_CUSTOMER',
        percentage: 0.9,
      },
      {
        key: 20,
        value: t(
          'ORDER_CUSTOMER_ALMOST_ARRIVED_BUSINESS',
          'Customer almost arrived to business',
        ),
        slug: 'ORDER_CUSTOMER_ALMOST_ARRIVED_BUSINESS',
        percentage: 90,
      },
      {
        key: 21,
        value: t(
          'ORDER_CUSTOMER_ARRIVED_BUSINESS',
          'Customer arrived to business',
        ),
        slug: 'ORDER_CUSTOMER_ARRIVED_BUSINESS',
        percentage: 95,
      },
    ];

    const objectStatus = orderStatus.find(o => o.key === status);

    return objectStatus && objectStatus;
  };

  const handleOpenMessagesForBusiness = () => {
    setOpenModalForBusiness(true);
    readMessages && readMessages();
    setUnreadAlert({ ...unreadAlert, business: false });
  };

  const handleViewActionOrder = (action: string) => {
    if (openModalForMapView) {
      setOpenModalForMapView(false);
    }
    setActionOrder(action);
    setOpenModalForAccept(true);
  };

  const handleViewSummaryOrder = () => {
    navigation?.navigate &&
      navigation.navigate('OrderSummary', {
        order,
        orderStatus: getOrderStatus(order?.status)?.value,
      });
  };

  const handleCloseModal = () => {
    setOpenModalForBusiness(false);
  };

  const handleOpenMapView = () => {
    setOpenModalForMapView(!openModalForMapView);
  };

  const colors: any = {
    0: theme.colors.statusOrderBlue,
    1: theme.colors.statusOrderGreen,
    5: theme.colors.statusOrderRed,
    7: theme.colors.statusOrderBlue,
    8: theme.colors.statusOrderBlue,
  };

  const handleArrowBack: any = () => {
    navigation?.canGoBack() && navigation.goBack();
  };

  useEffect(() => {
    if (messagesReadList?.length) {
      openModalForBusiness
        ? setUnreadAlert({ ...unreadAlert, business: false })
        : setUnreadAlert({ ...unreadAlert, driver: false });
    }
  }, [messagesReadList]);

  const locations = [
    {
      ...order?.driver?.location,
      title: t('DRIVER', 'Driver'),
      icon:
        order?.driver?.photo ||
        'https://res.cloudinary.com/demo/image/fetch/c_thumb,g_face,r_max/https://www.freeiconspng.com/thumbs/driver-icon/driver-icon-14.png',
      level: 4,
    },
    {
      ...order?.business?.location,
      title: order?.business?.name,
      icon: order?.business?.logo || theme.images.dummies.businessLogo,
      level: 2,
    },
    {
      ...order?.customer?.location,
      title: t('CUSTOMER', 'Customer'),
      icon:
        order?.customer?.photo ||
        'https://res.cloudinary.com/demo/image/upload/c_thumb,g_face,r_max/d_avatar.png/non_existing_id.png',
      level: 3,
    },
  ];

  useEffect(() => {
    if (openModalForAccept) {
      setOpenModalForAccept(false);
    }

    if (openModalForBusiness) {
      setOpenModalForBusiness(false);
    }

    if (openModalForMapView) {
      setOpenModalForMapView(false);
    }
  }, [loading]);

  const showFloatButtonsAcceptOrReject: any = {
    0: true,
  };

  useEffect(() => {
    if (driverLocation) {
      locations[0] = { ...locations[0], driverLocation };
    }
  }, [driverLocation]);

  const styles = StyleSheet.create({
    driverOff: {
      backgroundColor: theme.colors.notAvailable,
    },
    rowDirection: {
      flexDirection: 'row',
    },
    statusBar: {
      height: 10,
    },
    logo: {
      width: 75,
      height: 75,
      borderRadius: 10,
    },
    textBold: {
      fontWeight: '600',
    },
    btnPickUp: {
      borderWidth: 0,
      backgroundColor: theme.colors.btnBGWhite,
      borderRadius: 8,
    },
    btnBackArrow: {
      borderWidth: 0,
      backgroundColor: theme.colors.backgroundLight,
      borderColor: theme.colors.primary,
      shadowColor: theme.colors.primary,
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      paddingLeft: 0,
      height: 14,
    },
    icons: {
      maxWidth: 40,
      height: 25,
    },
  });

  const locationsToSend = locations.filter(
    (location: any) => location?.lat && location?.lng,
  );

  return (
    <>
      {(!order || Object.keys(order).length === 0) && (
        <View
          style={{
            padding: 20,
            backgroundColor: theme.colors.backgroundLight,
          }}>
          {[...Array(6)].map((item, i) => (
            <Placeholder key={i} Animation={Fade}>
              <View style={{ flexDirection: 'row', marginBottom: 30 }}>
                <Placeholder>
                  <PlaceholderLine width={90} />
                  <PlaceholderLine width={50} />
                  <PlaceholderLine width={20} />
                  <PlaceholderLine width={10} />
                </Placeholder>
              </View>
            </Placeholder>
          ))}
        </View>
      )}

      {order && Object.keys(order).length > 0 && (
        <>
          <Header>
            <OIconButton
              icon={theme.images.general.arrow_left}
              iconStyle={{ width: 20, height: 20 }}
              borderColor={theme.colors.clear}
              style={{ ...styles.icons, justifyContent: 'flex-end' }}
              onClick={() => handleArrowBack()}
            />

            <Actions>
              <OIconButton
                icon={theme.images.general.map}
                iconStyle={{
                  width: 20,
                  height: 20,
                  tintColor: theme.colors.backArrow,
                }}
                borderColor={theme.colors.clear}
                style={styles.icons}
                onClick={() => handleOpenMapView()}
              />

              <OIconButton
                icon={theme.images.general.messages}
                iconStyle={{
                  width: 20,
                  height: 20,
                  tintColor: theme.colors.backArrow,
                }}
                borderColor={theme.colors.clear}
                style={styles.icons}
                onClick={() => handleOpenMessagesForBusiness()}
              />
            </Actions>
          </Header>
          <OrderHeader>
            <OText size={13} style={{ marginBottom: 5 }}>
              {order?.delivery_datetime_utc
                ? parseDate(order?.delivery_datetime_utc)
                : parseDate(order?.delivery_datetime, { utc: false })}
            </OText>

            <OText numberOfLines={2} size={20} weight="600">
              <>
                {`${t('INVOICE_ORDER_NO', 'Order No.')} ${order.id} ${t(
                  'IS',
                  'is',
                )} `}
                <OText
                  size={20}
                  weight="600"
                  color={colors[order?.status] || theme.colors.primary}>
                  {getOrderStatus(order?.status)?.value}
                </OText>
              </>
            </OText>
          </OrderHeader>
          <OrderDetailsContainer keyboardShouldPersistTaps="handled">
            <>
              <OrderContent>
                <OrderBusiness>
                  <OText style={{ marginBottom: 5 }} size={16} weight="600">
                    {t('BUSINESS_DETAILS', 'Business details')}
                  </OText>

                  <OText numberOfLines={1} mBottom={4} ellipsizeMode="tail">
                    {order?.business?.name}
                  </OText>

                  <OText numberOfLines={1} mBottom={4} ellipsizeMode="tail">
                    {order?.business?.email}
                  </OText>

                  <OText numberOfLines={1} mBottom={4} ellipsizeMode="tail">
                    {order?.business?.cellphone}
                  </OText>

                  <OText numberOfLines={1} mBottom={4} ellipsizeMode="tail">
                    {order?.business?.address}
                  </OText>
                </OrderBusiness>

                <OrderCustomer>
                  <OText style={{ marginBottom: 5 }} size={16} weight="600">
                    {t('CUSTOMER_DETAILS', 'Customer details')}
                  </OText>

                  <OText numberOfLines={1} mBottom={4} ellipsizeMode="tail">
                    {order?.customer?.name}
                  </OText>

                  <OText numberOfLines={1} mBottom={4} ellipsizeMode="tail">
                    {order?.customer?.email}
                  </OText>

                  <OText numberOfLines={1} mBottom={4} ellipsizeMode="tail">
                    {order?.customer?.cellphone}
                  </OText>

                  <OText numberOfLines={1} mBottom={4} ellipsizeMode="tail">
                    {order?.customer?.address}
                  </OText>
                </OrderCustomer>

                <OrderProducts>
                  <OText style={{ marginBottom: 5 }} size={16} weight="600">
                    {t('ORDER_DETAILS', 'Order Details')}
                  </OText>

                  {order?.products?.length &&
                    order?.products.map((product: any, i: number) => (
                      <ProductItemAccordion
                        key={product?.id || i}
                        product={product}
                        comment={order.comment ? order.comment : ' '}
                      />
                    ))}
                </OrderProducts>

                <OrderBill>
                  <Table>
                    <OText mBottom={4}>{t('SUBTOTAL', 'Subtotal')}</OText>

                    <OText mBottom={4}>{parsePrice(order?.subtotal)}</OText>
                  </Table>

                  {order?.tax_type !== 1 && (
                    <Table>
                      <OText mBottom={4}>
                        {t('TAX', 'Tax')}
                        {`(${verifyDecimals(order?.tax, parseNumber)}%)`}
                      </OText>

                      <OText mBottom={4}>
                        {parsePrice(order?.summary?.tax || order?.totalTax)}
                      </OText>
                    </Table>
                  )}

                  {(order?.summary?.discount > 0 || order?.discount > 0) && (
                    <Table>
                      {order?.offer_type === 1 ? (
                        <OText mBottom={4}>
                          <OText>{t('DISCOUNT', 'Discount')}</OText>

                          <OText>
                            {`(${verifyDecimals(
                              order?.offer_rate,
                              parsePrice,
                            )}%)`}
                          </OText>
                        </OText>
                      ) : (
                        <OText mBottom={4}>{t('DISCOUNT', 'Discount')}</OText>
                      )}

                      <OText mBottom={4}>
                        -{' '}
                        {parsePrice(
                          order?.summary?.discount || order?.discount,
                        )}
                      </OText>
                    </Table>
                  )}

                  {(order?.summary?.delivery_price > 0 ||
                    order?.deliveryFee > 0) && (
                    <Table>
                      <OText mBottom={4}>
                        {t('DELIVERY_FEE', 'Delivery Fee')}
                      </OText>

                      <OText mBottom={4}>
                        {parsePrice(
                          order?.summary?.delivery_price || order?.deliveryFee,
                        )}
                      </OText>
                    </Table>
                  )}

                  <Table>
                    <OText mBottom={4}>
                      {t('DRIVER_TIP', 'Driver tip')}
                      {(order?.summary?.driver_tip > 0 ||
                        order?.driver_tip > 0) &&
                        parseInt(configs?.driver_tip_type?.value, 10) === 2 &&
                        !parseInt(configs?.driver_tip_use_custom?.value, 10) &&
                        `(${verifyDecimals(order?.driver_tip, parseNumber)}%)`}
                    </OText>

                    <OText mBottom={4}>
                      {parsePrice(
                        order?.summary?.driver_tip || order?.totalDriverTip,
                      )}
                    </OText>
                  </Table>

                  <Table>
                    <OText mBottom={4}>
                      {t('SERVICE_FEE', 'Service Fee')}
                      {`(${verifyDecimals(order?.service_fee, parseNumber)}%)`}
                    </OText>

                    <OText mBottom={4}>
                      {parsePrice(
                        order?.summary?.service_fee || order?.serviceFee || 0,
                      )}
                    </OText>
                  </Table>

                  <Total>
                    <Table>
                      <OText mBottom={4} style={styles.textBold}>
                        {t('TOTAL', 'Total')}
                      </OText>

                      <OText
                        mBottom={4}
                        style={styles.textBold}
                        color={theme.colors.primary}>
                        {parsePrice(order?.summary?.total || order?.total)}
                      </OText>
                    </Table>
                  </Total>
                </OrderBill>
              </OrderContent>

              {(order?.status === 7 || order?.status === 4) &&
                order?.delivery_type === 1 && (
                  <AssignDriver>
                    <OText style={{ marginBottom: 5 }} size={16} weight="600">
                      {t('ASSIGN_DRIVER', 'Assign driver')}
                    </OText>

                    <View
                      style={{
                        backgroundColor: theme.colors.inputChat,
                        borderRadius: 7.5,
                      }}>
                      <CountryPicker
                        // @ts-ignore
                        countryCode={undefined}
                        visible={isDriverModalVisible}
                        onClose={() => setIsDriverModalVisible(false)}
                        withCountryNameButton
                        renderFlagButton={() => (
                          <>
                            <TouchableOpacity
                              onPress={() => setIsDriverModalVisible(true)}
                              disabled={
                                itemsDrivers.length === 0 || loadingDriver
                              }>
                              <DriverItem justifyContent="space-between">
                                <OText>
                                  {itemsDrivers.length > 0
                                    ? order?.driver?.name ||
                                      t('SELECT_DRIVER', 'Select Driver')
                                    : t('WITHOUT_DRIVERS', 'Without drivers')}
                                </OText>
                                <OIcon
                                  src={theme?.images?.general?.chevronDown}
                                  color={theme.colors.backArrow}
                                  width={20}
                                  height={20}
                                />
                              </DriverItem>
                            </TouchableOpacity>
                          </>
                        )}
                        flatListProps={{
                          keyExtractor: (item: any) => item.value,
                          data: itemsDrivers || [],
                          renderItem: ({ item }: any) => (
                            <TouchableOpacity
                              style={!item.available && styles.driverOff}
                              disabled={
                                !item.available ||
                                order?.driver?.id === item.value
                              }
                              onPress={() => {
                                handleAssignDriver &&
                                  handleAssignDriver(item.value);
                                setIsDriverModalVisible(false);
                              }}>
                              <DriverItem>
                                <OText
                                  color={!item.available && theme.colors.grey}>
                                  {item.label}
                                  {!item.available &&
                                    ` (${t('NOT_AVAILABLE', 'Not available')})`}
                                  {item.value === order?.driver?.id &&
                                    ` (${t('SELECTED', 'Selected')})`}
                                </OText>
                              </DriverItem>
                            </TouchableOpacity>
                          ),
                        }}
                      />
                    </View>
                  </AssignDriver>
                )}

              {order?.status === 7 && (
                <Pickup>
                  <OButton
                    style={styles.btnPickUp}
                    textStyle={{ color: theme.colors.primary }}
                    text={t('READY_FOR_PICKUP', 'Ready for pickup')}
                    onClick={() =>
                      handleChangeOrderStatus && handleChangeOrderStatus(4)
                    }
                    imgLeftStyle={{ tintColor: theme.colors.backArrow }}
                    imgRightSrc={false}
                  />
                </Pickup>
              )}

              {order?.status === 4 && order?.delivery_type === 2 && (
                <Pickup>
                  <OButton
                    style={styles.btnPickUp}
                    textStyle={{ color: theme.colors.primary }}
                    text={t(
                      'PICKUP_COMPLETED_BY_CUSTOMER',
                      'Pickup completed by customer',
                    )}
                    onClick={() =>
                      handleChangeOrderStatus && handleChangeOrderStatus(15)
                    }
                    imgLeftStyle={{ tintColor: theme.colors.backArrow }}
                    imgRightSrc={false}
                  />
                </Pickup>
              )}

              <OModal
                open={openModalForBusiness}
                order={order}
                title={`${t('INVOICE_ORDER_NO', 'Order No.')} ${order?.id}`}
                entireModal
                onClose={() => handleCloseModal()}>
                <Chat
                  type={
                    openModalForBusiness ? USER_TYPE.BUSINESS : USER_TYPE.DRIVER
                  }
                  orderId={order?.id}
                  messages={messages}
                  order={order}
                  setMessages={setMessages}
                />
              </OModal>

              <OModal
                open={openModalForAccept}
                onClose={() => setOpenModalForAccept(false)}
                entireModal
                customClose>
                <AcceptOrRejectOrder
                  handleUpdateOrder={handleChangeOrderStatus}
                  closeModal={setOpenModalForAccept}
                  customerCellphone={order?.customer?.cellphone}
                  loading={loading}
                  action={actionOrder}
                  orderId={order?.id}
                  notShowCustomerPhone={false}
                  actions={actions}
                  titleAccept={titleAccept}
                  titleReject={titleReject}
                  appTitle={appTitle}
                />
              </OModal>

              <OModal
                open={openModalForMapView}
                onClose={() => handleOpenMapView()}
                entireModal
                customClose>
                <GoogleMap
                  location={order?.customer?.location}
                  locations={locationsToSend}
                  driverLocation={driverLocation}
                  navigation={navigation}
                  handleViewActionOrder={handleViewActionOrder}
                  handleOpenMapView={handleOpenMapView}
                  readOnly
                  showAcceptOrReject={
                    showFloatButtonsAcceptOrReject[order?.status]
                  }
                />
              </OModal>
            </>
            <View style={{ height: 30 }} />
          </OrderDetailsContainer>

          {order &&
            Object.keys(order).length > 0 &&
            getOrderStatus(order?.status)?.value ===
              t('PENDING', 'Pending') && (
              <>
                <FloatingButton
                  btnText={t('REJECT', 'Reject')}
                  disabled={loading}
                  isSecondaryBtn={false}
                  secondButtonClick={() => handleViewActionOrder('accept')}
                  firstButtonClick={() => handleViewActionOrder('reject')}
                  secondBtnText={t('ACCEPT', 'Accept')}
                  secondButton={true}
                  firstColorCustom={theme.colors.red}
                  secondColorCustom={theme.colors.green}
                />
              </>
            )}

          {order &&
            Object.keys(order).length > 0 &&
            getOrderStatus(order?.status)?.value !==
              t('PENDING', 'Pending') && (
              <FloatingButton
                btnText={t('COPY', 'Copy')}
                isSecondaryBtn={false}
                disabled={loading}
                colorTxt1={theme.colors.primary}
                secondButtonClick={handleViewSummaryOrder}
                firstButtonClick={handleCopyClipboard}
                secondBtnText={t('PRINT', 'Print')}
                secondButton={true}
                firstColorCustom="transparent"
                secondColorCustom={theme.colors.primary}
              />
            )}
        </>
      )}
    </>
  );
};

export const OrderDetails = (props: OrderDetailsParams) => {
  const orderDetailsProps = {
    ...props,
    driverAndBusinessId: true,
    UIComponent: OrderDetailsUI,
  };
  return <OrderDetailsController {...orderDetailsProps} />;
};
