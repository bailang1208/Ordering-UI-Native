import React from 'react'
import { ProductOption as ProductOptionController, useLanguage } from 'ordering-components/native'
import {
	Container,
	WrapHeader,
} from './styles'
import { OText } from '../shared'
import { colors, labels } from '../../theme.json'
import { TextStyle, View } from 'react-native'

const ProductOptionUI = (props: any) => {
	const {
		children,
		option,
		error
	} = props

	const [, t] = useLanguage()

	let maxMin = `(${t('MIN', 'Min')}: ${option.min} / ${t('MAX', 'Max')}: ${option.max})`
	if (option.min === 0 && option.max > 0) {
		maxMin = `(${t('MAX', 'Max')}: ${option.max})`
	} else if (option.min > 0 && option.max === 0) {
		maxMin = `(${t('MIN', 'Min')}: ${option.min})`
	}

	let required = t('OPTIONAL', 'Optional')
	if (option.min === 1 && option.max === 1) {
		required = t('REQUIRED', 'Required')
	}

	return (
		<Container style={{ color: error ? 'orange' : colors.white }}>
			<WrapHeader>
				<View>
					<OText style={labels.middle as TextStyle}>{option.name}</OText>
					<OText style={labels.small as TextStyle} color={colors.textSecondary}>{maxMin}</OText>
				</View>
				<OText size={10} weight={'600'} color={colors.error}>{required}</OText>
			</WrapHeader>
			{children}
		</Container>
	)
}

export const ProductOption = (props: any) => {
	const productOptionProps = {
		...props,
		UIComponent: ProductOptionUI
	}

	return (
		<ProductOptionController {...productOptionProps} />
	)
}