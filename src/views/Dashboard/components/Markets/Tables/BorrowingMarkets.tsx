import React, { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useModal } from 'react-modal-better-hooks'

import { BorrowRepay } from 'components/OperateAsset'
import Symbol from 'components/Symbol'
import TableContainer from 'components/Table'

import { BORROW_REPAY, BorrowRepayId } from 'modals/BorrowRepay'
import type { BorrowRepayProps } from 'modals/BorrowRepay'

import type { Asset } from 'types'

import {
  formatCentsToReadableValue,
  formatToReadablePercentage,
  formatTokensToReadableValue,
  stringify
} from 'utilities'

interface BorrowingMarketsProps {
  readonly borrowAssets: Asset[]
}

const BorrowingMarkets: FC<BorrowingMarketsProps> = ({ borrowAssets }: BorrowingMarketsProps) => {
  const { t } = useTranslation()
  const [, { open: openBorrowRepay }] = useModal<BorrowRepayProps>(BorrowRepayId)

  const borrowData = useMemo<Asset[]>(
    () =>
      borrowAssets.map(asset => ({
        ...asset,
        apy: asset.nwlBorrowApy.plus(asset.borrowApy)
      })),
    [stringify(borrowAssets)]
  )

  const borrowMarketColumns = [
    {
      label: t('dashboard.assest'),
      render: (row: Asset) => <Symbol symbol={row.token.symbol} icon={row.token.asset} />
    },
    {
      label: t('dashboard.apy'),
      sortable: true,
      key: 'apy',
      render: (row: Asset) => formatToReadablePercentage(row.nwlBorrowApy.plus(row.borrowApy))
    },
    {
      label: t('dashboard.walletBalance'),
      sortable: true,
      key: 'borrowBalance',
      render: (row: Asset) =>
        formatTokensToReadableValue({
          value: row.borrowBalance,
          token: row.token,
          shortenLargeValue: true,
          minimizeDecimals: true
        })
    },
    {
      label: t('dashboard.liquidity'),
      sortable: true,
      key: 'liquidity',
      render: (row: Asset) =>
        formatCentsToReadableValue({
          value: row.liquidity.multipliedBy(100),
          shortenLargeValue: true
        })
    },
    {
      render: (row: Asset) => (
        <BorrowRepay
          onBorrow={() =>
            openBorrowRepay({
              type: BORROW_REPAY.BORROW,
              asset: row
            })
          }
          onRepay={() =>
            openBorrowRepay({
              type: BORROW_REPAY.REPAY,
              asset: row
            })
          }
        />
      )
    }
  ]

  return (
    <TableContainer<Asset>
      collapse
      title={t('dashboard.borrow')}
      columns={borrowMarketColumns}
      data={borrowData}
    />
  )
}

export default BorrowingMarkets
