import { UseQueryOptions, UseQueryResult, useQueries } from 'react-query'

import {
  GetNwlVaultPendingRewardOutput,
  GetNwlVaultPoolInfoOutput,
  GetNwlVaultUserInfoOutput,
  getNwlVaultPendingReward,
  getNwlVaultPoolInfo,
  getNwlVaultUserInfo
} from 'clients/api'
import { useNwlVaultProxyContract } from 'clients/contracts/hooks'

import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval'
import FunctionKey from 'constants/functionKey'
import { TOKENS } from 'constants/tokens'

export interface UseGetXvsVaultPoolsInput {
  poolsCount: number
  accountAddress?: string
}

export type UseGetXvsVaultPoolsOutput = UseQueryResult<
  GetNwlVaultPoolInfoOutput | GetNwlVaultPendingRewardOutput | GetNwlVaultUserInfoOutput
>[]

const useGetXvsVaultPools = ({
  accountAddress,
  poolsCount
}: UseGetXvsVaultPoolsInput): UseGetXvsVaultPoolsOutput => {
  const nwlVaultContract = useNwlVaultProxyContract()

  const poolQueries: UseQueryOptions<
    GetNwlVaultPoolInfoOutput | GetNwlVaultPendingRewardOutput | GetNwlVaultUserInfoOutput
  >[] = []

  // Fetch pool infos
  for (let poolIndex = 0; poolIndex < poolsCount; poolIndex++) {
    poolQueries.push({
      queryFn: () =>
        getNwlVaultPoolInfo({
          nwlVaultContract,
          rewardTokenAddress: TOKENS.nwl.address,
          poolIndex
        }),
      queryKey: [
        FunctionKey.GET_NWL_VAULT_POOL_INFOS,
        { rewardTokenAddress: TOKENS.nwl.address, poolIndex }
      ]
    })

    poolQueries.push({
      queryFn: () =>
        getNwlVaultPendingReward({
          nwlVaultContract,
          rewardTokenAddress: TOKENS.nwl.address,
          poolIndex,
          accountAddress: accountAddress || ''
        }),
      queryKey: [
        FunctionKey.GET_NWL_VAULT_PENDING_REWARD,
        { accountAddress, rewardTokenAddress: TOKENS.nwl.address, poolIndex }
      ],
      enabled: !!accountAddress,
      refetchInterval: DEFAULT_REFETCH_INTERVAL_MS
    })

    poolQueries.push({
      queryFn: () =>
        getNwlVaultUserInfo({
          nwlVaultContract,
          rewardTokenAddress: TOKENS.nwl.address,
          poolIndex,
          accountAddress: accountAddress || ''
        }),
      queryKey: [
        FunctionKey.GET_NWL_VAULT_USER_INFO,
        { accountAddress, rewardTokenAddress: TOKENS.nwl.address, poolIndex }
      ],
      enabled: !!accountAddress
    })
  }

  return useQueries(poolQueries)
}

export default useGetXvsVaultPools
