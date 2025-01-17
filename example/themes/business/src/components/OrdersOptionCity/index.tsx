import React, { useState, useEffect } from 'react';
import { useLanguage } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { Container } from './styles';
import ODropDown from '../shared/ODropDown';
import { MainSearch as MainSearchController } from 'ordering-components/native'
import { Platform } from 'react-native';

export const OrdersOptionCityUI = (props: any) => {
  const {
    search,
    onSearch,
    allListValues
  } = props

  const theme = useTheme();
  const [, t] = useLanguage();
  const [optionsList, setOptionsList] = useState([])

  useEffect(() => {
    const cities: any = []
    for (const country of allListValues?.countries) {
      for (const city of country.cities) {
        cities.push({value: city.id, content: city.name})
      }
    }
    setOptionsList(cities)
  }, [allListValues?.countries])

  return (
    <Container isIos={Platform.OS === 'ios'}>
      <ODropDown
        options={optionsList}
        defaultValue={search.city}
        onSelect={(option: any) => onSearch({ ...search, city: option })}
        isModal
        bgcolor={theme.colors.inputDisabled}
        textcolor={theme.colors.unselectText}
        placeholder={t('SELECT_CITY', 'Select City')}
        dropViewMaxHeight={200}
      />
    </Container>
  );
};

export const OrdersOptionCity = (props: any) => {
  const ordersOptionCityProps = {
    ...props,
    UIComponent: OrdersOptionCityUI
  };
  return <MainSearchController {...ordersOptionCityProps} />;
};
