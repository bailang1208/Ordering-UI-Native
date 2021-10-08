import React from 'react'

import { Platform, StyleSheet, View } from 'react-native';

import { OText, OLink } from '../shared'
import {
    OrderContent,
    OrderBusiness,
    OrderCustomer,
    OrderProducts,
    Table,
    OrderBill,
    Total,
} from './styles';

import { ProductItemAccordion } from '../ProductItemAccordion';

import { verifyDecimals } from '../../utils';

import {
    useLanguage,
    useUtils,
    useConfig,
} from 'ordering-components/native';
import { useTheme } from 'styled-components/native';


interface OrderContent {
    order: any
}

export const OrderContentComponent = (props: OrderContent) => {
    const [, t] = useLanguage();
    const theme = useTheme()

    const { order } = props;

    const [{ parsePrice, parseNumber }] = useUtils();
    const [{ configs }] = useConfig();

    const styles = StyleSheet.create({
        linkWithIcons: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 5,
            flex: 1,
        },
        textBold: {
            fontWeight: '600',
        },
    })
    return (
        <OrderContent>
        <OrderBusiness>
          <OText style={{ marginBottom: 5 }} size={16} weight="600">
            {t('BUSINESS_DETAILS', 'Business details')}
          </OText>

          <OText numberOfLines={1} mBottom={4} ellipsizeMode="tail">
            {order?.business?.name}
          </OText>

          {!!order?.business?.email && (
            <View style={styles.linkWithIcons}>
              <OLink
                PressStyle={styles.linkWithIcons}
                url={`mailto:${order?.business?.email}`}
                shorcut={order?.business?.email}
              />
            </View>
          )}

          {!!order?.business?.cellphone && (
            <View style={styles.linkWithIcons}>
              <OLink
                PressStyle={styles.linkWithIcons}
                url={`tel:${order?.business?.cellphone}`}
                shorcut={`${order?.business?.cellphone}`}
              />
            </View>
          )}

          {!!order?.business?.phone && (
            <View style={styles.linkWithIcons}>
              <OLink
                PressStyle={styles.linkWithIcons}
                url={`tel:${order?.business?.phone}`}
                shorcut={order?.business?.phone}
              />
            </View>
          )}

          {!!order?.business?.address && (
            <View style={styles.linkWithIcons}>
              <OLink
                PressStyle={styles.linkWithIcons}
                url={Platform.select({
                  ios: `maps:0,0?q=${order?.business?.address}`,
                  android: `geo:0,0?q=${order?.business?.address}`,
                })}
                shorcut={order?.business?.address}
              />
            </View>
          )}

          {!!order?.business?.address_notes && (
            <View style={styles.linkWithIcons}>
              <OLink
                PressStyle={styles.linkWithIcons}
                url={Platform.select({
                  ios: `maps:0,0?q=${order?.business?.address_notes}`,
                  android: `geo:0,0?q=${order?.business?.address_notes}`,
                })}
                shorcut={order?.business?.address_notes}
              />
            </View>
          )}
        </OrderBusiness>

        <OrderCustomer>
          <OText style={{ marginBottom: 5 }} size={16} weight="600">
            {t('CUSTOMER_DETAILS', 'Customer details')}
          </OText>

          <View style={{ flexDirection: 'row' }}>
            <OText numberOfLines={2} mBottom={4}>
              <OText
                numberOfLines={1}
                mBottom={4}
                ellipsizeMode="tail"
                space>
                {order?.customer?.name}
              </OText>

              <OText
                numberOfLines={1}
                mBottom={4}
                ellipsizeMode="tail"
                space>
                {order?.customer?.middle_name}
              </OText>

              <OText
                numberOfLines={1}
                mBottom={4}
                ellipsizeMode="tail"
                space>
                {order?.customer?.lastname}
              </OText>

              <OText
                numberOfLines={1}
                mBottom={4}
                ellipsizeMode="tail"
                space>
                {order?.customer?.second_lastname}
              </OText>
            </OText>
          </View>

          {!!order?.customer?.email && (
            <View style={styles.linkWithIcons}>
              <OLink
                PressStyle={styles.linkWithIcons}
                url={`mailto:${order?.customer?.email}`}
                shorcut={order?.customer?.email}
              />
            </View>
          )}

          {!!order?.customer?.cellphone && (
            <View style={styles.linkWithIcons}>
              <OLink
                PressStyle={styles.linkWithIcons}
                url={`tel:${order?.customer?.cellphone}`}
                shorcut={order?.customer?.cellphone}
              />
            </View>
          )}

          {!!order?.customer?.phone && (
            <View style={styles.linkWithIcons}>
              <OLink
                PressStyle={styles.linkWithIcons}
                url={`tel:${order?.customer?.phone}`}
                shorcut={order?.customer?.phone}
              />
            </View>
          )}

          {!!order?.customer?.address && (
            <View style={styles.linkWithIcons}>
              <OLink
                PressStyle={styles.linkWithIcons}
                url={Platform.select({
                  ios: `maps:0,0?q=${order?.customer?.address}`,
                  android: `geo:0,0?q=${order?.customer?.address}`,
                })}
                shorcut={order?.customer?.address}
              />
            </View>
          )}

          {!!order?.customer?.internal_number && (
            <OText numberOfLines={1} mBottom={4} ellipsizeMode="tail">
              {order?.customer?.internal_number}
            </OText>
          )}

          {!!order?.customer?.address_notes && (
            <OText numberOfLines={1} mBottom={4} ellipsizeMode="tail">
              {order?.customer?.address_notes}
            </OText>
          )}

          {!!order?.customer.zipcode && (
            <OText numberOfLines={1} mBottom={4} ellipsizeMode="tail">
              {order?.customer?.zipcode}
            </OText>
          )}
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
              />
            ))}
        </OrderProducts>

        <OrderBill>
          <Table>
            <OText mBottom={4}>{t('SUBTOTAL', 'Subtotal')}</OText>
            <OText mBottom={4}>
              {parsePrice(
                order.tax_type === 1
                  ? order?.summary?.subtotal + order?.summary?.tax ?? 0
                  : order?.summary?.subtotal ?? 0,
              )}
            </OText>
          </Table>

          {order?.tax_type !== 1 && (
            <Table>
              <OText mBottom={4}>
                {t('TAX', 'Tax')}
                {`(${verifyDecimals(
                  order?.summary?.tax_rate,
                  parseNumber,
                )}%)`}
              </OText>

              <OText mBottom={4}>
                {parsePrice(order?.summary?.tax ?? 0)}
              </OText>
            </Table>
          )}

          {order?.summary?.discount > 0 && (
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
                - {parsePrice(order?.summary?.discount)}
              </OText>
            </Table>
          )}

          {order?.summary?.subtotal_with_discount > 0 &&
            order?.summary?.discount > 0 &&
            order?.summary?.total >= 0 && (
              <Table>
                <OText mBottom={4}>
                  {t(
                    'SUBTOTAL_WITH_DISCOUNT',
                    'Subtotal with discount',
                  )}
                </OText>
                {order?.tax_type === 1 ? (
                  <OText mBottom={4}>
                    {parsePrice(
                      order?.summary?.subtotal_with_discount +
                        order?.summary?.tax ?? 0,
                    )}
                  </OText>
                ) : (
                  <OText mBottom={4}>
                    {parsePrice(
                      order?.summary?.subtotal_with_discount ?? 0,
                    )}
                  </OText>
                )}
              </Table>
            )}

          {order?.summary?.delivery_price > 0 && (
            <Table>
              <OText mBottom={4}>
                {t('DELIVERY_FEE', 'Delivery Fee')}
              </OText>

              <OText mBottom={4}>
                {parsePrice(order?.summary?.delivery_price)}
              </OText>
            </Table>
          )}

          <Table>
            <OText mBottom={4}>
              {t('DRIVER_TIP', 'Driver tip')}{' '}
              {order?.summary?.driver_tip > 0 &&
                parseInt(configs?.driver_tip_type?.value, 10) === 2 &&
                !parseInt(configs?.driver_tip_use_custom?.value, 10) &&
                `(${verifyDecimals(
                  order?.summary?.driver_tip,
                  parseNumber,
                )}%)`}
            </OText>

            <OText mBottom={4}>
              {parsePrice(order?.summary?.driver_tip ?? 0)}
            </OText>
          </Table>

          {order?.summary?.service_fee > 0 && (
            <Table>
              <OText mBottom={4}>
                {t('SERVICE_FEE', 'Service Fee')}{' '}
                {`(${verifyDecimals(
                  order?.summary?.service_fee,
                  parseNumber,
                )}%)`}
              </OText>

              <OText mBottom={4}>
                {parsePrice(order?.summary?.service_fee)}
              </OText>
            </Table>
          )}

          <Total>
            <Table>
              <OText mBottom={4} style={styles.textBold}>
                {t('TOTAL', 'Total')}
              </OText>

              <OText
                mBottom={4}
                style={styles.textBold}
                color={theme.colors.primary}>
                {parsePrice(order?.summary?.total ?? 0)}
              </OText>
            </Table>
          </Total>
        </OrderBill>
      </OrderContent>
    )
}