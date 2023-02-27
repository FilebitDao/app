import { useMemo } from 'react'
import { UseQueryResult } from 'react-query'

import {
  GetNwlVaultPendingRewardOutput,
  GetNwlVaultPoolInfoOutput,
  GetNwlVaultUserInfoOutput,
  useGetNwlVaultPoolCount,
  useGetNwlVaultRewardPerBlock,
  useGetNwlVaultTotalAllocationPoints
} from 'clients/api'

import { BLOCKS_PER_DAY } from 'constants/bsc'
import { DAYS_PER_YEAR } from 'constants/daysPerYear'
import { TOKENS } from 'constants/tokens'

import { Vault } from 'types'

import { getTokenByAddress, indexBy, stringify } from 'utilities'

import useGetNwlVaultPoolBalances from './useGetNwlVaultPoolBalances'
import useGetNwlVaultPools from './useGetNwlVaultPools'

export interface UseGetVestingVaultsOutput {
  isLoading: boolean
  data: Vault[]
}

const useGetVestingVaults = ({
  accountAddress
}: {
  accountAddress?: string
}): UseGetVestingVaultsOutput => {
  const {
    data: nwlVaultPoolCountData = { poolCount: 0 },
    isLoading: isGetNwlVaultPoolCountLoading
  } = useGetNwlVaultPoolCount()

  // Fetch data generic to all nwl pools
  const { data: nwlVaultRewardWeiPerBlock, isLoading: isGetNwlVaultRewardPerBlockLoading } =
    useGetNwlVaultRewardPerBlock({
      tokenAddress: TOKENS.nwl.address
    })

  const {
    data: nwlVaultTotalAllocationPointsData,
    isLoading: isGetNwlVaultTotalAllocationPointsLoading
  } = useGetNwlVaultTotalAllocationPoints({
    tokenAddress: TOKENS.nwl.address
  })

  // Fetch pools
  const poolQueryResults = useGetNwlVaultPools({
    accountAddress,
    poolsCount: nwlVaultPoolCountData.poolCount || 1
  })
  const arePoolQueriesLoading = poolQueryResults.some(queryResult => queryResult.isLoading)

  // Index results by pool ID
  const [poolData, stakedTokenAddresses] = useMemo(() => {
    const data: {
      [poolIndex: string]: {
        poolInfos: GetNwlVaultPoolInfoOutput
        userPendingReward?: GetNwlVaultPendingRewardOutput
        userInfos?: GetNwlVaultUserInfoOutput
      }
    } = {}

    const tokenAddresses: string[] = []

    const queriesPerPoolCount =
      nwlVaultPoolCountData.poolCount > 0
        ? poolQueryResults.length / nwlVaultPoolCountData.poolCount
        : 0

    for (let poolIndex = 0; poolIndex < nwlVaultPoolCountData.poolCount; poolIndex++) {
      const poolQueryResultStartIndex = poolIndex * queriesPerPoolCount

      const poolInfosQueryResult = poolQueryResults[
        poolQueryResultStartIndex
      ] as UseQueryResult<GetNwlVaultPoolInfoOutput>

      const userPendingRewardQueryResult = poolQueryResults[
        poolQueryResultStartIndex + 1
      ] as UseQueryResult<GetNwlVaultPendingRewardOutput>

      const userInfoQueryResult = poolQueryResults[
        poolQueryResultStartIndex + 2
      ] as UseQueryResult<GetNwlVaultUserInfoOutput>

      if (poolInfosQueryResult?.data) {
        tokenAddresses.push(poolInfosQueryResult.data.stakedTokenAddress)

        data[poolIndex] = {
          poolInfos: poolInfosQueryResult.data,
          userInfos: userInfoQueryResult.data,
          userPendingReward: userPendingRewardQueryResult.data
        }
      }
    }

    return [data, tokenAddresses]
  }, [stringify(poolQueryResults), nwlVaultPoolCountData.poolCount])

  // Fetch pool balances
  const poolBalanceQueryResults = useGetNwlVaultPoolBalances({
    stakedTokenAddresses
  })
  const arePoolBalanceQueriesLoading = poolBalanceQueryResults.some(
    queryResult => queryResult.isLoading
  )

  // Index results by pool ID
  const poolBalances = useMemo(
    () =>
      indexBy(
        (_item, index) => `${index}`,
        poolBalanceQueryResults.map(poolBalanceQueryResult => poolBalanceQueryResult.data)
      ),
    [stringify(poolBalanceQueryResults)]
  )

  const isLoading =
    isGetNwlVaultPoolCountLoading ||
    isGetNwlVaultRewardPerBlockLoading ||
    isGetNwlVaultTotalAllocationPointsLoading ||
    arePoolQueriesLoading ||
    arePoolBalanceQueriesLoading

  // Format query results into Vaults
  const data: Vault[] = useMemo(
    () =>
      Array.from({ length: nwlVaultPoolCountData.poolCount }).reduce<Vault[]>(
        (acc, _item, poolIndex) => {
          const totalStakedWeiData = poolBalances[poolIndex]
          const lockingPeriodMs = poolData[poolIndex]?.poolInfos.lockingPeriodMs
          const userStakedWei = poolData[poolIndex]?.userInfos?.stakedAmountWei
          const userPendingRewardWei = poolData[poolIndex]?.userPendingReward?.pendingNWLReward

          const stakedTokenId =
            poolData[poolIndex]?.poolInfos?.stakedTokenAddress &&
            getTokenByAddress(poolData[poolIndex]?.poolInfos.stakedTokenAddress)?.id

          const poolRewardWeiPerBlock =
            nwlVaultRewardWeiPerBlock?.rewardPerBlockWei &&
            nwlVaultTotalAllocationPointsData?.totalAllocationPoints &&
            poolData[poolIndex]?.poolInfos.allocationPoint &&
            nwlVaultRewardWeiPerBlock.rewardPerBlockWei
              .multipliedBy(poolData[poolIndex]?.poolInfos.allocationPoint)
              .div(nwlVaultTotalAllocationPointsData.totalAllocationPoints)

          const dailyEmissionWei =
            poolRewardWeiPerBlock && poolRewardWeiPerBlock.multipliedBy(BLOCKS_PER_DAY)

          const stakingAprPercentage =
            dailyEmissionWei &&
            totalStakedWeiData &&
            dailyEmissionWei
              .multipliedBy(DAYS_PER_YEAR)
              .div(totalStakedWeiData.balanceWei)
              .multipliedBy(100)
              .toNumber()

          if (
            stakedTokenId &&
            lockingPeriodMs &&
            dailyEmissionWei &&
            totalStakedWeiData &&
            stakingAprPercentage
          ) {
            const vault: Vault = {
              rewardTokenId: TOKENS.nwl.id,
              stakedTokenId,
              lockingPeriodMs,
              dailyEmissionWei,
              totalStakedWei: totalStakedWeiData.balanceWei,
              stakingAprPercentage,
              userStakedWei,
              userPendingRewardWei,
              poolIndex
            }

            return [...acc, vault]
          }

          return acc
        },
        []
      ),
    [
      nwlVaultPoolCountData.poolCount,
      stringify(poolData),
      stringify(poolBalances),
      nwlVaultRewardWeiPerBlock?.rewardPerBlockWei.toFixed(),
      nwlVaultTotalAllocationPointsData?.totalAllocationPoints
    ]
  )

  return {
    data,
    isLoading
  }
}

export default useGetVestingVaults
