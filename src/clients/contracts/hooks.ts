import { useMemo } from 'react'

import { useWeb3 } from 'clients/web3'

import { Token } from 'types'

import {
  getComptrollerContract,
  getFaucetContract,
  getGovernorBravoDelegateContract,
  getInterestModelContract,
  getNTokenContract,
  getNaiUnitrollerContract,
  getNaiVaultContract,
  getNarwhalLensContract,
  getNwlVaultContract,
  getNwlVaultProxyContract,
  getNwlVestingProxyContract,
  getPriceOracleContract,
  getTokenContract,
  getTokenContractByAddress
} from './getters'

export const useTokenContract = (token: Token) => {
  const web3 = useWeb3()
  return useMemo(() => getTokenContract(token, web3), [web3, token])
}

export const useTokenContractByAddress = (address: string) => {
  const web3 = useWeb3()
  return useMemo(() => getTokenContractByAddress(address, web3), [web3, address])
}

export const useNTokenContract = <T extends string>(name: T) => {
  const web3 = useWeb3()
  return useMemo(() => getNTokenContract<T>(name, web3), [web3, name])
}

export const useNaiUnitrollerContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getNaiUnitrollerContract(web3), [web3])
}

export const useNaiVaultContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getNaiVaultContract(web3), [web3])
}

export const useComptrollerContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getComptrollerContract(web3), [web3])
}

export const usePriceOracleContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getPriceOracleContract(web3), [web3])
}

export const useInterestModelContract = (address: string) => {
  const web3 = useWeb3()
  return useMemo(() => getInterestModelContract(address, web3), [web3])
}

export const useNarwhalLensContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getNarwhalLensContract(web3), [web3])
}

export const useNwlVaultContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getNwlVaultContract(web3), [web3])
}

export const useNwlVaultProxyContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getNwlVaultProxyContract(web3), [web3])
}

export const useGovernorBravoDelegateContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getGovernorBravoDelegateContract(web3), [web3])
}

export const useNwlVestingProxyContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getNwlVestingProxyContract(web3), [web3])
}

export const useFaucetContractContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getFaucetContract(web3), [web3])
}
