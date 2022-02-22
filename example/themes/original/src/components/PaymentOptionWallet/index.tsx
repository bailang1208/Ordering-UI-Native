import React, { useState, useEffect } from 'react'
import { Platform, StyleSheet, View } from 'react-native'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import { useTheme } from 'styled-components/native'
import CheckBox from '@react-native-community/checkbox';
import {
  PaymentOptionWallet as PaymentOptionWalletController,
  useLanguage,
  useUtils,
} from 'ordering-components/native'

import {
  Container,
  SectionLeft,
} from './styles'

import { OText } from '../shared'

const PaymentOptionWalletUI = (props: any) => {
  const {
    cart,
    walletsState,
    selectWallet,
    deletetWalletSelected
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()
  const [{ parsePrice }] = useUtils()

  const styles = StyleSheet.create({
    checkBoxStyle: {
      width: 25,
      height: 25,
    }
  });

  const [checkedState, setCheckedState] = useState(
    new Array(walletsState.result?.length).fill(false)
  );

  const creditBalance = (wallet: any) => ` = ${parsePrice((wallet.balance * wallet.redemption_rate) / 100)}`

  const walletName: any = {
    cash: {
      name: t('PAY_WITH_CASH_WALLET', 'Pay with Cash Wallet'),
    },
    credit_point: {
      name: t('PAY_WITH_CREDITS_POINTS_WALLET', 'Pay with Credit Points Wallet'),
    }
  }

  const handleOnChange = (position: any, wallet: any) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );

    if (!checkedState[position]) {
      selectWallet(wallet)
    } else {
      deletetWalletSelected(wallet)
    }

    setCheckedState(updatedCheckedState);
  };

  useEffect(() => {
    if (!walletsState.loading) {
      setCheckedState(
        walletsState.result.map((wallet: any) => {
          return !!cart?.wallets?.find((w: any) => w.id === wallet.id)
        })
      )
    }
  }, [walletsState.result?.length])

  return (
    <>
      {!walletsState.loading &&
        !walletsState.error &&
        walletsState.result?.length > 0 &&
      (
        <>
          {walletsState.result?.map((wallet: any, idx: any) => wallet.valid && (
            <Container
              key={wallet.id}
              isBottomBorder={idx === walletsState.result?.filter((wallet: any) => wallet.valid)?.length - 1}
            >
              <SectionLeft>
                <CheckBox
                  value={checkedState[idx]}
                  onValueChange={() => handleOnChange(idx, wallet)}
                  disabled={(cart?.balance === 0 && !checkedState[idx]) || wallet.balance === 0 }
                  boxType={'square'}
                  tintColors={{
                    true: theme.colors.primary,
                    false: theme.colors.disabled
                  }}
                  tintColor={theme.colors.disabled}
                  onCheckColor={theme.colors.primary}
                  onTintColor={theme.colors.primary}
                  style={Platform.OS === 'ios' && styles.checkBoxStyle}
                />
                <View style={{ alignItems: 'baseline' }}>
                  <View>
                    <OText
                      style={((cart?.balance === 0 && !checkedState[idx]) || wallet.balance === 0) ?{
                        color: theme.colors.disabled
                      } : {}}
                    >
                      {walletName[wallet.type]?.name}
                    </OText>
                  </View>
              </View>
              </SectionLeft>

              <View style={{maxWidth: '40%', alignItems: 'flex-end' }}>
                {wallet.type === 'cash' && (
                  <OText>
                    {parsePrice(wallet?.balance)}
                  </OText>
                )}
                {wallet.type === 'credit_point' && (
                  <OText>
                    <OText color={theme.colors.primary} weight='bold'>
                    {`${wallet?.balance} ${t('POINTS', 'Points')}`}
                    </OText>
                    <OText>
                      {`${wallet.balance > 0 && creditBalance(wallet)}`}
                    </OText>
                  </OText>
                )}
              </View>
            </Container>
          ))}
        </>
      )}

      {walletsState?.loading && (
        <View>
          {[...Array(2).keys()].map(i => (
            <View style={{ marginBottom: 10 }} key={i}>
              <Placeholder Animation={Fade}>
                <PlaceholderLine width={100} height={40} style={{ marginBottom: 0, borderRadius: 8 }} />
              </Placeholder>
            </View>
          ))}
        </View>
      )}
    </>
  )
}

export const PaymentOptionWallet = (props: any) => {
  const paymentWalletProps = {
    ...props,
    UIComponent: PaymentOptionWalletUI
  }

  return (
    <PaymentOptionWalletController {...paymentWalletProps} />
  )
}