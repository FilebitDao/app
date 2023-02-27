import BigNumber from 'bignumber.js'

import { TOKENS } from 'constants/tokens'

import { TransactionResponse } from './types'
import { TransactionCategory, TransactionEvent } from 'types'

import { convertTokensToWei, getNTokenByAddress, unsafelyGetToken } from 'utilities'

const formatTransaction = ({
  amount,
  createdAt,
  updatedAt,
  category,
  event,
  nTokenAddress,
  ...rest
}: TransactionResponse) => {
  const nToken = getNTokenByAddress(nTokenAddress)
  const token = (nToken && unsafelyGetToken(nToken.id)) || TOKENS.nwl

  return {
    ...rest,
    amountWei: convertTokensToWei({ value: new BigNumber(amount), token }),
    createdAt: new Date(createdAt),
    updatedAt: new Date(updatedAt),
    category: category as TransactionCategory,
    event: event as TransactionEvent,
    nTokenAddress
  }
}
export default formatTransaction
