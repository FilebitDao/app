import React, { FC, PropsWithChildren } from 'react'
import { ModalProvider, useModal, withModals } from 'react-modal-better-hooks'
import { QueryClientProvider } from 'react-query'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'

import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material'
import Layout from 'layout'

import { queryClient } from 'clients/api'
import { Web3Wrapper } from 'clients/web3'

import { ResetScrollOnRouteChange } from 'components/ResetScrollOnRouteChange'

import Path from 'constants/path'

import { AuthProvider } from 'context/AuthContext'
import { ThemeProvider } from 'context/Theme'
import { TransactionModalProvider } from 'context/Transaction'

import { BorrowRepayId } from 'modals/BorrowRepay'
import { ConnectWalletId } from 'modals/ConectWallet'
import { EnableAsCollateralId } from 'modals/EnableAsCollateral'
import { StakeAssetId } from 'modals/StakeAssets'
import { SupplyWithdrawId } from 'modals/SupplyWithdraw'
import { WithdrawAssetId } from 'modals/WithdrawAsset'
import { WithdrawRequestListId } from 'modals/WithdrawRequestList'

import DashBoard from 'views/Dashboard'
import Faucet from 'views/Faucet'
import Market from 'views/Market'
import MarketDetail from 'views/MarketDetail'
import Stake from 'views/Stake'

import 'assets/styles/App.scss'

const ModalRegister: FC = withModals(({ children }) => {
  const [ConnectWalletModal] = useModal(ConnectWalletId)
  const [EnableAsCollateralModal] = useModal(EnableAsCollateralId)
  const [BorrowRepayModal] = useModal(BorrowRepayId)
  const [StakeAssetModal] = useModal(StakeAssetId)
  const [SupplyWithdrawModal] = useModal(SupplyWithdrawId)
  const [WithdrawAssetModal] = useModal(WithdrawAssetId)
  const [WithdrawRequestListModal] = useModal(WithdrawRequestListId)

  return (
    <>
      {ConnectWalletModal}
      {EnableAsCollateralModal}
      {BorrowRepayModal}
      {StakeAssetModal}
      {SupplyWithdrawModal}
      {WithdrawAssetModal}
      {WithdrawRequestListModal}
      {children}
    </>
  )
})({
  [ConnectWalletId]: () => import('modals/ConectWallet'),
  [EnableAsCollateralId]: () => import('modals/EnableAsCollateral'),
  [BorrowRepayId]: () => import('modals/BorrowRepay'),
  [StakeAssetId]: () => import('modals/StakeAssets'),
  [SupplyWithdrawId]: () => import('modals/SupplyWithdraw'),
  [WithdrawAssetId]: () => import('modals/WithdrawAsset'),
  [WithdrawRequestListId]: () => import('modals/WithdrawRequestList')
})

const Providers: FC<PropsWithChildren<$TSFixMe>> = ({ children }) => (
  <Web3Wrapper>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MuiThemeProvider theme={createTheme()}>
          <ThemeProvider>
            <ModalProvider>
              <TransactionModalProvider>
                <BrowserRouter>{children}</BrowserRouter>
              </TransactionModalProvider>
            </ModalProvider>
          </ThemeProvider>
        </MuiThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </Web3Wrapper>
)

const App = () => (
  <>
    <Providers>
      <ModalRegister>
        <Layout>
          <ResetScrollOnRouteChange />
          <Switch>
            <Route exact path={Path.ROOT} component={DashBoard} />
            <Route exact path={Path.FAUCET} component={Faucet} />
            <Route exact path={Path.MARKETS} component={Market} />
            <Route exact path={Path.MARKET_DETAILS} component={MarketDetail} />
            <Route exact path={Path.STAKE} component={Stake} />
            <Redirect to={Path.ROOT} />
          </Switch>
        </Layout>
      </ModalRegister>
    </Providers>
  </>
)

export default App
