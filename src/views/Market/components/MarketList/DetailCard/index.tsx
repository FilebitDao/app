import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, generatePath } from 'react-router-dom'

import BigNumber from 'bignumber.js'

import Path from 'constants/path'

import type { Market, Token } from 'types'

import { formatCentsToReadableValue, formatToReadablePercentage } from 'utilities'

import styles from './index.module.scss'

interface MarketRow extends Market {
  readonly token: Token
  readonly depositTotalApyValue: BigNumber
  readonly borrowTotalApyValue: BigNumber
}

interface DetailCardProps {
  readonly market: MarketRow
}

const DetailCard: FC<DetailCardProps> = ({ market }: DetailCardProps) => {
  const { t } = useTranslation()

  return (
    <div className={styles.marketDetailCard}>
      <div className={styles.cardRow}>
        <span className={styles.cardLabel}>{t('market.depositMarket')}</span>
        <p className={styles.cardValue}>
          {formatCentsToReadableValue({
            value: market.treasuryTotalSupplyCents,
            shortenLargeValue: true
          })}
        </p>
      </div>
      <div className={styles.cardRow}>
        <span className={styles.cardLabel}>{t('market.depositTotalApy')}</span>
        <p className={styles.cardValue}>
          {formatToReadablePercentage(market.supplyApy.plus(market.supplyNarwhalApy))}
        </p>
      </div>
      <div className={styles.cardRow}>
        <span className={styles.cardLabel}>{t('market.borrowMarket')}</span>
        <p className={styles.cardValue}>
          {formatCentsToReadableValue({
            value: market.treasuryTotalBorrowsCents,
            shortenLargeValue: true
          })}
        </p>
      </div>
      <div className={styles.cardRow}>
        <span className={styles.cardLabel}>{t('market.borrowTotalApy')}</span>
        <p className={styles.cardValue}>
          {formatToReadablePercentage(market.borrowApy.plus(market.borrowNarwhalApy))}
        </p>
      </div>
      <div className={styles.cardRow}>
        <span className={styles.cardLabel}>{t('market.liquidity')}</span>
        <p className={styles.cardValue}>
          {formatCentsToReadableValue({
            value: market.liquidity.multipliedBy(100),
            shortenLargeValue: true
          })}
        </p>
      </div>
      <div className={styles.toDetail}>
        <Link
          className={styles.viewDetail}
          to={generatePath(Path.MARKET_DETAILS, {
            tokenId: market.id
          })}
        >
          {t('market.detail')}
        </Link>
      </div>
    </div>
  )
}

export default DetailCard
