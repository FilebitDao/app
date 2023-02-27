import { isMobile } from 'react-device-detect'
import { useModal } from 'react-modal-better-hooks'

import { Connector, useAuth } from 'clients/web3'

import { ConnectWalletId } from 'modals/ConectWallet'

const useConnectWallet = () => {
  const [, { open: openConnectModal }] = useModal(ConnectWalletId)
  const { login } = useAuth()

  return () => {
    if (isMobile) {
      login(Connector.MetaMask)
      return
    }

    openConnectModal()
  }
}

export default useConnectWallet
