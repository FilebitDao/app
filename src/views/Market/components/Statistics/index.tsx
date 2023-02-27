import React, { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import BigNumber from 'bignumber.js'
import classnames from 'classnames'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

import type { Market } from 'types'

import { calculatePercentage, formatCentsToReadableValue, unsafelyGetToken } from 'utilities'
import stringify from 'utilities/stringify'

import styles from './index.module.scss'

interface StatisticsProps {
  readonly markets: Market[]
}

interface Percent {
  readonly name: string
  readonly value: string | number
}

const COLORS = ['#ACCBE2', '#9E79B1', '#F66096']

const Statistics: FC<StatisticsProps> = ({ markets }: StatisticsProps) => {
  const { t } = useTranslation()

  const supplyMarkets = useMemo(() => {
    const copyiedMarkets = [...markets]
    const total = copyiedMarkets.reduce(
      (prev, market) => prev.plus(market.treasuryTotalSupplyCents),
      new BigNumber(0)
    )
    const sorted = copyiedMarkets
      .sort((prev, next) =>
        next.treasuryTotalSupplyCents.minus(prev.treasuryTotalSupplyCents).toNumber()
      )
      .splice(0, 2)
    const percents = sorted.map(market => ({
      name: unsafelyGetToken(market.id).symbol,
      value: calculatePercentage({
        numerator: market.treasuryTotalSupplyCents.toNumber(),
        denominator: total.toNumber()
      })
    }))
    const othersPercent = new BigNumber(100).minus(
      percents.reduce((value, item) => value + item.value, 0)
    )

    return {
      total: formatCentsToReadableValue({
        value: total
      }),
      totalShorted: formatCentsToReadableValue({
        value: total,
        shortenLargeValue: true
      }),
      percents: [
        ...percents,
        {
          name: t('market.others'),
          value: othersPercent.toNumber()
        } as Percent
      ].map(item => ({
        ...item,
        value: Number(new BigNumber(item.value).toFixed(2))
      }))
    }
  }, [stringify(markets)])

  const borrowMarkets = useMemo(() => {
    const copyiedMarkets = [...markets]
    const total = copyiedMarkets.reduce(
      (prev, market) => prev.plus(market.treasuryTotalBorrowsCents),
      new BigNumber(0)
    )
    const sorted = copyiedMarkets
      .sort((prev, next) =>
        next.treasuryTotalBorrowsCents.minus(prev.treasuryTotalBorrowsCents).toNumber()
      )
      .splice(0, 2)
    const percents = sorted.map(market => ({
      name: unsafelyGetToken(market.id).symbol,
      value: calculatePercentage({
        numerator: market.treasuryTotalBorrowsCents.toNumber(),
        denominator: total.toNumber()
      })
    }))
    const othersPercent = new BigNumber(100).minus(
      percents.reduce((value, item) => value + item.value, 0)
    )

    return {
      total: formatCentsToReadableValue({
        value: total
      }),
      totalShorted: formatCentsToReadableValue({
        value: total,
        shortenLargeValue: true
      }),
      percents: [
        ...percents,
        {
          name: t('market.others'),
          value: othersPercent.toNumber()
        }
      ].map(item => ({
        ...item,
        value: Number(new BigNumber(item.value).toFixed(2))
      }))
    }
  }, [stringify(markets)])

  return (
    <div className={styles.statistics}>
      <div className={styles.statisticsPart}>
        <div className={styles.leftInfo}>
          <h1 className={styles.title}>{t('market.totalSupply')}</h1>
          <span className={styles.count}>{supplyMarkets.total}</span>
          <div className={styles.percent}>
            {supplyMarkets.percents.map(({ name, value }) => (
              <div key={name} className={styles.percentRow}>
                {name} {value}%
              </div>
            ))}
          </div>
        </div>
        <div className={styles.charts}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart width={130} height={130}>
              <Pie
                data={supplyMarkets.percents}
                innerRadius={50}
                outerRadius={65}
                stroke="none"
                dataKey="value"
              >
                {supplyMarkets.percents.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className={styles.chartsValues}>
            <p className={styles.percent}>{supplyMarkets.totalShorted}</p>
          </div>
        </div>
      </div>
      <div className={classnames([styles.statisticsPart, styles.borrow])}>
        <div className={styles.leftInfo}>
          <h1 className={styles.title}>{t('market.totalBorrow')}</h1>
          <span className={styles.count}>{borrowMarkets.total}</span>
          <div className={styles.percent}>
            {borrowMarkets.percents.map(({ name, value }) => (
              <div key={name} className={styles.percentRow}>
                {name} {value}%
              </div>
            ))}
          </div>
        </div>
        <div className={styles.charts}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart width={130} height={130}>
              <Pie
                data={borrowMarkets.percents}
                innerRadius={50}
                outerRadius={65}
                stroke="none"
                dataKey="value"
              >
                {borrowMarkets.percents.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className={styles.chartsValues}>
            <p className={styles.percent}>{borrowMarkets.totalShorted}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Statistics
