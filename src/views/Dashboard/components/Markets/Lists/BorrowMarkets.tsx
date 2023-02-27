import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useModal } from 'react-modal-better-hooks'

import Accordion from 'components/Accordion'
import { BorrowRepay } from 'components/OperateAsset'
import Symbol from 'components/Symbol'

import { BORROW_REPAY, BorrowRepayId } from 'modals/BorrowRepay'
import type { BorrowRepayProps } from 'modals/BorrowRepay'

import type { Asset } from 'types'

import {
  formatCentsToReadableValue,
  formatToReadablePercentage,
  formatTokensToReadableValue
} from 'utilities'

import styles from './index.module.scss'

interface BorrowMarketsProps {
  readonly borrowAssets: Asset[]
}

const BorrowMarkets: FC<BorrowMarketsProps> = ({ borrowAssets }: BorrowMarketsProps) => {
  const { t } = useTranslation()
  const [, { open: openBorrowRepay }] = useModal<BorrowRepayProps>(BorrowRepayId)

  return (
    <Accordion<Asset>
      title={t('dashboard.borrowMarket')}
      getId={market => market.token.address}
      data={borrowAssets}
      summaryRender={market => <Symbol symbol={market.token.symbol} icon={market.token.asset} />}
      detailRender={market => (
        <div className={styles.detailCard}>
          <div className={styles.cardRow}>
            <span className={styles.cardLabel}>{t('dashboard.apy')}</span>
            <p className={styles.cardValue}>
              {formatToReadablePercentage(market.nwlBorrowApy.plus(market.borrowApy))}
            </p>
          </div>
          <div className={styles.cardRow}>
            <span className={styles.cardLabel}>{t('dashboard.walletBalance')}</span>
            <p className={styles.cardValue}>
              {formatTokensToReadableValue({
                value: market.walletBalance,
                token: market.token,
                shortenLargeValue: true,
                minimizeDecimals: true
              })}
            </p>
          </div>
          <div className={styles.cardRow}>
            <span className={styles.cardLabel}>{t('dashboard.liquidity')}</span>
            <p className={styles.cardValue}>
              {formatCentsToReadableValue({
                value: market.liquidity.multipliedBy(100),
                shortenLargeValue: true
              })}
            </p>
          </div>
          <BorrowRepay
            onBorrow={() =>
              openBorrowRepay({
                type: BORROW_REPAY.BORROW,
                asset: market
              })
            }
            onRepay={() =>
              openBorrowRepay({
                type: BORROW_REPAY.REPAY,
                asset: market
              })
            }
          />
        </div>
      )}
    />
  )
}

export default BorrowMarkets
