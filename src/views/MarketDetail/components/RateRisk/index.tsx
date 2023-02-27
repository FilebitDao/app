import React, { FC } from 'react'

import type { MarketDataOutput } from 'hooks/marketDetail/useGetMarketData'

import type { NToken, Token } from 'types'

import Rate from './Rate'
import Risk from './Risk'
import styles from './index.module.scss'

interface RateRiskProps {
  readonly market: MarketDataOutput
  readonly nToken: NToken
  readonly token: Token
  readonly nTokenId: string
}

const RateRisk: FC<RateRiskProps> = ({ market, nToken, token, nTokenId }: RateRiskProps) => {
  const {
    totalBorrowBalanceCents,
    totalSupplyBalanceCents,
    liquidityCents,
    borrowCapTokens,
    mintedTokens,
    dailyDistributionNwl,
    dailySupplyingInterestsCents,
    dailyBorrowingInterestsCents,
    reserveFactor,
    collateralFactor,
    reserveTokens,
    exchangeRateNTokens,
    reserveFactorMantissa,
    currentUtilizationRate
  } = market

  return (
    <div className={styles.rateRisk}>
      <Rate
        totalBorrowBalanceCents={totalBorrowBalanceCents}
        totalSupplyBalanceCents={totalSupplyBalanceCents}
        reserveFactorMantissa={reserveFactorMantissa}
        currentUtilizationRate={currentUtilizationRate}
        nTokenId={nTokenId}
      />
      <Risk
        token={token}
        nToken={nToken}
        nTokenId={nTokenId}
        liquidityCents={liquidityCents}
        borrowCapTokens={borrowCapTokens}
        dailySupplyingInterestsCents={dailySupplyingInterestsCents}
        dailyBorrowingInterestsCents={dailyBorrowingInterestsCents}
        dailyDistributionNwl={dailyDistributionNwl}
        reserveTokens={reserveTokens}
        reserveFactor={reserveFactor}
        collateralFactor={collateralFactor}
        mintedTokens={mintedTokens}
        exchangeRateNTokens={exchangeRateNTokens}
      />
    </div>
  )
}

export default RateRisk
