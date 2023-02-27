import { useMemo } from 'react'

import { BigNumber } from 'bignumber.js'

import { useGetDailyNwl, useGetMarkets } from 'clients/api'
import { useAuth } from 'clients/web3'

import { TOKENS } from 'constants/tokens'

import { convertWeiToTokens, getBigNumber, stringify } from 'utilities'

const useDailyNwlDistributionInterests = () => {
  const { accountAddress } = useAuth()
  const { data: getDailyNwlData, isLoading: isGetDailyNwlLoading } = useGetDailyNwl(
    { accountAddress },
    { enabled: Boolean(accountAddress) }
  )

  const { data: getMarketsData, isLoading: isGetMarketsLoading } = useGetMarkets()

  //  FIXME: get NWL Price from contract or api
  const nwlPriceDollars: BigNumber = getBigNumber(1)

  const { dailyNwlDistributionInterestsCents } = useMemo(() => {
    const dailyNwlTokens =
      getDailyNwlData &&
      convertWeiToTokens({
        valueWei: getDailyNwlData.dailyNwlWei,
        token: TOKENS.nwl
      })

    return {
      dailyNwlDistributionInterestsCents:
        accountAddress && nwlPriceDollars
          ? dailyNwlTokens?.multipliedBy(nwlPriceDollars).times(100)
          : new BigNumber(0)
    }
  }, [stringify(getDailyNwlData?.dailyNwlWei), stringify(getMarketsData?.markets), accountAddress])

  return {
    isLoading: isGetDailyNwlLoading || isGetMarketsLoading,
    dailyNwlDistributionInterestsCents
  }
}

export default useDailyNwlDistributionInterests
