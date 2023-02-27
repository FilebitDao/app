import BigNumber from 'bignumber.js'

import PLACEHOLDER_KEY from 'constants/placeholderKey'

import { shortenTokensWithSuffix } from 'utilities'

const formatCentsToReadableValue = ({
  value,
  shortenLargeValue = false,
  placeholder = '',
  base = 100
}: {
  value: number | BigNumber | undefined
  base?: number
  shortenLargeValue?: boolean
  placeholder?: string
}) => {
  if (value === undefined) {
    return placeholder || PLACEHOLDER_KEY
  }

  const wrappedValueDollars = new BigNumber(value).dividedBy(base)

  if (!shortenLargeValue) {
    return `$${wrappedValueDollars.toFormat(2)}`
  }

  // Shorten value
  const shortenedValue = shortenTokensWithSuffix(wrappedValueDollars)
  return `$${shortenedValue}`
}

export default formatCentsToReadableValue
