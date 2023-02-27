import React, { FC, useMemo } from 'react'

import BigNumber from 'bignumber.js'

import useDailyNwlDistributionInterests from 'hooks/useDailyNwlDistributionInterests'

import type { Asset } from 'types'

import {
  calculateDailyEarningsCents,
  calculateNetApy,
  calculateYearlyEarningsForAssets
} from 'utilities'
import stringify from 'utilities/stringify'

import AssetsInfo from './AssetsInfo'
import type { AssetsInfoProps } from './AssetsInfo'
import MintRepay from './MintRepay'
import styles from './index.module.scss'

interface UserAssetsProps {
  readonly assets: Asset[]
  readonly userTotalBorrowLimitCents: BigNumber
  readonly userTotalBorrowBalanceCents: BigNumber
  readonly userTotalSupplyBalanceCents: BigNumber
}

type CalculationsResultType = Pick<
  AssetsInfoProps,
  'netApyPercentage' | 'dailyEarningsCents' | 'supplyBalanceCents' | 'borrowLimitCents'
>

const UserAssets: FC<UserAssetsProps> = ({
  assets,
  userTotalBorrowBalanceCents,
  userTotalSupplyBalanceCents,
  userTotalBorrowLimitCents
}: UserAssetsProps) => {
  const { dailyNwlDistributionInterestsCents } = useDailyNwlDistributionInterests()

  const calculations = useMemo<CalculationsResultType>(() => {
    const yearlyEarningsCents =
      dailyNwlDistributionInterestsCents &&
      calculateYearlyEarningsForAssets({
        assets,
        dailyNwlDistributionInterestsCents
      })
    const netApyPercentage =
      userTotalSupplyBalanceCents &&
      yearlyEarningsCents &&
      calculateNetApy({
        supplyBalanceCents: userTotalSupplyBalanceCents,
        yearlyEarningsCents
      })
    const dailyEarningsCents =
      yearlyEarningsCents && +calculateDailyEarningsCents(yearlyEarningsCents).toFixed(0)
    return {
      netApyPercentage,
      dailyEarningsCents,
      supplyBalanceCents: userTotalSupplyBalanceCents?.toNumber(),
      borrowLimitCents: userTotalBorrowLimitCents.toNumber()
    }
  }, [stringify(assets), dailyNwlDistributionInterestsCents])

  return (
    <div className={styles.userAssets}>
      <AssetsInfo {...calculations} borrowBalanceCents={userTotalBorrowBalanceCents.toNumber()} />
      <MintRepay />
    </div>
  )
}

export default UserAssets
