import React, { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import BigNumber from 'bignumber.js'

import useUserAssets from 'hooks/useUserAssets'

import type { Token } from 'types'

import {
  calculatePercentage,
  formatCentsToReadableValue,
  formatToReadablePercentage
} from 'utilities'

import styles from './index.module.scss'

interface StatisticsProps {
  readonly token: Token
  readonly tokenPriceDollars?: BigNumber
}

const Statistics: FC<StatisticsProps> = ({ token, tokenPriceDollars }: StatisticsProps) => {
  const { t } = useTranslation()
  const { borrowingAssets, userTotalBorrowBalanceCents, userTotalBorrowLimitCents } =
    useUserAssets()
  const currentBorrowInfo = useMemo(() => {
    const asset = borrowingAssets.find(assetItem => assetItem.token.address === token.address)
    const percent = formatToReadablePercentage(
      calculatePercentage({
        numerator: userTotalBorrowBalanceCents?.toNumber() || 0,
        denominator: userTotalBorrowLimitCents?.toNumber() || 0
      })
    )

    if (asset) {
      return {
        borrowing: formatCentsToReadableValue({
          value: asset.borrowBalance.multipliedBy(asset.tokenPrice).multipliedBy(100)
        }),
        used: percent
      }
    }

    return {
      borrowing: '$0',
      used: percent
    }
  }, [token, borrowingAssets, userTotalBorrowBalanceCents, userTotalBorrowLimitCents])

  return (
    <div className={styles.statistics}>
      <div className={styles.symbolInfo}>
        <img className={styles.tokenIcon} src={token.asset} />
        <div className={styles.symbolName}>
          <h1 className={styles.name}>{token.symbol}</h1>
          <p className={styles.fullName}>{token.name}</p>
        </div>
      </div>
      <div className={styles.statisticsInfo}>
        <label className={styles.label}>{t('marketDetail.price')}</label>
        <p className={styles.value}>
          {formatCentsToReadableValue({
            value: tokenPriceDollars?.times(100),
            shortenLargeValue: false
          })}
        </p>
      </div>
      <div className={styles.statisticsInfo}>
        <label className={styles.label}>{t('marketDetail.priceFeed')}</label>
        <a className={styles.link}>{t('marketDetail.chainlink')}</a>
      </div>
      <div className={styles.statisticsInfo}>
        <label className={styles.label}>{t('marketDetail.borrowing')}</label>
        <p className={styles.value}>{currentBorrowInfo.borrowing}</p>
      </div>
      <div className={styles.statisticsInfo}>
        <label className={styles.label}>{t('marketDetail.usedRatio')}</label>
        <p className={styles.value}>{currentBorrowInfo.used}</p>
      </div>
      <div className={styles.statisticsPart}>
        <div className={styles.statisticsInfo}>
          <label className={styles.label}>{t('marketDetail.price')}</label>
          <p className={styles.value}>
            {formatCentsToReadableValue({
              value: tokenPriceDollars?.times(100),
              shortenLargeValue: false
            })}
          </p>
        </div>
        <div className={styles.statisticsInfo}>
          <label className={styles.label}>{t('marketDetail.priceFeed')}</label>
          <a className={styles.link}>{t('marketDetail.chainlink')}</a>
        </div>
        <div className={styles.statisticsInfo}>
          <label className={styles.label}>{t('marketDetail.borrowing')}</label>
          <p className={styles.value}>{currentBorrowInfo.borrowing}</p>
        </div>
        <div className={styles.statisticsInfo}>
          <label className={styles.label}>{t('marketDetail.usedRatio')}</label>
          <p className={styles.value}>{currentBorrowInfo.used}</p>
        </div>
      </div>
    </div>
  )
}

export default Statistics
