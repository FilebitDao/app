import { useMemo } from 'react'

import BigNumber from 'bignumber.js'

import { useGetUserMarketInfo } from 'clients/api'
import { useAuth } from 'clients/web3'

import { TOKENS } from 'constants/tokens'

import type { Asset } from 'types'

import stringify from 'utilities/stringify'

interface MarketsAssets {
  suppliedAssets: Asset[]
  supplyMarketAssets: Asset[]
  borrowingAssets: Asset[]
  borrowMarketAssets: Asset[]
  userTotalBorrowLimitCents?: BigNumber
  userTotalBorrowBalanceCents?: BigNumber
  userTotalSupplyBalanceCents?: BigNumber
  totalNwlDistributedWei?: BigNumber
  dailyNarwhalWei?: BigNumber
}

const useUserAssets = () => {
  const { accountAddress } = useAuth()
  const {
    data: { assets, ...rest }
  } = useGetUserMarketInfo({ accountAddress })

  return useMemo<MarketsAssets>(
    () =>
      assets.reduce(
        (acc, curr) => {
          if (curr.supplyBalance.isGreaterThan(0)) {
            acc.suppliedAssets.push(curr)
          } else {
            acc.supplyMarketAssets.push(curr)
          }

          if (curr.borrowBalance.isGreaterThan(0)) {
            acc.borrowingAssets.push(curr)
          } else if (curr.token.address !== TOKENS.nwl.address) {
            acc.borrowMarketAssets.push(curr)
          }

          return {
            ...acc,
            ...rest
          }
        },
        {
          suppliedAssets: [],
          supplyMarketAssets: [],
          borrowingAssets: [],
          borrowMarketAssets: []
        } as MarketsAssets
      ),
    [stringify(assets)]
  )
}

export default useUserAssets
