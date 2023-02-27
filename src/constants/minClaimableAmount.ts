import { convertTokensToWei, getBigNumber } from 'utilities'

import { TOKENS } from './tokens'

export const MIN_CLAIMBLE_AMOUNT = convertTokensToWei({
  value: getBigNumber(0.01),
  token: TOKENS.nwl
})
