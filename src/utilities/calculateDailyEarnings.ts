import BigNumber from 'bignumber.js'

import type { Asset } from 'types'

import calculateDailyEarningsCents from './calculateDailyEarningsCents'
import { calculateYearlyEarningsForAssets } from './calculateYearlyEarnings'

interface IalculateDailyEarningsInput {
  readonly tokenAmount?: BigNumber
  readonly dailyNwlDistributionInterestsCents?: BigNumber
  readonly assets: Asset[]
  readonly asset: Asset
}

const calculateDailyEarnings = ({
  asset,
  assets,
  dailyNwlDistributionInterestsCents,
  tokenAmount = new BigNumber(0)
}: IalculateDailyEarningsInput) => {
  const updatedAssets = assets.map(assetData => ({
    ...assetData,
    borrowBalance:
      assetData.token.address === asset.token.address
        ? assetData.borrowBalance.plus(tokenAmount)
        : assetData.borrowBalance
  }))

  const yearlyEarningsCents =
    dailyNwlDistributionInterestsCents &&
    calculateYearlyEarningsForAssets({
      assets: updatedAssets,
      dailyNwlDistributionInterestsCents
    })

  return yearlyEarningsCents && calculateDailyEarningsCents(yearlyEarningsCents)
}

export default calculateDailyEarnings
