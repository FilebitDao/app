import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'

import { BscConnector } from '@binance-chain/bsc-connector'
import { InfinityWalletConnector } from '@infinitywallet/infinity-connector'

import config from 'config'

import { Connector } from './types'
import { FilChainId } from 'types'

export const injectedConnector = new InjectedConnector({ supportedChainIds: [config.chainId] })

const walletConnectConnector = new WalletConnectConnector({
  rpc: { [FilChainId.MAINNET]: config.rpcUrl },
  chainId: FilChainId.MAINNET,
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true
})

const binanceChainWalletConnector = new BscConnector({ supportedChainIds: [config.chainId] })

const coinbaseWalletConnector = new WalletLinkConnector({
  url: config.rpcUrl,
  appName: 'Narwhal'
})

const infinityWalletConnector = new InfinityWalletConnector({
  supportedChainIds: [FilChainId.MAINNET]
})

export const connectorsByName = {
  [Connector.MetaMask]: injectedConnector,
  [Connector.BraveWallet]: injectedConnector,
  [Connector.WalletConnect]: walletConnectConnector,
  [Connector.CoinbaseWallet]: coinbaseWalletConnector,
  [Connector.TrustWallet]: injectedConnector,
  [Connector.BinanceChainWallet]: binanceChainWalletConnector,
  [Connector.InfinityWallet]: infinityWalletConnector,
  [Connector.OperaWallet]: injectedConnector,
  [Connector.BitKeep]: injectedConnector
}
