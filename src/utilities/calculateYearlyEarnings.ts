import BigNumber from 'bignumber.js'

import { DAYS_PER_YEAR } from 'constants/daysPerYear'

import { Asset } from 'types'

export const calculateYearlyEarningsForAsset = ({ asset }: { asset: Asset }) => {
  const assetBorrowBalanceCents = asset.borrowBalance
    .multipliedBy(asset.tokenPrice)
    .multipliedBy(100)
  const assetSupplyBalanceCents = asset.supplyBalance
    .multipliedBy(asset.tokenPrice)
    .multipliedBy(100)

  const supplyYearlyEarningsCents = assetSupplyBalanceCents.multipliedBy(
    asset.supplyApy.dividedBy(100)
  )
  // Note that borrowYearlyInterests will always be negative (or 0), since
  // the borrow APY is expressed with a negative percentage)
  const borrowYearlyEarningsCents = assetBorrowBalanceCents.multipliedBy(
    asset.borrowApy.dividedBy(100)
  )

  const yearlyEarningsCents = supplyYearlyEarningsCents.plus(borrowYearlyEarningsCents)

  if (!asset.nwlSupplyApr.isFinite() || !asset.nwlBorrowApr.isFinite()) {
    return supplyYearlyEarningsCents.plus(borrowYearlyEarningsCents)
  }

  const supplyYearlyNwlDistributionEarningsCents = supplyYearlyEarningsCents.multipliedBy(
    asset.nwlSupplyApr.dividedBy(100)
  )

  const borrowYearlyNwlDistributionEarningsCents = borrowYearlyEarningsCents.multipliedBy(
    asset.nwlBorrowApr.dividedBy(100)
  )

  return yearlyEarningsCents
    .plus(supplyYearlyNwlDistributionEarningsCents)
    .plus(borrowYearlyNwlDistributionEarningsCents)
}

export const calculateYearlyEarningsForAssets = ({
  assets,
  dailyNwlDistributionInterestsCents
}: {
  assets: Asset[]
  dailyNwlDistributionInterestsCents: BigNumber
}) => {
  // We use the yearly earnings to calculate the daily earnings the net APY
  let yearlyEarningsCents: BigNumber | undefined

  assets.forEach(asset => {
    if (!yearlyEarningsCents) {
      yearlyEarningsCents = new BigNumber(0)
    }

    const assetYearlyEarningsCents = calculateYearlyEarningsForAsset({
      asset
    })

    yearlyEarningsCents = yearlyEarningsCents.plus(assetYearlyEarningsCents)
  })

  if (yearlyEarningsCents) {
    const yearlyNwlDistributionInterestsCents =
      dailyNwlDistributionInterestsCents.multipliedBy(DAYS_PER_YEAR)

    yearlyEarningsCents = yearlyEarningsCents.plus(yearlyNwlDistributionInterestsCents)
  }

  return yearlyEarningsCents
}
