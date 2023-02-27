import React, { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import BigNumber from 'bignumber.js'
import {
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis
} from 'recharts'

import { usegetNTokenApySimulations } from 'clients/api'
import type { NTokenApySnapshot } from 'clients/api/queries/getNTokenApySimulations/types'

import Tabs from 'components/Tab'
import type { TabContentProps } from 'components/Tab'

import useTailwind from 'hooks/useTailwind'
import useTheme from 'hooks/useTheme'

import { formatCentsToReadableValue, formatToReadablePercentage, getBigNumber } from 'utilities'

import styles from './index.module.scss'

interface UtilizationRateProps extends TabContentProps {
  readonly totalBorrowBalanceCents?: number
  readonly totalSupplyBalanceCents?: number
  readonly currentUtilizationRate?: number
}

interface InterestRateModelProps extends TabContentProps {
  readonly apySimulations?: NTokenApySnapshot[]
}

interface RateProps extends UtilizationRateProps, InterestRateModelProps {
  readonly reserveFactorMantissa?: BigNumber
  readonly nTokenId: string
}

const COLORS = ['#FB5E93', '#ACCBE2']

const UtilizationRate: FC<UtilizationRateProps> = ({
  totalBorrowBalanceCents,
  totalSupplyBalanceCents,
  currentUtilizationRate
}: UtilizationRateProps) => {
  const { t } = useTranslation()

  const totalBorrowBalance = useMemo(
    () =>
      formatCentsToReadableValue({
        value: totalBorrowBalanceCents,
        shortenLargeValue: true
      }),
    [totalBorrowBalanceCents]
  )

  const totalSupplyBalance = useMemo(
    () =>
      formatCentsToReadableValue({
        value: totalSupplyBalanceCents,
        shortenLargeValue: true
      }),
    [totalSupplyBalanceCents]
  )

  const availableLiquidity = useMemo(
    () =>
      formatCentsToReadableValue({
        value: getBigNumber(totalSupplyBalanceCents).minus(getBigNumber(totalBorrowBalanceCents)),
        shortenLargeValue: true
      }),
    [totalSupplyBalanceCents, totalBorrowBalanceCents]
  )

  const utilizationRate = useMemo(
    () => formatToReadablePercentage(currentUtilizationRate),
    [currentUtilizationRate]
  )

  const marketData = useMemo(
    () => [
      {
        value: (100 - (currentUtilizationRate ?? 0)) * 100
      },
      {
        value: (currentUtilizationRate ?? 0) * 100
      }
    ],
    [totalSupplyBalanceCents, totalBorrowBalanceCents]
  )

  return (
    <div className={styles.utilizationRate}>
      <div className={styles.leftChart}>
        <PieChart width={170} height={170}>
          <Pie data={marketData} innerRadius={70} outerRadius={85} stroke="none" dataKey="value">
            {marketData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
        <div className={styles.chartsValues}>
          <p className={styles.percent}>{utilizationRate}</p>
          <p className={styles.count}>{t('marketDetail.utilizationRate')}</p>
        </div>
      </div>
      <div className={styles.desc}>
        <div className={styles.liquidity}>
          <label className={styles.label}>{t('marketDetail.availableLiquidity')}</label>
          <p className={styles.value}>{availableLiquidity}</p>
        </div>
        <div className={styles.borrowDeposit}>
          <div className={styles.part}>
            <label className={styles.label}>{t('marketDetail.totalBorrowings')}</label>
            <p className={styles.value}>{totalBorrowBalance}</p>
          </div>
          <div className={styles.part}>
            <label className={styles.label}>{t('marketDetail.totalDeposits')}</label>
            <p className={styles.value}>{totalSupplyBalance}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const InterestRateModel: FC<InterestRateModelProps> = ({
  apySimulations
}: InterestRateModelProps) => {
  const { t } = useTranslation()
  const { isDark } = useTheme()
  const tailwind = useTailwind()

  const strokeColor = useMemo(() => (isDark ? tailwind.gray.light : tailwind.black.light), [isDark])

  return (
    <div className={styles.interestRateModel}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={apySimulations || []}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5
          }}
        >
          <Legend verticalAlign="top" height={36} />
          <XAxis
            dataKey="utilizationRate"
            axisLine={false}
            tickLine={false}
            tickFormatter={formatToReadablePercentage}
            tickCount={5}
            type="number"
            stroke={strokeColor}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tickFormatter={formatToReadablePercentage}
            tickCount={10}
            stroke={strokeColor}
          />
          <Line
            width={1}
            type="monotone"
            name={t('overview.borrowApy')}
            dataKey="borrowApyPercentage"
            stroke="#0FA0DC"
            isAnimationActive={false}
            dot={false}
          />
          <Line
            width={1}
            name={t('overview.supplyApy')}
            type="monotone"
            dataKey="supplyApyPercentage"
            stroke="#FB5E93"
            isAnimationActive={false}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

const Rate: FC<RateProps> = ({
  totalBorrowBalanceCents,
  totalSupplyBalanceCents,
  reserveFactorMantissa,
  currentUtilizationRate,
  nTokenId
}: RateProps) => {
  const { t } = useTranslation()

  const {
    data: interestRateChartData = {
      apySimulations: []
    }
  } = usegetNTokenApySimulations(
    {
      nTokenId,
      reserveFactorMantissa
    },
    {
      enabled: Boolean(nTokenId)
    }
  )

  return (
    <div className={styles.rate}>
      <Tabs
        tabs={[t('marketDetail.utilizationRate'), t('marketDetail.interestRateModel')]}
        content={[
          <UtilizationRate
            key="UtilizationRate"
            totalBorrowBalanceCents={totalBorrowBalanceCents}
            totalSupplyBalanceCents={totalSupplyBalanceCents}
            currentUtilizationRate={currentUtilizationRate}
          />,
          <InterestRateModel
            key="InterestRateModel"
            apySimulations={interestRateChartData.apySimulations}
          />
        ]}
      />
    </div>
  )
}

export default Rate
