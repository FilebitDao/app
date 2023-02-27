import ReactECharts from 'echarts-for-react'
import React, { FC } from 'react'

interface ChartProps {
  readonly chartData: $TSFixMe
}

const Chart: FC<ChartProps> = ({ chartData }: ChartProps) => (
  <ReactECharts {...chartData} opts={{ renderer: 'svg' }} style={{ height: '270px' }} />
)

export default Chart
