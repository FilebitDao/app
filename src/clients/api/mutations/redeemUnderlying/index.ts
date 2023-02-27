import BigNumber from 'bignumber.js'
import type { TransactionReceipt } from 'web3-core'

import { checkForTokenTransactionError } from 'errors'

import { NFilToken, NFrc20 } from 'types/contracts'

export interface RedeemUnderlyingInput {
  nTokenContract: NFrc20 | NFilToken
  accountAddress: string
  amountWei: BigNumber
}

export type RedeemUnderlyingOutput = TransactionReceipt

const redeemUnderlying = async ({
  nTokenContract,
  accountAddress,
  amountWei
}: RedeemUnderlyingInput): Promise<RedeemUnderlyingOutput> => {
  const resp = await nTokenContract.methods
    .redeemUnderlying(amountWei.toFixed())
    .send({ from: accountAddress })

  return checkForTokenTransactionError(resp)
}

export default redeemUnderlying
