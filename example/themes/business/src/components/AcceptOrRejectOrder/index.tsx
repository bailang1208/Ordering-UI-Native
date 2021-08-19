import React, { useState, useEffect } from 'react';
import {
  Linking,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { useTheme } from 'styled-components/native';
import {
  ToastType,
  useToast,
  useLanguage,
  OrderChange as OrderChangeConTableoller,
} from 'ordering-components/native';
import { Content, Timer, TimeField, Header, Action, Comments } from './styles';
import { FloatingButton } from '../FloatingButton';
import { OText, OButton, OTextarea, OIconButton } from '../shared';
import { AcceptOrRejectOrderParams } from '../../types';

export const AcceptOrRejectOrderUI = (props: AcceptOrRejectOrderParams) => {
  const { navigation, route, orderState, updateStateOrder } = props;

  const [, { showToast }] = useToast();
  const [, t] = useLanguage();
  const theme = useTheme();

  const [hour, setHour] = useState('00');
  const [min, setMin] = useState('00');
  const [comments, setComments] = useState('');
  const [isKeyboardShow, setIsKeyboardShow] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsKeyboardShow(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsKeyboardShow(false);
      },
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const phoneNumber = route?.order?.customer?.cellphone;
  let codeNumberPhone, numberPhone, numberToShow;

  if (phoneNumber) {
    codeNumberPhone = phoneNumber.slice(0, 3);
    numberPhone = phoneNumber.slice(3, phoneNumber?.length);
    numberToShow = `(${codeNumberPhone}) ${numberPhone}`;
  }

  useEffect(() => {
    if (orderState?.order !== null) {
      if (!orderState?.error) {
        showToast(
          ToastType.Success,
          route.action === 'accept'
            ? t('ORDER_ACCEPTED', 'Order Accepted')
            : t('ORDER_REJECTED', 'Order Rejected'),
        );
        handleArrowBack();
      }

      if (orderState?.error) {
        showToast(ToastType.Error, orderState.order[0]);
      }
    }
  }, [orderState?.order]);

  const handleArrowBack: any = () => {
    navigation?.canGoBack() && navigation.goBack();
  };

  const handleChangeHour = (e: any) => {
    if (e.length === 1) {
      setHour('0' + e.charAt(0));
      return;
    }

    if (
      e.includes(',') ||
      e.includes('.') ||
      e.includes('-') ||
      e.includes(' ')
    )
      return;

    const rightValue = e.slice(0, 2) === hour;
    const midleValue =
      e.charAt(0) + e.charAt(e.length - 1) === hour && !rightValue;
    const leftValue = e.slice(1) === hour && !midleValue;

    if (rightValue || midleValue) setHour(e.charAt(1) + e.charAt(e.length - 1));

    if (leftValue) setHour(e.charAt(0) + e.charAt(1));
  };

  const handleChangeMin = (e: any) => {
    if (e.length === 1) {
      setMin('0' + e.charAt(0));
      return;
    }

    if (
      e.includes(',') ||
      e.includes('.') ||
      e.includes('-') ||
      e.includes(' ')
    )
      return;

    const rightValue = e.slice(0, 2) === min;
    const midleValue =
      e.charAt(0) + e.charAt(e.length - 1) === min && !rightValue;
    const leftValue = e.slice(1) === min && !midleValue;

    if (rightValue || midleValue) {
      if (e.charAt(1) + e.charAt(e.length - 1) <= 60) {
        setMin(e.charAt(1) + e.charAt(e.length - 1));
      } else if (e.charAt(1) + e.charAt(e.length - 1) > 60) {
        setMin('60');
      }
    }

    if (leftValue) {
      if (e.charAt(0) + e.charAt(1) <= 60) {
        setMin(e.charAt(0) + e.charAt(1));
      } else if (e.charAt(0) + e.charAt(1) > 60) {
        setMin('60');
      }
    }
  };

  return (
    <>
      <Spinner visible={orderState?.loading} />

      {!orderState?.loading && (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}>
          <Content>
            <Header>
              <OIconButton
                icon={theme.images.general.arrow_left}
                borderColor={theme.colors.clear}
                iconStyle={{ width: 20, height: 20 }}
                style={{
                  maxWidth: 40,
                  height: 35,
                  justifyContent: 'flex-end',
                  marginBottom: 30,
                }}
                onClick={() => handleArrowBack()}
              />

              <OText size={20} color={theme.colors.textGray} weight="bold">
                {route.action === 'accept'
                  ? `${t('PREPARATION_TIME', 'Preparation time')}:`
                  : t('REJECT_ORDER', 'Reject Order')}
              </OText>

              {route.action === 'reject' && (
                <>
                  <OText
                    size={15}
                    color={theme.colors.textGray}
                    style={{ marginTop: 10 }}>
                    {t(
                      'CALL_YOUR_CUSTOMER_TO_RESOLVE_THE_ISSUE_AS_POLITELY_AS_POSSIBLE',
                      'Call your customer to resolve the issue as politely as possible',
                    )}
                  </OText>

                  {numberToShow ? (
                    <OButton
                      bgColor="transparent"
                      borderColor={theme.colors.primary}
                      textStyle={{ color: theme.colors.primary, fontSize: 20 }}
                      style={{
                        borderRadius: 10,
                        marginVertical: 20,
                      }}
                      imgLeftStyle={{
                        resizeMode: 'contain',
                        left: 20,
                        position: 'absolute',
                      }}
                      imgLeftSrc={theme.images.general.cellphone}
                      text={numberToShow}
                      onClick={() =>
                        Linking.openURL(`tel:${route.order.customer.cellphone}`)
                      }
                    />
                  ) : (
                    <OButton
                      bgColor="transparent"
                      borderColor={theme.colors.primary}
                      textStyle={{ color: theme.colors.primary, fontSize: 15 }}
                      style={{
                        borderRadius: 10,
                        marginVertical: 20,
                      }}
                      imgLeftStyle={{
                        resizeMode: 'contain',
                        left: 20,
                        position: 'absolute',
                      }}
                      isDisabled={true}
                      imgLeftSrc={theme.images.general.cellphone}
                      text={t('NOT_NUMBER', "There's not phonenumber.")}
                      onClick={() =>
                        Linking.openURL(`tel:${route.order.customer.cellphone}`)
                      }
                    />
                  )}

                  <OText
                    size={15}
                    color={theme.colors.textGray}
                    style={{ marginBottom: 10 }}>
                    {t(
                      'MARK_THE_ORDER_AS_REJECTED',
                      'Mark the order as rejected',
                    )}
                  </OText>

                  <OText>
                    <OText style={{ fontWeight: 'bold' }}>
                      {t('NOTE', 'Note')}
                      {': '}
                    </OText>

                    <OText size={15} color={theme.colors.textGray}>
                      {t(
                        'YOUR_CUSTOMER_WILL_RECEIVE_A_NOTIFICATION_ABOUT_THIS_ACTIONS',
                        'Your customer will receive a notification about this actions',
                      )}
                    </OText>
                  </OText>
                </>
              )}
            </Header>

            {route.action === 'accept' && (
              <Timer>
                <TimeField
                  keyboardType="numeric"
                  placeholder={'00'}
                  value={hour}
                  onChangeText={handleChangeHour}
                  selectionColor={theme.colors.primary}
                  color={theme.colors.textGray}
                />

                <OText size={55}>:</OText>

                <TimeField
                  keyboardType="numeric"
                  placeholder={'00'}
                  value={min}
                  onChangeText={handleChangeMin}
                  selectionColor={theme.colors.primary}
                  color={theme.colors.textGray}
                />
              </Timer>
            )}

            {route.action === 'reject' && (
              <Comments>
                <OTextarea
                  placeholder={t(
                    'PLEASE_TYPE_YOUR_COMMENTS_IN_HERE',
                    'Please type your comments in here',
                  )}
                  value={comments}
                  onChange={setComments}
                />
              </Comments>
            )}
          </Content>

          <Action
            style={{
              marginBottom: Platform.OS === 'ios' && isKeyboardShow ? 30 : 0,
            }}>
            <FloatingButton
              firstButtonClick={() =>
                updateStateOrder &&
                updateStateOrder({
                  hour,
                  min,
                  comments,
                  action:
                    route?.action === 'accept'
                      ? 'acceptByBusiness'
                      : 'rejectByBusiness',
                  orderId: route?.order?.id,
                })
              }
              btnText={
                route.action === 'accept'
                  ? t('ACCEPT', 'Accept')
                  : t('REJECT', 'Reject')
              }
              color={
                route.action === 'accept'
                  ? theme.colors.green
                  : theme.colors.red
              }
            />
          </Action>
        </KeyboardAvoidingView>
      )}
    </>
  );
};

export const AcceptOrRejectOrder = (props: AcceptOrRejectOrderParams) => {
  const acceptOrRejectOrderProps = {
    ...props,
    UIComponent: AcceptOrRejectOrderUI,
  };

  return <OrderChangeConTableoller {...acceptOrRejectOrderProps} />;
};
