import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { SAFE_BORROW_LIMIT_PERCENTAGE } from 'constants/safeBorrowLimitPercentage'

import {
  calculatePercentage,
  formatCentsToReadableValue,
  formatToReadablePercentage
} from 'utilities'

import { ReactComponent as BorrowTotal } from 'assets/img/narwhal/borrow.svg'
import { ReactComponent as DailyEarning } from 'assets/img/narwhal/daily-earning.svg'
import { ReactComponent as DepositTotal } from 'assets/img/narwhal/deposit.svg'
import { ReactComponent as UsedRatio } from 'assets/img/narwhal/used-ratio.svg'

import Price from './Price'
import styles from './index.module.scss'

export interface AssetsInfoProps {
  readonly netApyPercentage?: number
  readonly dailyEarningsCents?: number
  readonly supplyBalanceCents?: number
  readonly borrowBalanceCents?: number
  readonly borrowLimitCents?: number
  readonly hypotheticalBorrowBalanceCents?: number
}

const AssetsInfo: FC<AssetsInfoProps> = ({
  netApyPercentage,
  dailyEarningsCents,
  supplyBalanceCents,
  borrowBalanceCents,
  borrowLimitCents
}: AssetsInfoProps) => {
  const { t } = useTranslation()

  const borrowLimitUsedPercentage =
    typeof borrowBalanceCents === 'number' && typeof borrowLimitCents === 'number'
      ? calculatePercentage({
          numerator: borrowBalanceCents,
          denominator: borrowLimitCents
        })
      : undefined

  const safeBorrowLimitCents =
    typeof borrowLimitCents === 'number'
      ? Math.floor((borrowLimitCents * SAFE_BORROW_LIMIT_PERCENTAGE) / 100)
      : undefined

  const readableSafeBorrowLimit = formatCentsToReadableValue({
    value: safeBorrowLimitCents
  })

  const readableNetApyPercentage = formatToReadablePercentage(netApyPercentage)

  const readableBorrowBalance = formatCentsToReadableValue({
    value: borrowBalanceCents,
    placeholder: '$0.00'
  })

  const readableDailyEarnings = formatCentsToReadableValue({
    value: dailyEarningsCents,
    placeholder: '$0.00'
  })

  const readableSupplyBalance = formatCentsToReadableValue({
    value: supplyBalanceCents,
    placeholder: '$0.00'
  })

  const safeBorrowLimitPercentage =
    typeof safeBorrowLimitCents === 'number' && typeof borrowLimitCents === 'number'
      ? calculatePercentage({
          numerator: safeBorrowLimitCents,
          denominator: borrowLimitCents
        })
      : 0

  const readableBorrowLimitUsedPercentage = formatToReadablePercentage(borrowLimitUsedPercentage)

  const readableBorrowLimit = formatCentsToReadableValue({
    value: borrowLimitCents
  })

  const renderSafePercent = safeBorrowLimitPercentage > 0

  return (
    <div className={styles.assetsInfo}>
      <div className={styles.assetsInfoWrapper}>
        <div className={styles.withStableCoinPrice}>
          <h1 className={styles.title}>{t('dashboard.userAssets')}</h1>
          <Price />
        </div>
        <div className={styles.netApy}>
          <p className={styles.title}>{t('dashboard.netApy')}</p>
          <span className={styles.percent}>{readableNetApyPercentage}</span>
        </div>
        <div className={styles.infoParts}>
          <div className={styles.partItem}>
            <DailyEarning width={40} height={40} />
            <div className={styles.partDetail}>
              <p className={styles.partLabel}>{t('dashboard.dailyEarnings')}</p>
              <h3 className={styles.partAmount}>{readableDailyEarnings} </h3>
            </div>
          </div>
          <div className={styles.partItem}>
            <DepositTotal width={40} height={40} />
            <div className={styles.partDetail}>
              <p className={styles.partLabel}>{t('dashboard.depositTotal')}</p>
              <h3 className={styles.partAmount}> {readableSupplyBalance} </h3>
            </div>
          </div>
          <div className={styles.partItem}>
            <BorrowTotal width={40} height={40} />
            <div className={styles.partDetail}>
              <p className={styles.partLabel}>{t('dashboard.borrowTotal')}</p>
              <h3 className={styles.partAmount}>{readableBorrowBalance} </h3>
            </div>
          </div>
        </div>
        <div className={styles.usedRatio}>
          <UsedRatio width={40} height={40} />
          <div className={styles.usedRatioDetail}>
            <div className={styles.usedRatioWrapper}>
              <p className={styles.usedRatioLabel}>
                {t('dashboard.usedRatio')}
                <span className={styles.ratioValue}>{readableBorrowLimitUsedPercentage}</span>
              </p>
              <p className={styles.usedRatioLabel}>
                {t('dashboard.limit')}
                <span className={styles.ratioValue}>{readableBorrowLimit}</span>
              </p>
            </div>
            <div className={styles.ratio}>
              <div className={styles.ratioBar}>
                <div
                  className={styles.ratioTrack}
                  style={{ width: readableBorrowLimitUsedPercentage }}
                />
                {renderSafePercent && (
                  <div
                    className={styles.safeTrack}
                    style={{ left: `${safeBorrowLimitPercentage}%` }}
                  />
                )}
              </div>
              <div className={styles.ratioText}>
                {t('dashboard.safeLimit')}
                <span className={styles.text}>{readableSafeBorrowLimit}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssetsInfo
