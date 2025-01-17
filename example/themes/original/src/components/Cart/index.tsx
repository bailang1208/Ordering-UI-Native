import React, { useState } from 'react';
import {
  Cart as CartController,
  useOrder,
  useLanguage,
  useConfig,
  useUtils,
  useValidationFields,
} from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { CContainer, CheckoutAction, Divider } from './styles';

import { OSBill, OSTable, OSCoupon, OSTotal, OSRow } from '../OrderSummary/styles';

import { ProductItemAccordion } from '../ProductItemAccordion';
import { BusinessItemAccordion } from '../BusinessItemAccordion';
import { CouponControl } from '../CouponControl';

import { OButton, OInput, OModal, OText } from '../shared';
import { UpsellingProducts } from '../UpsellingProducts';
import { verifyDecimals } from '../../utils';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign'
import { TaxInformation } from '../TaxInformation';
import { CartStoresListing } from '../CartStoresListing';
import { OAlert } from '../../../../../src/components/shared'
import { PlaceSpot } from '../PlaceSpot'

const CartUI = (props: any) => {
  const {
    cart,
    clearCart,
    changeQuantity,
    getProductMax,
    offsetDisabled,
    removeProduct,
    handleCartOpen,
    setIsCartsLoading,
    handleChangeComment,
    commentState,
    onNavigationRedirect,
    handleRemoveOfferClick
  } = props

  const theme = useTheme();

  const [, t] = useLanguage()
  const [orderState] = useOrder()
  const [{ configs }] = useConfig();
  const [{ parsePrice, parseNumber, parseDate }] = useUtils()
  const [validationFields] = useValidationFields()

  const [openUpselling, setOpenUpselling] = useState(false)
  const [openChangeStore, setOpenChangeStore] = useState(false)
  const [canOpenUpselling, setCanOpenUpselling] = useState(false)
  const [openTaxModal, setOpenTaxModal] = useState<any>({ open: false, data: null, type: '' })
  const [confirm, setConfirm] = useState<any>({ open: false, content: null, handleOnAccept: null, id: null, title: null })
  const [openPlaceModal, setOpenPlaceModal] = useState(false)

  const isCartPending = cart?.status === 2
  const isCouponEnabled = validationFields?.fields?.checkout?.coupon?.enabled

  const business: any = (orderState?.carts && Object.values(orderState.carts).find((_cart: any) => _cart?.uuid === props.cartuuid)) ?? {}
  const businessId = business?.business_id ?? null
  const placeSpotTypes = [3, 4]

  const momentFormatted = !orderState?.option?.moment
    ? t('RIGHT_NOW', 'Right Now')
    : parseDate(orderState?.option?.moment, { outputFormat: 'YYYY-MM-DD HH:mm' })

  const handleDeleteClick = (product: any) => {
    removeProduct(product, cart)
  }

  const handleEditProduct = (product: any) => {
    onNavigationRedirect('ProductDetails', {
      businessId,
      isCartProduct: true,
      productCart: product,
      businessSlug: cart?.business?.slug,
      categoryId: product?.category_id,
      productId: product?.id,
    })
  }

  const handleClearProducts = async () => {
    try {
      setIsCartsLoading && setIsCartsLoading(true)
      const result = await clearCart(cart?.uuid)
      setIsCartsLoading && setIsCartsLoading(false)
    } catch (error) {
      setIsCartsLoading && setIsCartsLoading(false)
    }
  }

  const handleUpsellingPage = () => {
    setOpenUpselling(false)
    setCanOpenUpselling(false)
    props.onNavigationRedirect('CheckoutNavigator', {
      screen: 'CheckoutPage',
      cartUuid: cart?.uuid,
      businessLogo: cart?.business?.logo,
      businessName: cart?.business?.name,
      cartTotal: cart?.total
    })
  }

  const getIncludedTaxes = () => {
    if (cart?.taxes === null) {
      return cart.business.tax_type === 1 ? cart?.tax : 0
    } else {
      return cart?.taxes.reduce((taxIncluded: number, tax: any) => {
        return taxIncluded + (tax.type === 1 ? tax.summary?.tax : 0)
      }, 0)
    }
  }

  const getIncludedTaxesDiscounts = () => {
    return cart?.taxes?.filter((tax: any) => tax?.type === 1)?.reduce((carry: number, tax: any) => carry + (tax?.summary?.tax_after_discount ?? tax?.summary?.tax), 0)
  }

  const onRemoveOffer = (id: number) => {
    setConfirm({
      open: true,
      content: [t('QUESTION_DELETE_OFFER', 'Are you sure that you want to delete the offer?')],
      title: t('OFFER', 'Offer'),
      handleOnAccept: () => {
        setConfirm({ ...confirm, open: false })
        handleRemoveOfferClick(id)
      }
    })
  }

  const walletName: any = {
    cash: {
      name: t('PAY_WITH_CASH_WALLET', 'Pay with Cash Wallet'),
    },
    credit_point: {
      name: t('PAY_WITH_CREDITS_POINTS_WALLET', 'Pay with Credit Points Wallet'),
    }
  }

  return (
    <CContainer>
      {openUpselling && (
        <UpsellingProducts
          handleUpsellingPage={handleUpsellingPage}
          openUpselling={openUpselling}
          businessId={cart?.business_id}
          business={cart?.business}
          cartProducts={cart?.products}
          canOpenUpselling={canOpenUpselling}
          setCanOpenUpselling={setCanOpenUpselling}
          handleCloseUpsellingPage={() => { }}
          isFromCart
        />
      )}
      <BusinessItemAccordion
        cart={cart}
        singleBusiness={props.singleBusiness}
        moment={momentFormatted}
        handleClearProducts={handleClearProducts}
        handleCartOpen={handleCartOpen}
        onNavigationRedirect={props.onNavigationRedirect}
        handleChangeStore={props.isFranchiseApp ? () => setOpenChangeStore(true) : null}
        handleClickCheckout={() => setOpenUpselling(true)}
        checkoutButtonDisabled={(openUpselling && !canOpenUpselling) || cart?.subtotal < cart?.minimum || !cart?.valid_address}
      >
        {cart?.products?.length > 0 && cart?.products.map((product: any) => (
          <ProductItemAccordion
            key={product.code}
            isCartPending={isCartPending}
            isCartProduct
            product={product}
            changeQuantity={changeQuantity}
            getProductMax={getProductMax}
            offsetDisabled={offsetDisabled}
            onDeleteProduct={handleDeleteClick}
            onEditProduct={handleEditProduct}
          />
        ))}

        {cart?.valid_products && (
          <OSBill>
            <OSTable>
              <OText size={12} lineHeight={18}>{t('SUBTOTAL', 'Subtotal')}</OText>
              <OText size={12} lineHeight={18}>
                {parsePrice(cart?.subtotal + getIncludedTaxes())}
              </OText>
            </OSTable>
            {cart?.discount > 0 && cart?.total >= 0 && cart?.offers?.length === 0 && (
              <OSTable>
                {cart?.discount_type === 1 ? (
                  <OText size={12} lineHeight={18}>
                    {t('DISCOUNT', 'Discount')}
                    <OText size={12} lineHeight={18}>{`(${verifyDecimals(cart?.discount_rate, parsePrice)}%)`}</OText>
                  </OText>
                ) : (
                  <OText size={12} lineHeight={18}>{t('DISCOUNT', 'Discount')}</OText>
                )}
                <OText size={12} lineHeight={18}>- {parsePrice(cart?.discount || 0)}</OText>
              </OSTable>
            )}
            {
              cart?.offers?.length > 0 && cart?.offers?.filter((offer: any) => offer?.target === 1)?.map((offer: any) => (
                <OSTable key={offer.id}>
                  <OSRow>
                    <OText size={12} lineHeight={18}>{offer.name}</OText>
                    {offer.rate_type === 1 && (
                      <OText size={12} lineHeight={18}>{`(${verifyDecimals(offer?.rate, parsePrice)}%)`}</OText>
                    )}
                    <TouchableOpacity style={{ marginLeft: 3 }} onPress={() => setOpenTaxModal({ open: true, data: offer, type: 'offer_target_1' })}>
                      <AntIcon name='infocirlceo' size={16} color={theme.colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginLeft: 3 }} onPress={() => onRemoveOffer(offer?.id)}>
                      <AntIcon name='closecircle' size={16} color={theme.colors.primary} />
                    </TouchableOpacity>
                  </OSRow>
                  <OText size={12} lineHeight={18}>
                    - {parsePrice(offer?.summary?.discount)}
                  </OText>
                </OSTable>
              ))
            }
            {/* <Divider /> */}
            {cart?.subtotal_with_discount > 0 && cart?.discount > 0 && cart?.total >= 0 && (
              <OSTable>
                <OText size={12} lineHeight={18} numberOfLines={1}>{t('SUBTOTAL_WITH_DISCOUNT', 'Subtotal with discount')}</OText>
                {cart?.business?.tax_type === 1 ? (
                  <OText size={12} lineHeight={18}>{parsePrice(cart?.subtotal_with_discount + getIncludedTaxesDiscounts() ?? 0)}</OText>
                ) : (
                  <OText size={12} lineHeight={18}>{parsePrice(cart?.subtotal_with_discount ?? 0)}</OText>
                )}
              </OSTable>
            )}
            {
              cart.taxes?.length > 0 && cart.taxes.filter((tax: any) => tax.type === 2 && tax?.rate !== 0).map((tax: any) => (
                <OSTable key={tax.id}>
                  <OSRow>
                    <OText size={12} lineHeight={18} numberOfLines={1} >
                      {tax.name || t('INHERIT_FROM_BUSINESS', 'Inherit from business')}{' '}
                      {`(${verifyDecimals(tax?.rate, parseNumber)}%)`}{' '}
                    </OText>
                    <TouchableOpacity onPress={() => setOpenTaxModal({ open: true, data: tax, type: 'tax' })} >
                      <AntIcon name='infocirlceo' size={16} color={theme.colors.primary} />
                    </TouchableOpacity>
                  </OSRow>
                  <OText size={12} lineHeight={18}>{parsePrice(tax?.summary?.tax_after_discount ?? tax?.summary?.tax ?? 0)}</OText>
                </OSTable>
              ))
            }
            {
              cart?.fees?.length > 0 && cart?.fees?.filter((fee: any) => !(fee.fixed === 0 && fee.percentage === 0)).map((fee: any) => (
                <OSTable key={fee?.id}>
                  <OSRow>
                    <OText size={12} lineHeight={18} numberOfLines={1}>
                      {fee.name || t('INHERIT_FROM_BUSINESS', 'Inherit from business')}{' '}
                      ({fee?.fixed > 0 && `${parsePrice(fee?.fixed)} + `}{fee.percentage}%){' '}
                    </OText>
                    <TouchableOpacity onPress={() => setOpenTaxModal({ open: true, data: fee, type: 'fee' })} >
                      <AntIcon name='infocirlceo' size={16} color={theme.colors.primary} />
                    </TouchableOpacity>
                  </OSRow>
                  <OText size={12} lineHeight={18}>{parsePrice(fee?.summary?.fixed + (fee?.summary?.percentage_after_discount ?? fee?.summary?.percentage) ?? 0)}</OText>
                </OSTable>
              ))
            }
            {
              cart?.offers?.length > 0 && cart?.offers?.filter((offer: any) => offer?.target === 3)?.map((offer: any) => (
                <OSTable key={offer.id}>
                  <OSRow>
                    <OText size={12} lineHeight={18}>{offer.name}</OText>
                    {offer.rate_type === 1 && (
                      <OText size={12} lineHeight={18}>{`(${verifyDecimals(offer?.rate, parsePrice)}%)`}</OText>
                    )}
                    <TouchableOpacity style={{ marginLeft: 3 }} onPress={() => setOpenTaxModal({ open: true, data: offer, type: 'offer_target_3' })}>
                      <AntIcon name='infocirlceo' size={16} color={theme.colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginLeft: 3 }} onPress={() => onRemoveOffer(offer?.id)}>
                      <AntIcon name='closecircle' size={16} color={theme.colors.primary} />
                    </TouchableOpacity>
                  </OSRow>
                  <OText size={12} lineHeight={18}>
                    - {parsePrice(offer?.summary?.discount)}
                  </OText>
                </OSTable>
              ))
            }
            {orderState?.options?.type === 1 && cart?.delivery_price > 0 && (
              <OSTable>
                <OText size={12} lineHeight={18}>{t('DELIVERY_FEE', 'Delivery Fee')}</OText>
                <OText size={12} lineHeight={18}>{parsePrice(cart?.delivery_price)}</OText>
              </OSTable>
            )}
            {
              cart?.offers?.length > 0 && cart?.offers?.filter((offer: any) => offer?.target === 2)?.map((offer: any) => (
                <OSTable key={offer.id}>
                  <OSRow>
                    <OText size={12} lineHeight={18}>{offer.name}</OText>
                    {offer.rate_type === 1 && (
                      <OText size={12} lineHeight={18}>{`(${verifyDecimals(offer?.rate, parsePrice)}%)`}</OText>
                    )}
                    <TouchableOpacity style={{ marginLeft: 3 }} onPress={() => setOpenTaxModal({ open: true, data: offer, type: 'offer_target_2' })}>
                      <AntIcon name='infocirlceo' size={16} color={theme.colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginLeft: 3 }} onPress={() => onRemoveOffer(offer?.id)}>
                      <AntIcon name='closecircle' size={16} color={theme.colors.primary} />
                    </TouchableOpacity>
                  </OSRow>
                  <OText size={12} lineHeight={18}>
                    - {parsePrice(offer?.summary?.discount)}
                  </OText>
                </OSTable>
              ))
            }
            {cart?.driver_tip > 0 && (
              <OSTable>
                <OText size={12} lineHeight={18}>
                  {t('DRIVER_TIP', 'Driver tip')}
                  {cart?.driver_tip_rate > 0 &&
                    parseInt(configs?.driver_tip_type?.value, 10) === 2 &&
                    !parseInt(configs?.driver_tip_use_custom?.value, 10) &&
                    (
                      `(${verifyDecimals(cart?.driver_tip_rate, parseNumber)}%)`
                    )}
                </OText>
                <OText size={12} lineHeight={18}>{parsePrice(cart?.driver_tip)}</OText>
              </OSTable>
            )}
            {cart?.payment_events?.length > 0 && cart?.payment_events?.map((event: any) => (
              <OSTable key={event.id}>
                <OText size={12} numberOfLines={1}>
                  {walletName[cart?.wallets?.find((wallet: any) => wallet.id === event.wallet_id)?.type]?.name}
                </OText>
                <OText size={12}>-{parsePrice(event.amount, { isTruncable: true })}</OText>
              </OSTable>
            ))}
            {isCouponEnabled && !isCartPending && (
              <OSTable>
                <OSCoupon>
                  <CouponControl
                    businessId={businessId}
                    price={cart.total}
                  />
                </OSCoupon>
              </OSTable>
            )}

            <OSTotal>
              <OSTable style={{ marginTop: 15 }}>
                <OText size={14} lineHeight={21} weight={'600'}>
                  {t('TOTAL', 'Total')}
                </OText>
                <OText size={14} lineHeight={21} weight={'600'}>
                  {parsePrice(cart?.total >= 0 ? cart?.total : 0)}
                </OText>
              </OSTable>
            </OSTotal>
            {placeSpotTypes.includes(orderState?.options?.type) && (
              <OSTable style={{ marginTop: 15 }}>
                <OText size={14} lineHeight={21} weight={'600'}>
                  {t('SPOT', 'Spot')}: {cart?.place?.name || t('NO_SELECTED', 'No selected')}
                </OText>
                <TouchableOpacity onPress={() => setOpenPlaceModal(true)}>
                  <OText
                    size={14}
                    lineHeight={21}
                    weight={'600'}
                    color={theme.colors.primary}
                    style={{ textDecorationLine: 'underline' }}
                  >
                    {t('EDIT', 'Edit')}
                  </OText>
                </TouchableOpacity>
              </OSTable>
            )}
            {cart?.status !== 2 && (
              <OSTable>
                <View style={{ width: '100%', marginTop: 20 }}>
                  <OText size={16} lineHeight={18}>{t('COMMENTS', 'Comments')}</OText>
                  <View style={{ flex: 1, width: '100%' }}>
                    <OInput
                      value={cart?.comment}
                      placeholder={t('SPECIAL_COMMENTS', 'Special Comments')}
                      onChange={(value: string) => handleChangeComment(value)}
                      style={{
                        alignItems: 'flex-start',
                        width: '100%',
                        height: 100,
                        borderColor: theme.colors.border,
                        paddingRight: 50,
                        marginTop: 10,
                        borderRadius: 7.6
                      }}
                      multiline
                    />
                    {commentState?.loading && (
                      <View style={{ position: 'absolute', right: 20 }}>
                        <ActivityIndicator
                          size='large'
                          style={{ height: 100 }}
                          color={theme.colors.primary}
                        />
                      </View>
                    )}
                  </View>
                </View>
              </OSTable>
            )}
          </OSBill>
        )}
        {cart?.valid_products && (
          <CheckoutAction>
            <OButton
              text={(cart?.subtotal >= cart?.minimum || !cart?.minimum) && cart?.valid_address ? (
                !openUpselling !== canOpenUpselling ? t('CHECKOUT', 'Checkout') : t('LOADING', 'Loading')
              ) : !cart?.valid_address ? (
                `${t('OUT_OF_COVERAGE', 'Out of Coverage')}`
              ) : (
                `${t('MINIMUN_SUBTOTAL_ORDER', 'Minimum subtotal order:')} ${parsePrice(cart?.minimum)}`
              )}
              bgColor={(cart?.subtotal < cart?.minimum || !cart?.valid_address) ? theme.colors.secundary : theme.colors.primary}
              isDisabled={(openUpselling && !canOpenUpselling) || cart?.subtotal < cart?.minimum || !cart?.valid_address}
              borderColor={theme.colors.primary}
              imgRightSrc={null}
              textStyle={{ color: 'white', textAlign: 'center', flex: 1 }}
              onClick={() => setOpenUpselling(true)}
              style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', borderRadius: 7.6, shadowOpacity: 0 }}
            />
          </CheckoutAction>
        )}
      </BusinessItemAccordion>

      <OModal
        open={openChangeStore && props.isFranchiseApp}
        entireModal
        customClose
        onClose={() => setOpenChangeStore(false)}
      >
        <CartStoresListing
          cartuuid={cart?.uuid}
          onClose={() => setOpenChangeStore(false)}
        />
      </OModal>
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
          products={cart?.products}
        />
      </OModal>
      <OModal
        open={openPlaceModal}
        title={t('CHOOSE_YOUR_SPOT', 'Choose your spot')}
        onClose={() => setOpenPlaceModal(false)}
        entireModal
      >
        <PlaceSpot
          cart={cart}
          isOpenPlaceSpot={openPlaceModal}
          setOpenPlaceModal={setOpenPlaceModal}
        />
      </OModal>
      <OAlert
        open={confirm.open}
        title={confirm.title}
        content={confirm.content}
        onAccept={confirm.handleOnAccept}
        onCancel={() => setConfirm({ ...confirm, open: false, title: null })}
        onClose={() => setConfirm({ ...confirm, open: false, title: null })}
      />
    </CContainer>
  )
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
