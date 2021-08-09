import React, { useState } from 'react';
import { View, Animated } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useUtils, useLanguage } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import {
  Accordion,
  AccordionSection,
  // ProductInfo,
  // ProductQuantity,
  ContentInfo,
  // ProductImage,
  AccordionContent,
  ProductOptionsList,
  ProductOption,
  ProductSubOption,
  ProductComment,
} from './styles';
import { OText, OAlert } from '../shared';
import { ProductItemAccordionParams } from '../../types';

export const ProductItemAccordion = (props: ProductItemAccordionParams) => {
  const {
    isCartPending,
    isCartProduct,
    product,
    getProductMax,
    onDeleteProduct,
    onEditProduct,
    comment,
  } = props;
  const [, t] = useLanguage();
  const theme = useTheme();
  const [{ parsePrice }] = useUtils();

  const [isActive, setActiveState] = useState(false);

  const productInfo = () => {
    if (isCartProduct) {
      const ingredients = JSON.parse(
        JSON.stringify(Object.values(product.ingredients ?? {})),
      );
      let options = JSON.parse(
        JSON.stringify(Object.values(product.options ?? {})),
      );

      options = options.map((option: any) => {
        option.suboptions = Object.values(option.suboptions ?? {});
        return option;
      });
      return {
        ...productInfo,
        ingredients,
        options,
      };
    }
    return product;
  };

  const getFormattedSubOptionName = ({
    quantity,
    name,
    position,
    price,
  }: {
    quantity: number;
    name: string;
    position: string;
    price: number;
  }) => {
    const pos = position ? `(${position})` : '';
    return `${quantity} x ${name} ${pos} +${price}`;
  };

  /*useEffect(() => {
    toggleAccordion()
  }, [isActive])*/

  const productOptions =
    getProductMax &&
    [...Array(getProductMax(product) + 1)].map((_: any, opt: number) => {
      return {
        label: opt === 0 ? t('REMOVE', 'Remove') : opt.toString(),
        value: opt.toString(),
      };
    });

  return (
    <AccordionSection>
      <Accordion
        isValid={product?.valid ?? true}
        onPress={() =>
          !product?.valid_menu && isCartProduct ? {} : setActiveState(!isActive)
        }
        activeOpacity={1}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <ContentInfo>
            <View style={{ flexDirection: 'row' }}>
              <OText color={theme.colors.quantityProduct} space>
                {product?.quantity}
              </OText>
              <View style={{ width: 200 }}>
                <OText
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  size={12}
                  color={theme.colors.textGray}
                  style={{ marginLeft: 5 }}>
                  {product?.name}
                </OText>
              </View>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                alignItems: 'flex-end',
              }}>
              <View style={{ flexDirection: 'row' }}>
                <OText size={12} color={theme.colors.textGray}>
                  {parsePrice(product.total || product.price)}
                </OText>
                {(productInfo().ingredients.length > 0 ||
                  productInfo().options.length > 0 ||
                  product.comment) && (
                  <MaterialCommunityIcon name="chevron-down" size={12} />
                )}
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                }}>
                {onEditProduct &&
                  isCartProduct &&
                  !isCartPending &&
                  product?.valid_menu && (
                    <MaterialCommunityIcon
                      name="pencil-outline"
                      size={26}
                      color={theme.colors.green}
                      onPress={() => onEditProduct(product)}
                    />
                  )}
                {onDeleteProduct && isCartProduct && !isCartPending && (
                  <OAlert
                    title={t('DELETE_PRODUCT', 'Delete Product')}
                    message={t(
                      'QUESTION_DELETE_PRODUCT',
                      'Are you sure that you want to delete the product?',
                    )}
                    onAccept={() => onDeleteProduct(product)}>
                    <MaterialCommunityIcon
                      name="trash-can-outline"
                      size={26}
                      color={theme.ecolors.red}
                    />
                  </OAlert>
                )}
              </View>
            </View>
          </ContentInfo>
        </View>

        {((isCartProduct &&
          !isCartPending &&
          product?.valid_menu &&
          !product?.valid_quantity) ||
          (!product?.valid_menu && isCartProduct && !isCartPending)) && (
          <OText
            size={24}
            color={theme.colors.red}
            style={{ textAlign: 'center', marginTop: 10 }}>
            {t('NOT_AVAILABLE', 'Not available')}
          </OText>
        )}
      </Accordion>

      <View style={{ display: isActive ? 'flex' : 'none' }}>
        <Animated.View>
          <AccordionContent>
            {productInfo().ingredients.length > 0 &&
              productInfo().ingredients.some(
                (ingredient: any) => !ingredient.selected,
              ) && (
                <ProductOptionsList>
                  <OText size={12} color={theme.colors.unselectText}>
                    {t('INGREDIENTS', 'Ingredients')}:
                  </OText>
                  {productInfo().ingredients.map(
                    (ingredient: any) =>
                      !ingredient.selected && (
                        <OText
                          size={12}
                          color={theme.colors.unselectText}
                          key={ingredient.id}
                          style={{ marginLeft: 10 }}>
                          {t('NO', 'No')} {ingredient.name}
                        </OText>
                      ),
                  )}
                </ProductOptionsList>
              )}
            {productInfo().options.length > 0 && (
              <ProductOptionsList>
                {productInfo().options.map((option: any, i: number) => (
                  <ProductOption key={option.id + i}>
                    <OText size={12} color={theme.colors.unselectText}>
                      {option.name}:
                    </OText>
                    {option.suboptions.map((suboption: any) => (
                      <ProductSubOption key={suboption.id}>
                        <OText size={12} color={theme.colors.unselectText}>
                          {getFormattedSubOptionName({
                            quantity: suboption.quantity,
                            name: suboption.name,
                            position:
                              suboption.position !== 'whole'
                                ? t(
                                    suboption.position.toUpperCase(),
                                    suboption.position,
                                  )
                                : '',
                            price: parsePrice(suboption.price),
                          })}
                        </OText>
                      </ProductSubOption>
                    ))}
                  </ProductOption>
                ))}
              </ProductOptionsList>
            )}
            {comment && (
              <ProductComment>
                <OText size={12} space color={theme.colors.unselectText}>
                  {t('SPECIAL_COMMENT', 'Special Comment')}:
                </OText>
                <OText size={12} color={theme.colors.unselectText}>
                  {comment}
                </OText>
              </ProductComment>
            )}
          </AccordionContent>
        </Animated.View>
      </View>
    </AccordionSection>
  );
};