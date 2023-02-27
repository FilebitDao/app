import React, { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { generatePath, useHistory } from 'react-router-dom'

import BigNumber from 'bignumber.js'

import Symbol from 'components/Symbol'
import TableContainer from 'components/Table'

import Path from 'constants/path'

import type { Market, Token } from 'types'

import { formatCentsToReadableValue, formatToReadablePercentage, unsafelyGetToken } from 'utilities'
import stringify from 'utilities/stringify'

import styles from './index.module.scss'

interface MarketTableProps {
  readonly markets: Market[]
}

interface MarketRow extends Market {
  readonly token: Token
  readonly depositTotalApyValue: BigNumber
  readonly borrowTotalApyValue: BigNumber
}

const MarketTable: FC<MarketTableProps> = ({ markets }: MarketTableProps) => {
  const { t } = useTranslation()
  const history = useHistory()

  const marketsData = useMemo<MarketRow[]>(
    () =>
      markets.map(market => ({
        ...market,
        depositTotalApyValue: market.supplyApy.plus(market.supplyNarwhalApy),
        borrowTotalApyValue: market.borrowApy.plus(market.borrowNarwhalApy),
        token: unsafelyGetToken(market.id)
      })),
    [stringify(markets)]
  )

  const marketColumns = [
    {
      label: t('market.assest'),
      render: (row: MarketRow) => <Symbol symbol={row.token.symbol} icon={row.token.asset} />
    },
    {
      label: t('market.depositMarket'),
      key: 'treasuryTotalSupplyCents',
      sortable: true,
      render: (row: MarketRow) =>
        formatCentsToReadableValue({
          value: row.treasuryTotalSupplyCents,
          shortenLargeValue: true
        })
    },
    {
      label: t('market.depositTotalApy'),
      key: 'depositTotalApyValue',
      className: 'deposit-total-apy-value',
      sortable: true,
      render: (row: MarketRow) =>
        formatToReadablePercentage(row.supplyApy.plus(row.supplyNarwhalApy))
    },
    {
      label: t('market.borrowMarket'),
      key: 'treasuryTotalBorrowsCents',
      sortable: true,
      render: (row: MarketRow) =>
        formatCentsToReadableValue({
          value: row.treasuryTotalBorrowsCents,
          shortenLargeValue: true
        })
    },
    {
      label: t('market.borrowTotalApy'),
      key: 'borrowTotalApyValue',
      className: 'borrow-total-apy-value',
      sortable: true,
      render: (row: MarketRow) =>
        formatToReadablePercentage(row.borrowApy.plus(row.borrowNarwhalApy))
    },
    {
      label: t('market.liquidity'),
      key: 'liquidity',
      sortable: true,
      render: (row: MarketRow) =>
        formatCentsToReadableValue({
          value: row.liquidity.multipliedBy(100),
          shortenLargeValue: true
        })
    }
  ]

  return (
    <div className={styles.markets}>
      <TableContainer<MarketRow>
        columns={marketColumns}
        data={marketsData}
        onRowClick={row => {
          history.push(
            generatePath(Path.MARKET_DETAILS, {
              tokenId: row.id
            })
          )
        }}
      />
    </div>
  )
}

export default MarketTable
