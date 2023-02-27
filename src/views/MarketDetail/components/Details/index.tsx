import React, { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import BigNumber from 'bignumber.js'

import Tab from 'components/Tab'

import useGetChartData from 'hooks/marketDetail/useGetChartData'

import {
  calculatePercentage,
  formatCentsToReadableValue,
  formatToReadablePercentage,
  getBigNumber,
  stringify
} from 'utilities'

import BorrowChart from './Chart/Borrow'
import SupplyChart from './Chart/Supply'
import styles from './index.module.scss'

interface DetailsProps {
  readonly nTokenId: string
  readonly totalDeposit?: BigNumber
  readonly totalBorrow?: BigNumber
  readonly borrowApy?: BigNumber
  readonly borrowMiningApy?: number
  readonly supplyApy?: BigNumber
  readonly supplyMiningApy?: number
}

const Details: FC<DetailsProps> = ({
  nTokenId,
  totalDeposit,
  totalBorrow,
  borrowApy,
  borrowMiningApy,
  supplyApy,
  supplyMiningApy
}: DetailsProps) => {
  const { t } = useTranslation()
  const { supplyChartData, borrowChartData } = useGetChartData({ nTokenId })

  const supplyChartDatas = useMemo(() => {
    const total = supplyChartData.reduce(
      (current, value) => {
        current.apyPercentage += value.apyPercentage
        current.totalDeposit = current.totalDeposit.plus(value.balanceCents)

        return current
      },
      {
        totalDeposit: getBigNumber(0),
        apyPercentage: 0
      }
    )

    return {
      chartData: supplyChartData,
      currentTotalDeposit: formatCentsToReadableValue({
        value: totalDeposit,
        base: 1
      }),
      totalDeposit: formatCentsToReadableValue({
        value: total.totalDeposit,
        shortenLargeValue: true
      }),
      currentDepositApy: formatToReadablePercentage(supplyApy),
      avgDepositApy: formatToReadablePercentage(
        calculatePercentage({
          numerator: total.apyPercentage,
          denominator: supplyChartData.length,
          base: 1
        })
      ),
      currentMiningApy: formatToReadablePercentage(supplyMiningApy)
    }
  }, [stringify(supplyChartData), supplyApy, supplyMiningApy, totalDeposit])

  const borrowChartDatas = useMemo(() => {
    const total = borrowChartData.reduce(
      (current, value) => {
        current.apyPercentage += value.apyPercentage
        current.totalBorrow = current.totalBorrow.plus(value.balanceCents)

        return current
      },
      {
        totalBorrow: getBigNumber(0),
        apyPercentage: 0
      }
    )

    return {
      chartData: borrowChartData,
      currentTotalBorrow: formatCentsToReadableValue({
        value: totalBorrow,
        base: 1
      }),
      totalBorrow: formatCentsToReadableValue({
        value: total.totalBorrow,
        shortenLargeValue: true
      }),
      currentBorrowApy: formatToReadablePercentage(borrowApy),
      avgBorrowApy: formatToReadablePercentage(
        calculatePercentage({
          numerator: total.apyPercentage,
          denominator: borrowChartData.length,
          base: 1
        })
      ),
      currentMiningApy: formatToReadablePercentage(borrowMiningApy)
    }
  }, [stringify(borrowChartData), borrowApy, borrowMiningApy, totalBorrow])

  return (
    <div className={styles.details}>
      <Tab
        tabs={[t('marketDetail.supplyDetails'), t('marketDetail.borrowDetails')]}
        content={[
          <SupplyChart key="SupplyDetails" data={supplyChartDatas} />,
          <BorrowChart key="BorrowDetails" data={borrowChartDatas} />
        ]}
      />
    </div>
  )
}

export default Details
