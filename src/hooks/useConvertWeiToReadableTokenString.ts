import { useMemo } from 'react'

import PLACEHOLDER_KEY from 'constants/placeholderKey'

import { ConvertWeiToTokensInput, convertWeiToTokens } from 'utilities'

export interface UseConvertWeiToReadableTokenStringInput
  extends Omit<ConvertWeiToTokensInput, 'valueWei' | 'returnInReadableFormat'> {
  valueWei: ConvertWeiToTokensInput['valueWei'] | undefined
}

const useConvertWeiToReadableTokenString = (params: UseConvertWeiToReadableTokenStringInput) =>
  useMemo(
    () =>
      params.valueWei
        ? convertWeiToTokens({
            ...(params as ConvertWeiToTokensInput),
            returnInReadableFormat: true
          })
        : PLACEHOLDER_KEY,
    [
      params.valueWei?.toFixed(),
      params.token,
      params.minimizeDecimals,
      params.addSymbol,
      params.shortenLargeValue
    ]
  )

export default useConvertWeiToReadableTokenString
