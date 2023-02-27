import React, { FC, useMemo } from 'react'

import useUserAssets from 'hooks/useUserAssets'

import BorrowMarketsList from './Lists/BorrowMarkets'
import BorrowingMarketsList from './Lists/BorrowingMarkets'
import SupplyMarketsList from './Lists/SupplyMarkets'
import SupplyingMarketsList from './Lists/SupplyingMarkets'
import BorrowMarketsTable from './Tables/BorrowMarkets'
import BorrowingMarketsTable from './Tables/BorrowingMarkets'
import SupplyMarketsTable from './Tables/SupplyMarkets'
import SupplyingMarketsTable from './Tables/SupplyingMarkets'
import styles from './index.module.scss'

const Markets: FC = () => {
  const { suppliedAssets, supplyMarketAssets, borrowingAssets, borrowMarketAssets } =
    useUserAssets()
  const userSupplied = useMemo(() => Boolean(suppliedAssets.length), [suppliedAssets])
  const userBorrowed = useMemo(() => Boolean(borrowingAssets.length), [borrowingAssets])

  return (
    <>
      <div className={styles.markets}>
        <div className={styles.market}>
          {userSupplied && <SupplyingMarketsTable supplyAssets={suppliedAssets} />}
          <SupplyMarketsTable supplyAssets={supplyMarketAssets} />
        </div>
        <div className={styles.market}>
          {userBorrowed && <BorrowingMarketsTable borrowAssets={borrowingAssets} />}
          <BorrowMarketsTable borrowAssets={borrowMarketAssets} />
        </div>
      </div>
      <div className={styles.marktsList}>
        {userSupplied && <SupplyingMarketsList supplyAssets={suppliedAssets} />}
        <SupplyMarketsList supplyAssets={supplyMarketAssets} />
        {userBorrowed && <BorrowingMarketsList borrowAssets={borrowingAssets} />}
        <BorrowMarketsList borrowAssets={borrowMarketAssets} />
      </div>
    </>
  )
}

export default Markets
