import React, { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Redirect, useParams } from 'react-router-dom'

import Details from './components/Details'
import RateRisk from './components/RateRisk'
import Statistics from './components/Statistics'
import Spiner from 'components/Spiner'

import Path from 'constants/path'

import useGetMarketData from 'hooks/marketDetail/useGetMarketData'

import type { NToken, Token } from 'types'

import { unsafelyGetNToken, unsafelyGetToken } from 'utilities'

const MarketDetail: FC = () => {
  const { t } = useTranslation()
  const { tokenId: nTokenId } = useParams<{ tokenId: string }>()
  const token = useMemo<Token>(() => unsafelyGetToken(nTokenId), [nTokenId])
  const nToken = useMemo<NToken>(() => unsafelyGetNToken(nTokenId), [nTokenId])

  const { isLoading, ...marketData } = useGetMarketData({
    nTokenId
  })

  if (!nToken) {
    return <Redirect to={Path.MARKETS} />
  }

  if (isLoading) {
    return <Spiner size={40} text={t('marketDetail.loading')} asBlock />
  }

  return (
    <>
      <Statistics token={token} tokenPriceDollars={marketData.tokenPriceDollars} />
      <Details
        nTokenId={nTokenId}
        totalDeposit={marketData.treasuryTotalSupplyCents}
        totalBorrow={marketData.treasuryTotalBorrowsCents}
        supplyApy={marketData.supplyApyPercentage}
        supplyMiningApy={marketData.supplyDistributionApyPercentage}
        borrowApy={marketData.borrowApyPercentage}
        borrowMiningApy={marketData.borrowDistributionApyPercentage}
      />
      <RateRisk nTokenId={nTokenId} token={token} nToken={nToken} market={marketData} />
    </>
  )
}

export default MarketDetail
