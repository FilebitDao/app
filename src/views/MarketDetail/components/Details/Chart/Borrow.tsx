import React, { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useMediaQuery, useTheme as useMuiTheme } from '@mui/material'
import { format } from 'date-fns'
import { Bar, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip } from 'recharts'

import { ApyChartItem } from 'hooks/marketDetail/useGetChartData'
import useTailwind from 'hooks/useTailwind'
import useTheme from 'hooks/useTheme'

import { stringify, toFixed } from 'utilities'

import Chart from './Chart'
import styles from './index.module.scss'

interface BorrowDetailsData {
  readonly chartData: ApyChartItem[]
  readonly currentTotalBorrow: string
  readonly currentBorrowApy: string
  readonly avgBorrowApy: string
  readonly totalBorrow: string
  readonly currentMiningApy: string
}

interface BorrowDetailsProps {
  readonly data: BorrowDetailsData
}

const BorrowDetails: FC<BorrowDetailsProps> = ({
  data: {
    chartData,
    currentTotalBorrow,
    currentBorrowApy,
    avgBorrowApy,
    totalBorrow,
    currentMiningApy
  }
}: BorrowDetailsProps) => {
  const { t } = useTranslation()
  const days = useMemo(() => chartData.length, [chartData])
  const { isDark } = useTheme()
  const tailwind = useTailwind()
  const muiTheme = useMuiTheme()

  const isSmall = useMediaQuery(() => muiTheme.breakpoints.down(640))

  const strokeColor = useMemo(() => (isDark ? tailwind.gray.light : tailwind.black.light), [isDark])

  const chart = useMemo(() => {
    const totalMax = Math.max.apply(
      Math,
      chartData.map(item => item.balanceCents)
    )
    const apyMax = Math.max.apply(
      Math,
      chartData
        .map(item => item.miningApyPercentage)
        .concat(chartData.map(item => item.miningApyPercentage))
    )

    return {
      option: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            axis: 'x',
            label: {
              show: true,
              lineHeight: 16,
              height: 16,
              padding: [0, 4, 0, 4],
              backgroundColor: '#6e7079'
            },
            shadowStyle: {
              color: 'rgba(235, 238, 245, 0.5)'
            }
          },
          backgroundColor: '#ffffff',
          padding: 12
        },
        legend: {
          top: 16,
          left: 0,
          textStyle: {
            color: strokeColor,
            lineHeight: 16,
            height: 16
          },
          data: [
            t('marketDetail.totalBorrow'),
            t('marketDetail.borrowApy'),
            t('marketDetail.miningApy')
          ]
        },
        grid: {
          top: 74,
          right: 80,
          bottom: 20,
          left: 72
        },
        xAxis: [
          {
            type: 'category',
            axisLine: {
              lineStyle: {
                color: strokeColor
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
            },
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            show: false,
            type: 'value',
            name: t('marketDetail.totalBorrow'),
            min: '0',
            max: totalMax,
            interval: 0
          },
          {
            position: 'left',
            type: 'value',
            nameTextStyle: {
              color: strokeColor,
              lineHeight: 17,
              height: 17
            },
            axisLabel: {
              color: strokeColor,
              lineHeight: 17,
              height: 17,
              formatter: value => toFixed(value, 3)
            },
            splitLine: {
              lineStyle: {
                color: '#f3f5f9'
              }
            },
            name: t('marketDetail.borrowApy'),
            min: '0',
            max: apyMax,
            minInterval: apyMax / 5
          },
          {
            type: 'value',
            nameTextStyle: {
              color: strokeColor,
              lineHeight: 17,
              height: 17
            },
            axisLabel: {
              color: strokeColor,
              lineHeight: 17,
              height: 17,
              formatter: value => toFixed(value, 3)
            },
            splitLine: {
              lineStyle: {
                color: '#f3f5f9'
              }
            },
            name: t('marketDetail.miningApy'),
            min: '0',
            max: apyMax,
            minInterval: apyMax / 5
          }
        ],
        series: [
          {
            type: 'bar',
            barWidth: 16,
            barGap: '25%',
            name: t('marketDetail.totalBorrow'),
            itemStyle: {
              color: '#9e79b1'
            },
            data: chartData.map(item => [format(item.timestampMs, 'yyyy-MM-dd'), item.balanceCents])
          },
          {
            type: 'line',
            yAxisIndex: 1,
            showSymbol: false,
            smooth: true,
            name: t('marketDetail.borrowApy'),
            itemStyle: {
              color: '#DC6883'
            },
            data: chartData.map(item => [
              format(item.timestampMs, 'yyyy-MM-dd'),
              item.apyPercentage
            ])
          },
          {
            type: 'line',
            yAxisIndex: 2,
            showSymbol: false,
            smooth: true,
            name: t('marketDetail.miningApy'),
            itemStyle: {
              color: '#0FA0DC'
            },
            data: chartData.map(item => [
              format(item.timestampMs, 'yyyy-MM-dd'),
              item.miningApyPercentage
            ])
          }
        ]
      }
    }
  }, [stringify(chartData)])

  return (
    <div className={styles.supplyDetails}>
      <div className={styles.chart}>
        {isSmall ? (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              width={400}
              height={270}
              data={chartData}
              margin={{
                top: 0,
                right: 0,
                left: 0,
                bottom: 0
              }}
            >
              <Tooltip
                labelFormatter={(index: number) =>
                  format(chartData[index].timestampMs, 'yyyy-MM-dd')
                }
              />
              <Legend verticalAlign="top" align="left" height={36} />
              <Bar
                dataKey="balanceCents"
                barSize={10}
                fill="#9e79b1"
                yAxisId="left"
                legendType="rect"
                name={t('marketDetail.totalBorrow')}
              />
              <Line
                dot={false}
                strokeWidth={2}
                strokeLinecap="round"
                type="monotone"
                dataKey="apyPercentage"
                stroke="#DC6883"
                yAxisId="right"
                legendType="rect"
                name={t('marketDetail.borrowApy')}
              />
              <Line
                dot={false}
                strokeWidth={2}
                strokeLinecap="round"
                type="monotone"
                dataKey="miningApyPercentage"
                stroke="#0FA0DC"
                yAxisId="right"
                legendType="rect"
                name={t('marketDetail.miningApy')}
              />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <Chart chartData={chart} />
        )}
      </div>
      <div className={styles.chartsDetail}>
        <div className={styles.detailItem}>
          <label className={styles.label}>{t('marketDetail.currentTotalBorrow')}</label>
          <p className={styles.value}>{currentTotalBorrow}</p>
        </div>
        <div className={styles.detailItem}>
          <label className={styles.label}>{t('marketDetail.avgTotalBorrow', { days })}</label>
          <p className={styles.value}>{totalBorrow}</p>
        </div>
        <div className={styles.detailItem}>
          <label className={styles.label}>{t('marketDetail.currentBorrowApy')}</label>
          <p className={styles.value}>{currentBorrowApy}</p>
        </div>
        <div className={styles.detailItem}>
          <label className={styles.label}>{t('marketDetail.avgBorrowApy', { days })}</label>
          <p className={styles.value}>{avgBorrowApy}</p>
        </div>
        <div className={styles.detailItem}>
          <label className={styles.label}>{t('marketDetail.miningApy')}</label>
          <p className={styles.value}>{currentMiningApy}</p>
        </div>
      </div>
    </div>
  )
}

export default BorrowDetails
