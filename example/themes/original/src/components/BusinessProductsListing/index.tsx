import React, { useEffect, useState } from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

import {
	BusinessAndProductList,
	useLanguage,
	useOrder,
	useSession,
	useUtils
} from 'ordering-components/native'
import { OButton, OIcon, OModal, OText } from '../shared'
import { BusinessBasicInformation } from '../BusinessBasicInformation'
import { SearchBar } from '../SearchBar'
import { BusinessProductsCategories } from '../BusinessProductsCategories'
import { BusinessProductsList } from '../BusinessProductsList'
import { BusinessProductsListingParams } from '../../types'
import {
	WrapHeader,
	TopHeader,
	AddressInput,
	WrapSearchBar,
	WrapContent,
	BusinessProductsListingContainer
} from './styles'
import { colors, images } from '../../theme.json'
import { FloatingButton } from '../FloatingButton'
import { ProductForm } from '../ProductForm'
import { UpsellingProducts } from '../UpsellingProducts'
const BusinessProductsListingUI = (props: BusinessProductsListingParams) => {
	const {
		navigation,
		errors,
		businessState,
		categoryState,
		handleChangeSearch,
		categorySelected,
		searchValue,
		handleChangeCategory,
		handleSearchRedirect,
		featuredProducts,
		errorQuantityProducts,
		header,
		logo
	} = props

	const [, t] = useLanguage()
	const [{ auth }] = useSession()
	const [orderState] = useOrder()
	const [{ parsePrice }] = useUtils()

	const { business, loading, error } = businessState
	const [openBusinessInformation, setOpenBusinessInformation] = useState(false)
	const [isOpenSearchBar, setIsOpenSearchBar] = useState(false)
	const [curProduct, setCurProduct] = useState(null)
	const [openUpselling, setOpenUpselling] = useState(false)
	const [canOpenUpselling, setCanOpenUpselling] = useState(false)

	const currentCart: any = Object.values(orderState.carts).find((cart: any) => cart?.business?.slug === business?.slug) ?? {}

	const onRedirect = (route: string, params?: any) => {
		navigation.navigate(route, params)
	}

	const onProductClick = (product: any) => {
		setCurProduct(product)
	}

	const handleCancel = () => {
		setIsOpenSearchBar(false)
		handleChangeSearch('')
	}

	const handleCloseProductModal = () => {
		setCurProduct(null)
	}

	const handlerProductAction = () => {
		handleCloseProductModal()
	}

	const handleUpsellingPage = () => {
		onRedirect('CheckoutNavigator', {
			screen: 'CheckoutPage',
			cartUuid: currentCart?.uuid,
			businessLogo: logo,
			businessName: business?.name,
			cartTotal: currentCart?.total
		})
		setOpenUpselling(false)
	}

	const handleCloseUpsellingPage = () => {
		setOpenUpselling(false)
	}

	useEffect(() => {
		if (!orderState.loading) {
			handleCloseProductModal()
		}
	}, [orderState.loading])

	return (
		<>
			<BusinessProductsListingContainer style={styles.mainContainer} isActiveFloatingButtom={currentCart?.products?.length > 0 && categoryState.products.length !== 0}>
				<WrapHeader>
					{/* {!loading && business?.id && ( */}
					<TopHeader>
						{!isOpenSearchBar && (
							<>
								<View style={{ ...styles.headerItem, flex: 1 }}>
									<OButton
										imgLeftSrc={images.general.arrow_left}
										imgRightSrc={null}
										style={styles.btnBackArrow}
										onClick={() => navigation?.canGoBack() && navigation.goBack()}
										imgLeftStyle={{ tintColor: colors.textNormal }}
									/>
									{/* <AddressInput
                      onPress={() => auth
                        ? onRedirect('AddressList', { isGoBack: true, isFromProductsList: true })
                        : onRedirect('AddressForm', { address: orderState.options?.address })}
                    >
                      <OText color={colors.white} numberOfLines={1}>
                        {orderState?.options?.address?.address}
                      </OText>
                    </AddressInput> */}
								</View>
								{!errorQuantityProducts && (
									<View style={{ ...styles.headerItem }}>
										<TouchableOpacity
											onPress={() => setIsOpenSearchBar(true)}
											style={styles.searchIcon}
										>
											<OIcon src={images.general.search} color={colors.textNormal} width={16} />
										</TouchableOpacity>
									</View>
								)}
							</>
						)}
						{isOpenSearchBar && (
							<WrapSearchBar>
								<SearchBar
									onSearch={handleChangeSearch}
									onCancel={() => handleCancel()}
									isCancelXButtonShow
									noBorderShow
									placeholder={t('SEARCH_PRODUCTS', 'Search Products')}
									lazyLoad={businessState?.business?.lazy_load_products_recommended}
								/>
							</WrapSearchBar>
						)}
					</TopHeader>
					{/* )} */}
					<BusinessBasicInformation
						navigation={navigation}
						businessState={businessState}
						openBusinessInformation={openBusinessInformation}
						header={header}
						logo={logo}
					/>
				</WrapHeader>
				<View style={{ height: 8, backgroundColor: colors.backgroundGray100 }} />
				{!loading && business?.id && (
					<>
						{!(business?.categories?.length === 0) && (
							<BusinessProductsCategories
								categories={[{ id: null, name: t('ALL', 'All') }, { id: 'featured', name: t('FEATURED', 'Featured') }, ...business?.categories.sort((a: any, b: any) => a.rank - b.rank)]}
								categorySelected={categorySelected}
								onClickCategory={handleChangeCategory}
								featured={featuredProducts}
								openBusinessInformation={openBusinessInformation}
							/>
						)}
						<WrapContent>
							<BusinessProductsList
								categories={[
									{ id: null, name: t('ALL', 'All') },
									{ id: 'featured', name: t('FEATURED', 'Featured') },
									...business?.categories.sort((a: any, b: any) => a.rank - b.rank)
								]}
								category={categorySelected}
								categoryState={categoryState}
								businessId={business.id}
								errors={errors}
								onProductClick={onProductClick}
								handleSearchRedirect={handleSearchRedirect}
								featured={featuredProducts}
								searchValue={searchValue}
								handleClearSearch={handleChangeSearch}
								errorQuantityProducts={errorQuantityProducts}
								handleCancelSearch={handleCancel}
							/>
						</WrapContent>
					</>
				)}
				{loading && !error && (
					<>
						<BusinessProductsCategories
							categories={[]}
							categorySelected={categorySelected}
							onClickCategory={handleChangeCategory}
							featured={featuredProducts}
							openBusinessInformation={openBusinessInformation}
							loading={loading}
						/>
						<WrapContent>
							<BusinessProductsList
								categories={[]}
								category={categorySelected}
								categoryState={categoryState}
								isBusinessLoading={loading}
								errorQuantityProducts={errorQuantityProducts}
							/>
						</WrapContent>
					</>
				)}
			</BusinessProductsListingContainer>
			{!loading && auth && !openUpselling && currentCart?.products?.length > 0 && categoryState.products.length !== 0 && (
				<FloatingButton
					btnText={
						currentCart?.subtotal >= currentCart?.minimum
							? !openUpselling ? t('VIEW_ORDER', 'View Order') : t('LOADING', 'Loading')
							: `${t('MINIMUN_SUBTOTAL_ORDER', 'Minimum subtotal order:')} ${parsePrice(currentCart?.minimum)}`
					}
					isSecondaryBtn={currentCart?.subtotal < currentCart?.minimum}
					btnLeftValueShow={currentCart?.subtotal >= currentCart?.minimum && !openUpselling && currentCart?.products?.length > 0}
					btnRightValueShow={currentCart?.subtotal >= currentCart?.minimum && !openUpselling && currentCart?.products?.length > 0}
					btnLeftValue={currentCart?.products?.length}
					btnRightValue={parsePrice(currentCart?.total)}
					disabled={openUpselling || currentCart?.subtotal < currentCart?.minimum}
					handleClick={() => setOpenUpselling(true)}
				/>
			)}
			<OModal
				open={!!curProduct}
				onClose={handleCloseProductModal}
				entireModal
				customClose
			>
				<ProductForm
					product={curProduct}
					businessSlug={business.slug}
					businessId={business.id}
					onClose={handleCloseProductModal}
					navigation={navigation}
					onSave={handlerProductAction}
				/>
			</OModal>
			{openUpselling && (
				<UpsellingProducts
					businessId={currentCart?.business_id}
					business={currentCart?.business}
					cartProducts={currentCart?.products}
					cart={currentCart}
					handleUpsellingPage={handleUpsellingPage}
					handleCloseUpsellingPage={handleCloseUpsellingPage}
					openUpselling={openUpselling}
					canOpenUpselling={canOpenUpselling}
					setCanOpenUpselling={setCanOpenUpselling}
				/>
			)}
		</>
	)
}

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
	},
	BackIcon: {
		paddingRight: 20,
	},
	headerItem: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 2,
		marginHorizontal: 20,
	},
	btnBackArrow: {
		borderWidth: 0,
		backgroundColor: colors.clear,
		shadowColor: colors.clear,
	},
	searchIcon: {
		borderWidth: 0,
		padding: 15,
		justifyContent: 'center',
		shadowColor: colors.clear,
	}
})

export const BusinessProductsListing = (props: BusinessProductsListingParams) => {
	const businessProductslistingProps = {
		...props,
		UIComponent: BusinessProductsListingUI
	}
	return (
		<BusinessAndProductList {...businessProductslistingProps} />
	)
}