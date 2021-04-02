import React from 'react';
import { useLanguage } from 'ordering-components/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { colors } from '../theme';

export const flatArray = (arr: any) => [].concat(...arr)

/**
 * Function to return the traduction depending of a key 't'
 * @param {string} key for traduction
 */
export const getTraduction = (key: string) => {
  const [, t] = useLanguage()
  const keyList: any = {
    // Add the key and traduction that you need below
    ERROR_ORDER_WITHOUT_CART: 'The order was placed without a cart',
    ERROR_INVALID_COUPON: "The coupon doesn't exist",
    ERROR_IVALID_COUPON_MINIMUM: 'You must have more products in your cart to use the coupon',
    ERROR_ADD_PRODUCT_VERY_FAR_FOR_PICKUP: 'The business is too far for order type pickup',
    ERROR_PLACE_PAY_WITH_CARD2: 'An error occurred while trying to pay by card',
    ERROR_ADD_PRODUCT_BUSINESS_CLOSED: 'The business is closed at the moment',
    INTERNAL_ERROR: 'Server Error, please wait, we are working to fix it',
    ERROR_NOT_FOUND_BUSINESSES: 'No businesses found near your location',
    YOU_DO_NOT_HAVE_PERMISSION: 'You do not have permission',
    INVALID_CODE: 'Invalid verify code',
    STRIPE_ERROR: 'Payment service error. Try again later.'
  }

  return keyList[key] ? t(key, keyList[key]) : t(key)
}

/**
 * Function to convert delivery time in minutes
 * @param {string} time business delivery time
 */
export const convertHoursToMinutes = (time: any) => {
  if (!time) return '0min'
  const [hour, minute] = time.split(':')
  const result = (parseInt(hour, 10) * 60) + parseInt(minute, 10)
  return `${result}min`
}

export const getIconCard = (brand: string, size: number) => {
  const value = brand?.toLowerCase()
  switch (value) {
    case 'visa':
      return (
        <FontAwesome
          name='cc-visa'
          size={size}
          color={'#000'}
        />
      )
    case 'mastercard':
      return (
        <FontAwesome
          name='cc-mastercard'
          size={size}
          color={'#000'}
        />
      )
    case 'amex':
      return (
        <FontAwesome
          name='cc-amex'
          size={size}
          color={'#000'}
        />
      )
    case 'discover':
      return (
        <FontAwesome
          name='cc-discover'
          size={size}
          color={'#000'}
        />
      )
    case 'jcb':
      return (
        <FontAwesome
          name='cc-jcb'
          size={size}
          color={'#000'}
        />
      )
    case 'diners-club':
      return (
        <FontAwesome
          name='cc-diners-club'
          size={size}
          color={'#000'}
        />
      )
    default:
      return (
        <FontAwesome
          name='credit-card-alt'
          size={size}
          color={'#000'}
        />
      )
  }
}
