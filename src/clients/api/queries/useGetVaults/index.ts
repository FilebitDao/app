import { useMemo } from 'react'

import { Vault } from 'types'

import { stringify } from 'utilities'

import useGetNaiVault from './useGetNaiVault'
import useGetVestingVaults from './useGetVestingVaults'

export interface UseGetVaultsOutput {
  isLoading: boolean
  data: Vault[]
}

const useGetVaults = ({ accountAddress }: { accountAddress?: string }): UseGetVaultsOutput => {
  const { data: vestingVaults, isLoading: isGetVestingVaultsLoading } = useGetVestingVaults({
    accountAddress
  })

  const { data: naiVault, isLoading: isNaiVaultLoading } = useGetNaiVault({
    accountAddress
  })

  const data: Vault[] = useMemo(() => {
    const allVaults = [...vestingVaults]

    if (naiVault) {
      allVaults.push(naiVault)
    }

    return allVaults
  }, [stringify(vestingVaults), stringify(naiVault)])

  const isLoading = isGetVestingVaultsLoading || isNaiVaultLoading

  return {
    data,
    isLoading
  }
}

export default useGetVaults
