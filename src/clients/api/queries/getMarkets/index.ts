import BigNumber from 'bignumber.js'

import { NFRC20_TOKENS } from 'constants/tokens'

import { Market } from 'types'

import { restService } from 'utilities'

export interface GetMarketsResponse {
  dailyNarwhal: number | string
  markets: Market[]
  request: { addresses: string[] }
  narwhalRate: string
}

export interface GetMarketsOutput {
  markets: Market[]
  dailyNarwhalWei?: BigNumber
}

const getMarkets = async (): Promise<GetMarketsOutput> => {
  const response = await restService<GetMarketsResponse>({
    endpoint: '/getMarket',
    method: 'GET'
  })
  if ('result' in response && response.result === 'error') {
    throw new Error(response.message)
  }
  let markets: Market[] = []
  let dailyNarwhalWei
  if (response && response.data && response.data.data) {
    dailyNarwhalWei = new BigNumber(response.data.data.dailyNarwhal)
    markets = Object.keys(NFRC20_TOKENS).reduce<Market[]>((acc: Market[], curr: string) => {
      const activeMarket = response.data?.data.markets.find(
        (market: Market) => market.underlyingSymbol.toLowerCase() === curr.toLowerCase()
      )
      if (activeMarket) {
        const formattedActiveMarket = {
          ...activeMarket,
          id: activeMarket.underlyingSymbol.toLowerCase(),
          tokenPrice: new BigNumber(activeMarket.tokenPrice),
          liquidity: new BigNumber(activeMarket.liquidity),
          borrowNarwhalApy: new BigNumber(activeMarket.borrowNarwhalApy),
          borrowApy: new BigNumber(activeMarket.borrowApy),
          supplyNarwhalApy: new BigNumber(activeMarket.supplyNarwhalApy),
          supplyApy: new BigNumber(activeMarket.supplyApy),
          treasuryTotalBorrowsCents: new BigNumber(activeMarket.totalBorrowsUsd).times(100),
          treasuryTotalSupplyCents: new BigNumber(activeMarket.totalSupplyUsd).times(100)
        }
        return [...acc, formattedActiveMarket]
      }
      return acc
    }, [])
  }
  return { markets, dailyNarwhalWei }
}

export default getMarkets
