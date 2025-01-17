import React, { useState, useEffect } from 'react'
import { Pressable, View } from 'react-native';
import { useTheme } from 'styled-components/native'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import {
  WalletList,
  useLanguage,
  useUtils,
  useConfig
} from 'ordering-components/native'

import {
  Container,
  BalanceElement,
  TransactionsWrapper,
  OTabs,
  OTab,
  SectionContent
} from './styles'

import NavBar from '../NavBar'
import { OText } from '../shared';
import { NotFoundSource } from '../NotFoundSource';
import { WalletTransactionItem } from '../WalletTransactionItem'

const WalletsUI = (props: any) => {
  const {
    navigation,
    walletList,
    transactionsList,
    setWalletSelected,
    isWalletCashEnabled,
    isWalletPointsEnabled
  } = props

  const [, t] = useLanguage()
  const theme = useTheme()
  const [{ parsePrice }] = useUtils()
  const [{ configs }] = useConfig()

  const [tabSelected, setTabSelected] = useState(isWalletCashEnabled ? 'cash' : 'credit_point')

  const isWalletEnabled = configs?.wallet_enabled?.value === '1' && (isWalletCashEnabled || isWalletPointsEnabled)

  const currentWalletSelected = (walletList.wallets?.length > 0 && walletList.wallets?.find((w: any) => w.type === tabSelected)) ?? null

  const walletName: any = {
    cash: {
      name: t('CASH_WALLET', 'Cash Wallet'),
      value: 0,
      isActive: isWalletCashEnabled
    },
    credit_point: {
      name: t('CREDITS_POINTS_WALLET', 'Credit Points Wallet'),
      value: 1,
      isActive: isWalletPointsEnabled
    }
  }

  const handleChangeTab = (wallet: any) => {
    setTabSelected(wallet.type)
    setWalletSelected(wallet.id)
  }

  const goToBack = () => {
    navigation?.canGoBack() && navigation.goBack()
  }

  useEffect(() => {
    if (!isWalletEnabled) {
      navigation.navigate('BottomTab', {
        screen: 'Profile'
      })
    }
  }, [configs])

  return (
    <Container>
      <NavBar
        title={t('WALLETS', 'Wallets')}
        titleAlign={'center'}
        onActionLeft={goToBack}
        showCall={false}
        paddingTop={10}
        btnStyle={{ paddingLeft: 0 }}
      />

      {!walletList.loading &&
        !walletList.error &&
        walletList.wallets?.length > 0 &&
      (
        <>
          <OTabs>
            {walletList.wallets?.map((wallet: any) => walletName[wallet.type]?.isActive && (
              <Pressable
                key={wallet.id}
                onPress={() => handleChangeTab(wallet)}
              >
                <OTab>
                  <OText size={18} color={tabSelected === wallet.type ? theme.colors.primary : theme.colors.disabled}>
                    {walletName[wallet.type]?.name}
                  </OText>
                </OTab>
              </Pressable>
            ))}
          </OTabs>

          <SectionContent>
            <BalanceElement>
              <OText size={20} style={{fontWeight: '600'}}>
                {currentWalletSelected?.type === 'cash'
                  ? parsePrice(currentWalletSelected?.balance)
                  : currentWalletSelected?.balance
                }
              </OText>
              <OText style={{ paddingLeft: 5 }}>
                {currentWalletSelected?.type === 'cash'
                  ? configs?.stripe_currency?.value
                  : t('POINTS', 'Points')}
              </OText>
            </BalanceElement>

            <View style={{ marginTop: 20, width: '100%', paddingHorizontal: 1, paddingBottom: 40 }}>
              {!transactionsList?.loading &&
                !transactionsList?.error &&
                transactionsList.list?.[`wallet:${currentWalletSelected?.id}`]?.length > 0 &&
              (
                <>
                  <OText style={{fontSize: 20}}>
                    {t('TRANSACTIONS_HISTORY', 'Transactions history')}
                  </OText>
                  <TransactionsWrapper>
                    {transactionsList.list?.[`wallet:${currentWalletSelected?.id}`]?.map((transaction: any, i: number) =>(
                      <WalletTransactionItem
                        idx={i}
                        type={currentWalletSelected?.type}
                        key={transaction.id}
                        item={transaction}
                        withFormatPrice={currentWalletSelected?.type === 'cash'}
                      />
                    ))}
                  </TransactionsWrapper>
                </>
              )}

              {(transactionsList?.loading || !transactionsList.list?.[`wallet:${currentWalletSelected?.id}`]) && (
                <View>
                  {[...Array(4).keys()].map(i => (
                    <View style={{ marginBottom: 10 }} key={i}>
                      <Placeholder Animation={Fade}>
                        <PlaceholderLine width={100} height={100} style={{ marginBottom: 0, borderRadius: 8 }} />
                      </Placeholder>
                    </View>
                  ))}
                </View>
              )}

              {!transactionsList?.loading &&
                !(transactionsList?.loading && transactionsList.list?.[`wallet:${currentWalletSelected?.id}`]) &&
                (transactionsList?.error ||
                  !transactionsList.list?.[`wallet:${currentWalletSelected?.id}`]?.length) &&
              (
                <NotFoundSource
                  content={transactionsList?.error
                    ? t('ERROR_NOT_FOUND_TRANSACTIONS', 'Sorry, an error has occurred')
                    : t('NOT_FOUND_TRANSACTIONS', 'No transactions to show at this time.')
                  }
                />
              )}
            </View>
          </SectionContent>
        </>
      )}

      {walletList?.loading && (
        <>
          <View>
            <Placeholder Animation={Fade}>
              <PlaceholderLine width={100} height={40} style={{ marginBottom: 0 }} />
            </Placeholder>
          </View>
          <View style={{ marginTop: 10, marginBottom: 20 }}>
            <Placeholder Animation={Fade}>
              <PlaceholderLine width={100} height={40} style={{ marginBottom: 0 }} />
            </Placeholder>
          </View>
          <View>
            {[...Array(4).keys()].map(i => (
              <View style={{ marginBottom: 10 }} key={i}>
                <Placeholder Animation={Fade}>
                  <PlaceholderLine width={100} height={60} style={{ marginBottom: 0 }} />
                </Placeholder>
              </View>
            ))}
          </View>
        </>
      )}

      {!walletList?.loading && (walletList?.error || !walletList?.wallets?.length) && (
        <NotFoundSource
          content={walletList?.error
            ? t('ERROR_NOT_FOUND_WALLETS', 'Sorry, an error has occurred')
            : t('NOT_FOUND_WALLETS', 'No wallets to show at this time.')
          }
        />
      )}
    </Container>
  )
}

export const Wallets = (props: any) => {
  const [{ configs }] = useConfig()

  const isWalletCashEnabled = configs?.wallet_cash_enabled?.value === '1'
  const isWalletPointsEnabled = configs?.wallet_credit_point_enabled?.value === '1'

  const walletsProps = {
    ...props,
    UIComponent: WalletsUI,
    isWalletCashEnabled,
    isWalletPointsEnabled
  }
  return (
    <WalletList {...walletsProps} />
  )
}
