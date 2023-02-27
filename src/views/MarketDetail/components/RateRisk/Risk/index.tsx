import React, { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { nanoid } from 'nanoid'

import PLACEHOLDER_KEY from 'constants/placeholderKey'
import { TOKENS } from 'constants/tokens'

import type { MarketDataOutput } from 'hooks/marketDetail/useGetMarketData'

import type { NToken, Token } from 'types'

import {
  formatCentsToReadableValue,
  formatToReadablePercentage,
  formatTokensToReadableValue
} from 'utilities'

import styles from './index.module.scss'

interface RiskProps
  extends Pick<
    MarketDataOutput,
    | 'liquidityCents'
    | 'borrowCapTokens'
    | 'dailySupplyingInterestsCents'
    | 'dailyBorrowingInterestsCents'
    | 'dailyDistributionNwl'
    | 'reserveTokens'
    | 'reserveFactor'
    | 'collateralFactor'
    | 'mintedTokens'
    | 'exchangeRateNTokens'
  > {
  readonly nToken: NToken
  readonly token: Token
  readonly nTokenId: string
}

const Risk: FC<RiskProps> = ({
  liquidityCents,
  borrowCapTokens,
  dailySupplyingInterestsCents,
  dailyBorrowingInterestsCents,
  dailyDistributionNwl,
  reserveTokens,
  reserveFactor,
  collateralFactor,
  mintedTokens,
  exchangeRateNTokens,
  token,
  nToken,
  nTokenId
}: RiskProps) => {
  const { t } = useTranslation()

  const riskValues = useMemo(
    () => [
      {
        label: t('marketDetail.marketInfo.stats.marketLiquidityLabel'),
        value: formatCentsToReadableValue({
          value: liquidityCents,
          shortenLargeValue: true
        })
      },
      {
        label: t('marketDetail.marketInfo.stats.borrowCapLabel'),
        value: borrowCapTokens?.isEqualTo(0)
          ? t('marketDetail.marketInfo.stats.unlimitedBorrowCap')
          : formatTokensToReadableValue({
              value: borrowCapTokens,
              minimizeDecimals: true,
              token: nToken
            })
      },
      {
        label: t('marketDetail.marketInfo.stats.dailySupplyingInterestsLabel'),
        value: formatCentsToReadableValue({
          value: dailySupplyingInterestsCents
        })
      },
      {
        label: t('marketDetail.marketInfo.stats.dailyBorrowingInterestsLabel'),
        value: formatCentsToReadableValue({
          value: dailyBorrowingInterestsCents
        })
      },
      {
        label: t('marketDetail.marketInfo.stats.dailyDistributionNwl'),
        value: formatTokensToReadableValue({
          value: dailyDistributionNwl,
          minimizeDecimals: true,
          addSymbol: false,
          token: TOKENS.nwl
        })
      },
      {
        label: t('marketDetail.marketInfo.stats.reserveTokensLabel'),
        value: formatTokensToReadableValue({
          value: reserveTokens,
          minimizeDecimals: true,
          token: nToken.underlyingToken
        })
      },
      {
        label: t('marketDetail.marketInfo.stats.reserveFactorLabel'),
        value: formatToReadablePercentage(reserveFactor)
      },
      {
        label: t('marketDetail.marketInfo.stats.collateralFactorLabel'),
        value: formatToReadablePercentage(collateralFactor)
      },
      {
        label: t('marketDetail.marketInfo.stats.mintedTokensLabel', {
          nTokenSymbol: nToken.symbol
        }),
        value: formatTokensToReadableValue({
          value: mintedTokens,
          minimizeDecimals: true,
          addSymbol: false,
          token: nToken,
          shortenLargeValue: true
        })
      },
      {
        label: t('marketDetail.marketInfo.stats.exchangeRateLabel'),
        value: exchangeRateNTokens
          ? t('marketDetail.marketInfo.stats.exchangeRateValue', {
              tokenSymbol: token.symbol,
              nTokenSymbol: nToken.symbol,
              rate: exchangeRateNTokens.dp(6).toFixed()
            })
          : PLACEHOLDER_KEY
      }
    ],
    [
      liquidityCents,
      borrowCapTokens,
      dailySupplyingInterestsCents,
      dailyBorrowingInterestsCents,
      dailyDistributionNwl,
      reserveTokens,
      nTokenId,
      reserveFactor,
      collateralFactor,
      mintedTokens,
      exchangeRateNTokens
    ]
  )

  return (
    <div className={styles.risk}>
      <div className={styles.risks}>
        {riskValues.map(({ label, value }) => (
          <div className={styles.riskRow} key={nanoid()}>
            <div className={styles.label}>
              <span className={styles.labelText}>{label}</span>
            </div>
            <p className={styles.value}>{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Risk
