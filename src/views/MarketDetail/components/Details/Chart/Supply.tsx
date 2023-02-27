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

interface SupplyDetailsData {
  readonly chartData: ApyChartItem[]
  readonly currentTotalDeposit: string
  readonly currentDepositApy: string
  readonly avgDepositApy: string
  readonly totalDeposit: string
  readonly currentMiningApy: string
}

interface SupplyDetailsProps {
  readonly data: SupplyDetailsData
}

const SupplyDetails: FC<SupplyDetailsProps> = ({
  data: {
    chartData,
    currentTotalDeposit,
    currentDepositApy,
    avgDepositApy,
    totalDeposit,
    currentMiningApy
  }
}: SupplyDetailsProps) => {
  const { t } = useTranslation()
  const { isDark } = useTheme()
  const tailwind = useTailwind()
  const muiTheme = useMuiTheme()

  const days = useMemo(() => chartData.length, [chartData])

  const strokeColor = useMemo(() => (isDark ? tailwind.gray.light : tailwind.black.light), [isDark])

  const isSmall = useMediaQuery(() => muiTheme.breakpoints.down(640))

  const chart = useMemo(() => {
    const totalMax = Math.max.apply(
      Math,
      chartData.map(item => item.balanceCents)
    )
    const apyMax = Math.max.apply(
      Math,
      chartData
        .map(item => item.apyPercentage)
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
            t('marketDetail.totalDeposit'),
            t('marketDetail.depositApy'),
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
            name: t('marketDetail.totalDeposit'),
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
            name: t('marketDetail.depositApy'),
            min: '0',
            max: apyMax,
            maxInterval: apyMax / 5
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
            maxInterval: apyMax / 5
          }
        ],
        series: [
          {
            type: 'bar',
            barWidth: 16,
            barGap: '25%',
            name: t('marketDetail.totalDeposit'),
            itemStyle: {
              color: '#EE9EBF'
            },
            data: chartData.map(item => [format(item.timestampMs, 'yyyy-MM-dd'), item.balanceCents])
          },
          {
            type: 'line',
            yAxisIndex: 1,
            showSymbol: false,
            smooth: true,
            name: t('marketDetail.depositApy'),
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
                fill="#EE9EBF"
                yAxisId="left"
                legendType="rect"
                name={t('marketDetail.totalDeposit')}
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
                name={t('marketDetail.depositApy')}
              />
              <Line
                dot={false}
                strokeWidth={2}
                strokeLinecap="round"
                type="monotone"
                dataKey="miningApyPercentage"
                stroke="#3B7AD9"
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
          <label className={styles.label}>{t('marketDetail.currentTotalDeposit')}</label>
          <p className={styles.value}>{currentTotalDeposit}</p>
        </div>
        <div className={styles.detailItem}>
          <label className={styles.label}>{t('marketDetail.avgTotalDeposit', { days })}</label>
          <p className={styles.value}>{totalDeposit}</p>
        </div>
        <div className={styles.detailItem}>
          <label className={styles.label}>{t('marketDetail.currentDepositApy')}</label>
          <p className={styles.value}>{currentDepositApy}</p>
        </div>
        <div className={styles.detailItem}>
          <label className={styles.label}>{t('marketDetail.avgDepositApy', { days })}</label>
          <p className={styles.value}>{avgDepositApy}</p>
        </div>
        <div className={styles.detailItem}>
          <label className={styles.label}>{t('marketDetail.miningApy')}</label>
          <p className={styles.value}>{currentMiningApy}</p>
        </div>
      </div>
    </div>
  )
}

export default SupplyDetails
