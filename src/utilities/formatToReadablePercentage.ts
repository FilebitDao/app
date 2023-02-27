import BigNumber from 'bignumber.js'

import PLACEHOLDER_KEY from 'constants/placeholderKey'

import { formatPercentage } from 'utilities'

const formatToReadablePercentage = (value: number | string | BigNumber | undefined) => {
  if (value === undefined) {
    return PLACEHOLDER_KEY
  }

  return `${formatPercentage(value)}%`
}

export default formatToReadablePercentage
