import React from 'react'
import { useLanguage } from 'ordering-components/native'
import { SingleProductCard } from '../SingleProductCard'
import { TaxInformationContainer, ProductContainer } from './styles'
import { OText } from '../shared'

interface taxInformationParams {
  data: {
    name: string,
    description?: string,
    rate: string | number,
    type: string | number,
    fixed?: number,
    percentage?: number,
    id: number,
    discounts?: any
  } | null,
  products: Array<any>,
  type: string
}

export const TaxInformation = (props: taxInformationParams) => {
  const {
    data,
    products,
    type
  } = props

  const [, t] = useLanguage()

  const includedOnPriceString = data?.type === 1 ? `(${t('INCLUDED_ON_PRICE', 'Included on price')})` : `(${t('NOT_INCLUDED_ON_PRICE', 'Not included on price')})`
  const offersHideArray = ['offer_target_2', 'offer_target_3']
  const hideProductsSectionOffers = offersHideArray.includes(type)
  const dataHideArray : Array<string | number> = ['platform', 'business']
  const hideProductsSectionData = dataHideArray.includes(data.type)

  const getFilterValidation = (product: any) => {
    return (
      type === 'tax'
        ? (product.tax?.id ? product.tax?.id === data?.id : product.tax?.id === null && data?.id === null)
        : type === 'fee'
          ? (product.fee?.id ? product.fee?.id === data?.id : (product.fee?.id === null && data?.id === null))
          : Object.keys(data?.discounts ?? {}).map(code => code.includes(product?.code)) && product?.offers?.find((offer : any) => offer?.name === data?.name)
    )
  }

  const getTypeString = () => {
    return (
      type === 'offer_target_1'
        ? t('PRODUCT_DISCOUNT', 'Product discount')
        : type === 'tax'
          ? t('TAX', 'Tax')
          : t('Fee', 'Fee')
    )
  }

  return (
    <TaxInformationContainer>
      {!!data?.description ? (
        <OText size={24} style={{ alignSelf: 'center', textAlign: 'center' }} mBottom={10}>
          {t('DESCRIPTION', 'Description')}: {data?.description} {data?.type && !type?.includes('offer') && includedOnPriceString}
        </OText>
      ) : (
        <OText mBottom={10} size={18} style={{ alignSelf: 'center', textAlign: 'center' }}>
          {t('WITHOUT_DESCRIPTION', 'Without description')}
        </OText>
      )}
      {!hideProductsSectionOffers && !hideProductsSectionData && (
        <>
          <OText>{t('OTHER_PRODUCTS_WITH_THIS', 'Other products with this')} {getTypeString()}:</OText>
          <ProductContainer>
            {
              products.filter((product: any) => getFilterValidation(product)).map(product => (
                <SingleProductCard
                  key={product.id}
                  product={product}
                  isSoldOut={false}
                  businessId={product?.business_id}
                />
              ))
            }
          </ProductContainer>
        </>
      )}
    </TaxInformationContainer>
  )
}
