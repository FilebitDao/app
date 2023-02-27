import { useCallback } from 'react'

import { useAuth } from 'clients/web3'

import useConnectWallet from './useConnectWallet'

const useProtectedCallback = (callback: $TsFixMeFunction) => {
  const { connected } = useAuth()
  const connectWallet = useConnectWallet()

  return useCallback(
    (...args) => {
      if (!connected) {
        connectWallet()
        return
      }

      callback(...args)
    },
    [callback, connected]
  )
}

export default useProtectedCallback
