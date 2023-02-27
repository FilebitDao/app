import React from 'react'

import { useGetMarketHistory } from 'clients/api'

import { formatPercentage, getBigNumber, stringify } from 'utilities'

export interface ApyChartItem {
  apyPercentage: number
  miningApyPercentage: number
  timestampMs: number
  balanceCents: number
}

const useGetChartData = ({ nTokenId }: { nTokenId: string }) => {
  const {
    data: marketSnapshotsData = {
      marketSnapshots: []
    }
  } = useGetMarketHistory(
    {
      nTokenId
    },
    {
      cacheTime: -1
    }
  )

  return React.useMemo(() => {
    const supplyChartData: ApyChartItem[] = []
    const borrowChartData: ApyChartItem[] = []

    ;[...marketSnapshotsData.marketSnapshots]
      // Snapshots are returned from earliest to oldest, so we reverse them to
      // pass them to the charts in the right order
      .reverse()
      .forEach(marketSnapshot => {
        const timestampMs = new Date(marketSnapshot.createdAt).getTime()

        supplyChartData.push({
          // apyPercentage: formatPercentage(getBigNumber(marketSnapshot.supplyApy).dp(2).multipliedBy(100).toNumber()),
          // miningApyPercentage: formatPercentage(getBigNumber(marketSnapshot.supplyNarwhalApy).dp(2).multipliedBy(100).toNumber()),
          apyPercentage: formatPercentage(getBigNumber(marketSnapshot.supplyApy).dp(2).toNumber()),
          miningApyPercentage: formatPercentage(
            getBigNumber(marketSnapshot.supplyNarwhalApy).dp(2).toNumber()
          ),
          timestampMs,
          balanceCents: getBigNumber(marketSnapshot.totalSupply)
            .multipliedBy(marketSnapshot.priceUSD)
            .dp(2)
            .toNumber()
        })

        borrowChartData.push({
          // apyPercentage: formatPercentage(getBigNumber(marketSnapshot.borrowApy).dp(2).multipliedBy(100).toNumber()),
          // miningApyPercentage: formatPercentage(getBigNumber(marketSnapshot.borrowNarwhalApy).dp(2).multipliedBy(100).toNumber()),
          apyPercentage: formatPercentage(getBigNumber(marketSnapshot.borrowApy).dp(2).toNumber()),
          miningApyPercentage: formatPercentage(
            getBigNumber(marketSnapshot.borrowNarwhalApy).dp(2).toNumber()
          ),
          timestampMs,
          balanceCents: getBigNumber(marketSnapshot.totalBorrow)
            .multipliedBy(marketSnapshot.priceUSD)
            .dp(2)
            .toNumber()
        })
      })

    return {
      supplyChartData,
      borrowChartData
    }
  }, [stringify(marketSnapshotsData?.marketSnapshots)])
}

export default useGetChartData
