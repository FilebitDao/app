import BigNumber from 'bignumber.js'

import getBigNumber from './getBigNumber'

const BIG_ZERO = new BigNumber(0)

export const shortenTokensWithSuffix = (value: BigNumber) => {
  const ONE_BILLION = 1000000000
  const ONE_MILLION = 1000000
  const ONE_THOUSAND = 1000

  const MILLION_BILLION = ONE_MILLION * ONE_BILLION
  const THOUSAND_BILLION = ONE_THOUSAND * ONE_BILLION

  const shortenedValue = value.toFixed(2)

  const valueBigNumber = getBigNumber(value)

  if (valueBigNumber.isEqualTo(BIG_ZERO)) {
    return '0'
  }

  if (value.isGreaterThanOrEqualTo(MILLION_BILLION)) {
    const fixed = value.toNumber().toExponential(11).split('e+')
    return [Number(fixed[0]).toFixed(2), fixed[1]].join('e+')
  }

  if (value.isGreaterThanOrEqualTo(THOUSAND_BILLION)) {
    return `${value.dividedBy(THOUSAND_BILLION).dp(2).toFormat()}KB`
  }

  if (value.isGreaterThanOrEqualTo(ONE_BILLION)) {
    return `${value.dividedBy(ONE_BILLION).dp(2).toFormat()}B`
  }

  if (value.isGreaterThanOrEqualTo(ONE_MILLION)) {
    return `${value.dividedBy(ONE_MILLION).dp(2).toFormat()}M`
  }

  if (value.isGreaterThanOrEqualTo(ONE_THOUSAND)) {
    return `${value.dividedBy(ONE_THOUSAND).dp(2).toFormat()}K`
  }

  if (valueBigNumber.isInteger()) {
    return parseInt(shortenedValue, 10)
  }

  return shortenedValue
}

export default shortenTokensWithSuffix
