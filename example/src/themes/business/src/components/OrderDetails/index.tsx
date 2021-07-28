import React, { useState, useEffect } from 'react';
import { StyleSheet, Platform, I18nManager } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { useClipboard } from '@react-native-clipboard/clipboard';
import { FloatingButton } from '../FloatingButton';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import RNPickerSelect from 'react-native-picker-select';
import { ToastType, useToast } from '../../providers/ToastProvider';
import { Chat } from '../Chat';
import {
  useLanguage,
  OrderDetails as OrderDetailsConTableoller,
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
  Map,
  Pickup,
  AssignDriver,
} from './styles';

import { OButton, OIcon, OModal, OText, OIconButton } from '../shared';
import { ProductItemAccordion } from '../ProductItemAccordion';
import { OrderDetailsParams } from '../../types';
import { USER_TYPE } from '../../config/constants';
import { verifyDecimals } from '../../utils';
import { useTheme } from 'styled-components/native';

export const OrderDetailsUI = (props: OrderDetailsParams) => {
  const {
    navigation,
    messages,
    setMessages,
    readMessages,
    messagesReadList,
    handleAssignDriver,
    handleReadyForPickUp,
    isFromCheckout,
    driverLocation,
  } = props;

  const theme = useTheme();
  const [data, setString] = useClipboard();
  const [, t] = useLanguage();
  const [{ parsePrice, parseNumber, parseDate }] = useUtils();
  const [{ user, token }] = useSession();
  const [{ configs }] = useConfig();
  const { showToast } = useToast();
  const [openModalForBusiness, setOpenModalForBusiness] = useState(false);
  const [unreadAlert, setUnreadAlert] = useState({
    business: false,
    driver: false,
  });
  const { order, businessData, driversGroupsData, loading } = props.order;

  const itemsDrivers: any = [];

  if (driversGroupsData?.length > 0) {
    driversGroupsData.forEach((drivers: any) => {
      const isThereInBussines = drivers.business.some(
        (business: any) => business.id === businessData.id,
      );
      if (isThereInBussines) {
        drivers.drivers.forEach((driversgroup: any) =>
          itemsDrivers.push({
            label: driversgroup.name,
            value: driversgroup.id,
          }),
        );
      }
    });
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

    setString(
      `${name} \n${customerPhone} \n${email} \n${payment} \n${businessPhone} \n${address} \n${addressNotes} ${orderDetails} \n${subtotal} \n${tax} \n${deliveryFee} \n${total}`,
    );

    showToast(
      ToastType.Info,
      t('COPY_TO_CLIPBOARD', 'Copy to clipboard.'),
      500,
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
    navigation.navigate &&
      navigation.navigate('AcceptOrRejectOrder', { order, action });
  };

  const handleViewMapView = () => {
    navigation.navigate && navigation.navigate('MapView', { order, locations });
  };

  const handleViewSummaryOrder = (action: string) => {
    navigation.navigate &&
      navigation.navigate('OrderSummary', {
        order,
        orderStatus: getOrderStatus(order?.status)?.value,
      });
  };

  const handleCloseModal = () => {
    setOpenModalForBusiness(false);
  };

  const colors: any = {
    0: theme.colors.statusOrderBlue,
    1: theme.colors.statusOrderGreen,
    5: theme.colors.statusOrderRed,
    7: theme.colors.statusOrderBlue,
    8: theme.colors.statusOrderBlue,
  };

  const handleArrowBack: any = () => {
    if (!isFromCheckout) {
      navigation?.canGoBack() && navigation.goBack();
      return;
    }

    navigation.navigate('BottomTab');
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

  const styles = StyleSheet.create({
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
      fontWeight: 'bold',
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
  });

  const pickerStyle = StyleSheet.create({
    inputAndroid: {
      color: theme.colors.secundaryContrast,
      borderWidth: 1,
      borderColor: theme.colors.transparent,
      borderRadius: 15,
      backgroundColor: theme.colors.inputDisabled,
    },
    inputIOS: {
      color: theme.colors.secundaryContrast,
      paddingEnd: 20,
      height: 40,
      borderWidth: 1,
      borderColor: theme.colors.transparent,
      borderRadius: 15,
      paddingHorizontal: 10,
      backgroundColor: theme.colors.inputDisabled,
    },
    icon: {
      top: Platform.OS === 'ios' ? 10 : 15,
      right: Platform.OS === 'ios' ? 0 : I18nManager.isRTL ? 30 : 7,
      position: 'absolute',
      fontSize: 20,
    },
    placeholder: {
      color: theme.colors.secundaryContrast,
    },
  });

  const [driverId, setDriverId] = useState(null);

  const onChangeDriver = (value: any) => {
    if (!loading && value !== driverId) {
      setDriverId(value);
      handleAssignDriver && handleAssignDriver(value);
    }
  };

  useEffect(() => {
    setDriverId(order?.driver?.id);
  }, [order?.driver?.id]);

  return (
    <>
      <OrderDetailsContainer
        style={{ marginBottom: 60 }}
        keyboardShouldPersistTaps="handled">
        <Spinner
          visible={!order || Object.keys(order).length === 0 || loading}
        />
        {order && Object.keys(order).length > 0 && (
          <>
            <Header>
              <OIconButton
                icon={theme.images.general.arrow_left}
                iconStyle={{ width: 20, height: 20 }}
                borderColor={theme.colors.clear}
                style={{
                  maxWidth: 40,
                  justifyContent: 'flex-end',
                }}
                onClick={() => handleArrowBack()}
              />

              <Actions>
                <OIconButton
                  icon={theme.images.general.map}
                  iconStyle={{ width: 20, height: 20 }}
                  borderColor={theme.colors.clear}
                  style={{ maxWidth: 40, marginRight: 20 }}
                  onClick={() => handleViewMapView()}
                />
                <OIconButton
                  icon={theme.images.general.messages}
                  iconStyle={{ width: 20, height: 20 }}
                  borderColor={theme.colors.clear}
                  style={{ maxWidth: 40 }}
                  onClick={() => handleOpenMessagesForBusiness()}
                />
              </Actions>
            </Header>
            <OrderContent>
              <OrderHeader>
                <OText size={13}>
                  {order?.delivery_datetime_utc
                    ? parseDate(order?.delivery_datetime_utc)
                    : parseDate(order?.delivery_datetime, { utc: false })}
                </OText>
                <OText size={20} weight="bold">
                  {t('THE_ORDER_NUMBER', 'The Order No.')}
                  {` ${order?.id} ${t('IS', 'is')} \n`}
                  <OText
                    size={20}
                    color={colors[order?.status] || theme.colors.primary}>
                    {getOrderStatus(order?.status)?.value}
                  </OText>
                </OText>
              </OrderHeader>
              <OrderBusiness>
                <OText style={{ marginBottom: 5 }} size={16} weight="bold">
                  {t('BUSINESS_DETAILS', 'Business details')}
                </OText>
                <OText numberOfLines={1} ellipsizeMode="tail">
                  {order?.business?.name}
                </OText>
                <OText numberOfLines={1} ellipsizeMode="tail">
                  {order?.business?.email}
                </OText>
                <OText numberOfLines={1} ellipsizeMode="tail">
                  {order?.business?.cellphone}
                </OText>
                <OText numberOfLines={1} ellipsizeMode="tail">
                  {order?.business?.address}
                </OText>
              </OrderBusiness>
              <OrderCustomer>
                <OText style={{ marginBottom: 5 }} size={16} weight="bold">
                  {t('CUSTOMER_DETAILS', 'Customer details')}
                </OText>
                <OText numberOfLines={1} ellipsizeMode="tail">
                  {order?.customer?.name}
                </OText>
                <OText numberOfLines={1} ellipsizeMode="tail">
                  {order?.customer?.email}
                </OText>
                <OText numberOfLines={1} ellipsizeMode="tail">
                  {order?.customer?.cellphone}
                </OText>
                <OText numberOfLines={1} ellipsizeMode="tail">
                  {order?.customer?.address}
                </OText>
              </OrderCustomer>
              <OrderProducts>
                <OText style={{ marginBottom: 5 }} size={16} weight="bold">
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
                  <OText>{t('SUBTOTAL', 'Subtotal')}</OText>
                  <OText>{parsePrice(order?.subtotal)}</OText>
                </Table>
                {order?.tax_type !== 1 && (
                  <Table>
                    <OText>
                      {t('TAX', 'Tax')}
                      {`(${verifyDecimals(order?.tax, parseNumber)}%)`}
                    </OText>
                    <OText>
                      {parsePrice(order?.summary?.tax || order?.totalTax)}
                    </OText>
                  </Table>
                )}
                {(order?.summary?.discount > 0 || order?.discount > 0) && (
                  <Table>
                    {order?.offer_type === 1 ? (
                      <OText>
                        {t('DISCOUNT', 'Discount')}
                        <OText>{`(${verifyDecimals(
                          order?.offer_rate,
                          parsePrice,
                        )}%)`}</OText>
                      </OText>
                    ) : (
                      <OText>{t('DISCOUNT', 'Discount')}</OText>
                    )}
                    <OText>
                      -{' '}
                      {parsePrice(order?.summary?.discount || order?.discount)}
                    </OText>
                  </Table>
                )}

                {(order?.summary?.delivery_price > 0 ||
                  order?.deliveryFee > 0) && (
                  <Table>
                    <OText>{t('DELIVERY_FEE', 'Delivery Fee')}</OText>
                    <OText>
                      {parsePrice(
                        order?.summary?.delivery_price || order?.deliveryFee,
                      )}
                    </OText>
                  </Table>
                )}
                <Table>
                  <OText>
                    {t('DRIVER_TIP', 'Driver tip')}
                    {(order?.summary?.driver_tip > 0 ||
                      order?.driver_tip > 0) &&
                      parseInt(configs?.driver_tip_type?.value, 10) === 2 &&
                      !parseInt(configs?.driver_tip_use_custom?.value, 10) &&
                      `(${verifyDecimals(order?.driver_tip, parseNumber)}%)`}
                  </OText>
                  <OText>
                    {parsePrice(
                      order?.summary?.driver_tip || order?.totalDriverTip,
                    )}
                  </OText>
                </Table>
                <Table>
                  <OText>
                    {t('SERVICE_FEE', 'Service Fee')}
                    {`(${verifyDecimals(order?.service_fee, parseNumber)}%)`}
                  </OText>
                  <OText>
                    {parsePrice(
                      order?.summary?.service_fee || order?.serviceFee || 0,
                    )}
                  </OText>
                </Table>
                <Total>
                  <Table>
                    <OText style={styles.textBold}>{t('TOTAL', 'Total')}</OText>
                    <OText style={styles.textBold} color={theme.colors.primary}>
                      {parsePrice(order?.summary?.total || order?.total)}
                    </OText>
                  </Table>
                </Total>
              </OrderBill>
            </OrderContent>

            {order?.status === 7 && order?.delivery_type === 1 && (
              <AssignDriver>
                <OText style={{ marginBottom: 5 }} size={16} weight="bold">
                  {t('ASSIGN_DRIVER', 'Assign driver')}
                </OText>

                <RNPickerSelect
                  key={order}
                  items={itemsDrivers}
                  onValueChange={(value: any) => onChangeDriver(value)}
                  value={driverId}
                  style={pickerStyle}
                  useNativeAndroidPickerStyle={false}
                  placeholder={{
                    label: `${t('NOT_DRIVER', 'Not driver')}`,
                    value: null,
                  }}
                  Icon={() => (
                    <MaterialIcons
                      name="keyboard-arrow-down"
                      style={pickerStyle.icon}
                    />
                  )}
                  disabled={loading}
                />
              </AssignDriver>
            )}

            {order?.status === 7 && order?.delivery_type === 2 && (
              <Pickup>
                <OButton
                  style={styles.btnPickUp}
                  textStyle={{ color: theme.colors.primary }}
                  text={t('READY_FOR_PICKUP', 'Ready for pickup')}
                  onClick={() => handleReadyForPickUp && handleReadyForPickUp()}
                  imgLeftStyle={{ tintColor: theme.colors.backArrow }}
                />
              </Pickup>
            )}
          </>
        )}

        <OModal
          open={openModalForBusiness}
          title={`Order No. ${order?.id}`}
          order={order}
          entireModal
          onClose={() => handleCloseModal()}>
          <Chat
            type={openModalForBusiness ? USER_TYPE.BUSINESS : USER_TYPE.DRIVER}
            orderId={order?.id}
            messages={messages}
            order={order}
            setMessages={setMessages}
          />
        </OModal>
      </OrderDetailsContainer>

      {order &&
        Object.keys(order).length > 0 &&
        getOrderStatus(order?.status)?.value === t('PENDING', 'Pending') && (
          <FloatingButton
            btnText={t('REJECT', 'Reject')}
            isSecondaryBtn={false}
            secondButtonClick={() => handleViewActionOrder('accept')}
            firstButtonClick={() => handleViewActionOrder('reject')}
            secondBtnText={t('ACCEPT', 'Accept')}
            secondButton={true}
            firstColorCustom={theme.colors.red}
            secondColorCustom={theme.colors.green}
          />
        )}
      {order &&
        Object.keys(order).length > 0 &&
        getOrderStatus(order?.status)?.value !== t('PENDING', 'Pending') && (
          <FloatingButton
            btnText={t('COPY', 'Copy')}
            isSecondaryBtn={false}
            colorTxt1={theme.colors.primary}
            secondButtonClick={() => handleViewSummaryOrder('view')}
            firstButtonClick={() => handleCopyClipboard()}
            secondBtnText={t('PRINT', 'print')}
            secondButton={true}
            firstColorCustom="transparent"
            secondColorCustom={theme.colors.primary}
          />
        )}
    </>
  );
};

export const OrderDetails = (props: OrderDetailsParams) => {
  const orderDetailsProps = {
    ...props,
    userCustomerId: true,
    UIComponent: OrderDetailsUI,
  };
  return <OrderDetailsConTableoller {...orderDetailsProps} />;
};