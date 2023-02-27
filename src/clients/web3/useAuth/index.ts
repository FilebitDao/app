import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected
} from '@web3-react/injected-connector'
import {
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
  WalletConnectConnector
} from '@web3-react/walletconnect-connector'
import { useCallback, useState } from 'react'

import { NoBscProviderError } from '@binance-chain/bsc-connector'
import { openInfinityWallet } from '@infinitywallet/infinity-connector'

import { toast } from 'components/Toast'

import config from 'config'

import { LS_KEY_CONNECTED_CONNECTOR } from 'constants/localStorageKeys'

import { NError, formatNErrorToReadableString } from 'errors'

import { Connector } from '../types'

import { noop } from 'utilities'

import { connectorsByName } from '../connectors'
import setupNetwork from './setUpNetwork'

const isRunningInInfinityWalletApp = () => window.ethereum && window.ethereum?.isInfinityWallet

const getConnectedConnector = (): Connector | undefined => {
  const lsConnectedConnector = window.localStorage.getItem(LS_KEY_CONNECTED_CONNECTOR)

  return lsConnectedConnector &&
    Object.values(Connector).includes(lsConnectedConnector as Connector)
    ? (lsConnectedConnector as Connector)
    : undefined
}

const useAuth = () => {
  const { activate, deactivate, account } = useWeb3React()
  const [panddingConnector, setPanddingConnector] = useState<Connector | null>(null)

  const [connectedConnector, setConnectedConnector] = useState(getConnectedConnector())

  const login = useCallback(
    async (connectorID: Connector, onLogin) => {
      // If user are attempting to connect their Infinity wallet but the dApp
      // isn't currently running in the Infinity Wallet app, open it
      if (connectorID === Connector.InfinityWallet && !isRunningInInfinityWalletApp()) {
        openInfinityWallet(window.location.href, config.chainId)
        return
      }

      const connector = connectorsByName[connectorID]
      if (!connector) {
        // TODO: log error (this case should never happen, as it means
        // an incorrect connectorID was passed to this function)

        throw new NError({ type: 'interaction', code: 'unsupportedWallet' })
      }

      try {
        // Log user in
        await activate(connector, undefined, true)

        // Mark user as logged in
        window.localStorage.setItem(LS_KEY_CONNECTED_CONNECTOR, connectorID)
        setConnectedConnector(connectorID)
        onLogin()
      } catch (error) {
        if (error instanceof UnsupportedChainIdError) {
          const hasSetup = await setupNetwork()
          if (hasSetup) {
            await activate(connector)
            onLogin()
          }

          return
        }

        // Reset wallet connect provider if user denied access to their account
        if (
          (error instanceof UserRejectedRequestErrorInjected ||
            error instanceof UserRejectedRequestErrorWalletConnect) &&
          connector instanceof WalletConnectConnector
        ) {
          connector.walletConnectProvider = undefined
        }

        // Display error message
        let errorMessage

        if (
          error instanceof UserRejectedRequestErrorInjected ||
          error instanceof UserRejectedRequestErrorWalletConnect
        ) {
          throw new NError({ type: 'interaction', code: 'authorizeAccess' })
        } else if (
          error instanceof NoEthereumProviderError ||
          error instanceof NoBscProviderError
        ) {
          // TODO: log error
          throw new NError({ type: 'interaction', code: 'noProvider' })
        } else {
          errorMessage = (error as Error).message
        }

        toast.error({ message: errorMessage })
      }
    },
    [activate]
  )

  const loginShowToast = async (connectorID: Connector, onLogin = noop) => {
    try {
      setPanddingConnector(connectorID)
      await login(connectorID, onLogin)
      setPanddingConnector(null)
    } catch (error) {
      setPanddingConnector(null)
      let { message } = error as Error

      if (error instanceof NError) {
        message = formatNErrorToReadableString(error)
      }

      toast.error({
        message
      })
    }
  }

  const logOut = useCallback(() => {
    deactivate()
    // This localStorage key is set by @web3-react/walletconnect-connector
    if (window.localStorage.getItem('walletconnect')) {
      connectorsByName[Connector.WalletConnect].close()
      connectorsByName[Connector.WalletConnect].walletConnectProvider = undefined
    }

    // Remove flag indicating user is logged in
    window.localStorage.removeItem(LS_KEY_CONNECTED_CONNECTOR)
    setConnectedConnector(undefined)
  }, [deactivate])

  return {
    login: loginShowToast,
    logOut,
    panddingConnector,
    accountAddress: account || '',
    connectedConnector,
    connected: !!account
  }
}

export default useAuth
