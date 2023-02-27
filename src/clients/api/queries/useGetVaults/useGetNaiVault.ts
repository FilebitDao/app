import { useMemo } from 'react'

import {
  useGetBalanceOf,
  useGetNaiVaultPendingNwl,
  useGetNaiVaultUserInfo,
  useGetNarwhalNaiVaultDailyRate,
  useGetNwlPrice
} from 'clients/api'

import { DAYS_PER_YEAR } from 'constants/daysPerYear'
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval'
import { TOKENS } from 'constants/tokens'

import { Vault } from 'types'

import { convertWeiToTokens, getContractAddress, stringify } from 'utilities'

const NAI_VAULT_ADDRESS = getContractAddress('naiVault')

export interface UseGetNaiVaultOutput {
  isLoading: boolean
  data: Vault | undefined
}

const useGetNaiVault = ({ accountAddress }: { accountAddress?: string }): UseGetNaiVaultOutput => {
  const { data: totalNaiStakedData, isLoading: isGetTotalNaiStakedWeiLoading } = useGetBalanceOf(
    {
      accountAddress: NAI_VAULT_ADDRESS,
      token: TOKENS.nai
    },
    {
      refetchInterval: DEFAULT_REFETCH_INTERVAL_MS
    }
  )

  const { data: naiVaultUserInfo, isLoading: isGetVaiVaultUserInfoLoading } =
    useGetNaiVaultUserInfo(
      {
        accountAddress: accountAddress || ''
      },
      {
        enabled: !!accountAddress
      }
    )

  const { data: userPendingNaiRewardData, isLoading: isGetUserPendingNaiRewardWeiLoading } =
    useGetNaiVaultPendingNwl(
      {
        accountAddress: accountAddress || ''
      },
      {
        enabled: !!accountAddress
      }
    )

  const { data: naiVaultDailyRateData, isLoading: isGetVaiVaultDailyRateWeiLoading } =
    useGetNarwhalNaiVaultDailyRate()

  const { data: nwlPriceDollars, isLoading: isGetNwlPriceLoading } = useGetNwlPrice()

  const data: Vault | undefined = useMemo(() => {
    if (!totalNaiStakedData || !naiVaultDailyRateData || !nwlPriceDollars) {
      return undefined
    }

    const stakingAprPercentage = convertWeiToTokens({
      valueWei: naiVaultDailyRateData.dailyRateWei,
      token: TOKENS.nwl
    })
      .multipliedBy(nwlPriceDollars)
      .multipliedBy(DAYS_PER_YEAR)
      .dividedBy(
        convertWeiToTokens({
          valueWei: totalNaiStakedData.balanceWei,
          token: TOKENS.nai
        })
      )
      .multipliedBy(100)
      .toNumber()

    return {
      rewardTokenId: TOKENS.nwl.id,
      stakedTokenId: TOKENS.nai.id,
      dailyEmissionWei: naiVaultDailyRateData.dailyRateWei,
      totalStakedWei: totalNaiStakedData.balanceWei,
      stakingAprPercentage,
      userStakedWei: naiVaultUserInfo?.stakedNaiWei,
      userPendingRewardWei: userPendingNaiRewardData?.pendingNWLWei
    }
  }, [
    totalNaiStakedData?.balanceWei.toFixed(),
    naiVaultDailyRateData?.dailyRateWei.toFixed(),
    nwlPriceDollars?.toFixed(),
    stringify(naiVaultUserInfo),
    userPendingNaiRewardData?.pendingNWLWei.toFixed()
  ])

  const isLoading =
    isGetTotalNaiStakedWeiLoading ||
    isGetVaiVaultDailyRateWeiLoading ||
    isGetNwlPriceLoading ||
    isGetVaiVaultUserInfoLoading ||
    isGetUserPendingNaiRewardWeiLoading

  return {
    data,
    isLoading
  }
}

export default useGetNaiVault
