import { Connector } from 'clients/web3'

import { ReactComponent as BinanceWalletLogo } from 'assets/img/wallets/binancewallet.svg'
import { ReactComponent as CoinBaseWalletLogo } from 'assets/img/wallets/coinbasewallet.svg'
import { ReactComponent as InfinityWalletLogo } from 'assets/img/wallets/infinitywallet.svg'
import { ReactComponent as MetaMaskLogo } from 'assets/img/wallets/metamask.svg'
import { ReactComponent as TrustWalletLogo } from 'assets/img/wallets/truestwallet.svg'
import { ReactComponent as WalletConnectLogo } from 'assets/img/wallets/walletconnect.svg'

const WALLETS = [
  {
    logo: MetaMaskLogo,
    connector: Connector.MetaMask,
    nameLocaleKey: 'connect.metaMask.name',
    descLocaleKey: 'connect.metaMask.desc'
  },
  {
    logo: WalletConnectLogo,
    connector: Connector.WalletConnect,
    nameLocaleKey: 'connect.walletConnect.name',
    descLocaleKey: 'connect.walletConnect.desc'
  },
  {
    logo: TrustWalletLogo,
    connector: Connector.TrustWallet,
    nameLocaleKey: 'connect.trustWallet.name',
    descLocaleKey: 'connect.trustWallet.desc'
  },
  {
    logo: CoinBaseWalletLogo,
    connector: Connector.CoinbaseWallet,
    nameLocaleKey: 'connect.coinbase.name',
    descLocaleKey: 'connect.coinbase.desc'
  },
  {
    logo: BinanceWalletLogo,
    connector: Connector.BinanceChainWallet,
    nameLocaleKey: 'connect.bscwallet.name',
    descLocaleKey: 'connect.bscwallet.desc'
  },
  {
    logo: InfinityWalletLogo,
    connector: Connector.InfinityWallet,
    nameLocaleKey: 'connect.infinitywallet.name',
    descLocaleKey: 'connect.infinitywallet.desc'
  }
]

export default WALLETS
