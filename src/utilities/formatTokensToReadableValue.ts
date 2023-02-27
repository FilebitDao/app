import BigNumber from 'bignumber.js'

import PLACEHOLDER_KEY from 'constants/placeholderKey'

import { Token } from 'types'

import { shortenTokensWithSuffix } from './shortenTokensWithSuffix'

export const formatTokensToReadableValue = ({
  value,
  token,
  minimizeDecimals = false,
  shortenLargeValue = false,
  addSymbol = true,
  decimal = 6
}: {
  value: BigNumber | undefined
  token: Token
  minimizeDecimals?: boolean
  shortenLargeValue?: boolean
  addSymbol?: boolean
  decimal?: number
}) => {
  if (value === undefined) {
    return PLACEHOLDER_KEY
  }

  let decimalPlaces
  if (minimizeDecimals) {
    decimalPlaces = 8
  } else {
    decimalPlaces = token.decimals
  }

  if (decimal) {
    decimalPlaces = decimal
  }

  let symbolPlacement = ''
  if (addSymbol) {
    symbolPlacement = ` ${token.symbol}`
  }

  if (shortenLargeValue) {
    return `${shortenTokensWithSuffix(value)}${symbolPlacement}`
  }

  return `${value.dp(decimalPlaces, BigNumber.ROUND_DOWN).toFormat()}${symbolPlacement}`
}

export default formatTokensToReadableValue
