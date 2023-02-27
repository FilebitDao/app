import { useMemo } from 'react'

import BigNumber from 'bignumber.js'

import { IGetNTokenBalancesAllOutput, useGetMarkets, useGetNTokenBalancesAll } from 'clients/api'

import config from 'config'

import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval'
import { NFRC20_TOKENS } from 'constants/tokens'

import { Market } from 'types'

import { indexBy, stringify } from 'utilities'

const TREASURY_ADDRESSES = {
  56: '0xF322942f644A996A617BD29c16bd7d231d9F35E9',
  97: '0x0000000000000000000000000000000000000000'
}

export const treasuryAddress = TREASURY_ADDRESSES[config.chainId]

export interface Data {
  treasuryTotalSupplyBalanceCents: BigNumber
  treasuryTotalBorrowBalanceCents: BigNumber
  treasuryTotalBalanceCents: BigNumber
  treasuryTotalAvailableLiquidityBalanceCents: BigNumber
}

export interface UseGetTreasuryTotalsOutput {
  isLoading: boolean
  data: Data
}

const nTokenAddresses = Object.values(NFRC20_TOKENS).reduce(
  (acc, item) => (item.address ? [...acc, item.address] : acc),
  [] as string[]
)

const useGetTreasuryTotals = (): UseGetTreasuryTotalsOutput => {
  const {
    data: getMarketsData = {
      markets: [] as Market[]
    },
    isLoading: isGetMarketsLoading
  } = useGetMarkets({
    placeholderData: {
      markets: [],
      dailyNarwhalWei: new BigNumber(0)
    }
  })

  const {
    data: nTokenBalancesTreasury = { balances: [] },
    isLoading: isGetVTokenBalancesTreasuryLoading
  } = useGetNTokenBalancesAll(
    {
      account: treasuryAddress,
      nTokenAddresses
    },
    {
      placeholderData: { balances: [] },
      refetchInterval: DEFAULT_REFETCH_INTERVAL_MS
    }
  )

  const treasuryBalances = useMemo(
    () =>
      indexBy(
        (item: IGetNTokenBalancesAllOutput['balances'][number]) => item.nToken.toLowerCase(), // index by nToken address
        nTokenBalancesTreasury.balances
      ),
    [stringify(nTokenBalancesTreasury)]
  )

  const { markets } = getMarketsData
  const {
    treasuryTotalSupplyBalanceCents,
    treasuryTotalBorrowBalanceCents,
    treasuryTotalBalanceCents,
    treasuryTotalAvailableLiquidityBalanceCents
  } = useMemo(() => {
    const data = markets.reduce(
      (acc, curr) => {
        let treasuryBalanceTokens = new BigNumber(0)
        if (treasuryBalances && treasuryBalances[curr.address]) {
          const mantissa = treasuryBalances[curr.address].tokenBalance
          treasuryBalanceTokens = new BigNumber(mantissa).shiftedBy(-curr.underlyingDecimal)
        }

        acc.treasuryTotalBalanceCents = acc.treasuryTotalBalanceCents.plus(
          treasuryBalanceTokens.multipliedBy(curr.tokenPrice).times(100)
        )

        acc.treasuryTotalSupplyBalanceCents = acc.treasuryTotalSupplyBalanceCents.plus(
          curr.treasuryTotalSupplyCents
        )

        acc.treasuryTotalBorrowBalanceCents = acc.treasuryTotalBorrowBalanceCents.plus(
          curr.treasuryTotalBorrowsCents
        )

        acc.treasuryTotalAvailableLiquidityBalanceCents =
          acc.treasuryTotalAvailableLiquidityBalanceCents.plus(curr.liquidity.times(100))

        return acc
      },
      {
        treasuryTotalSupplyBalanceCents: new BigNumber(0),
        treasuryTotalBorrowBalanceCents: new BigNumber(0),
        treasuryTotalBalanceCents: new BigNumber(0),
        treasuryTotalAvailableLiquidityBalanceCents: new BigNumber(0)
      }
    )
    return data
  }, [treasuryBalances, markets])

  return {
    data: {
      treasuryTotalSupplyBalanceCents,
      treasuryTotalBorrowBalanceCents,
      treasuryTotalBalanceCents,
      treasuryTotalAvailableLiquidityBalanceCents
    },
    isLoading: isGetVTokenBalancesTreasuryLoading || isGetMarketsLoading
  }
}

export default useGetTreasuryTotals
